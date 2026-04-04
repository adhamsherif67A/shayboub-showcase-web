import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Mail, Lock, AlertCircle } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, user, isAdmin } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (user && user.role) {
      // Only redirect admins to admin, everyone else stays on this page or goes home
      if (isAdmin) {
        navigate("/admin", { replace: true });
      } else if (user.role === "staff") {
        navigate("/staff", { replace: true });
      } else {
        // Customers shouldn't be using admin login page
        navigate("/", { replace: true });
      }
    }
  }, [user, isAdmin, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password);
      // Navigation will happen automatically via auth state change
    } catch (err: any) {
      console.error(err);
      if (err.code === "auth/user-not-found" || err.code === "auth/wrong-password") {
        setError("Invalid email or password");
      } else if (err.code === "auth/invalid-email") {
        setError("Invalid email address");
      } else if (err.code === "auth/too-many-requests") {
        setError("Too many failed attempts. Please try again later.");
      } else {
        setError("Failed to login. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary px-4">
      <div className="w-full max-w-md">
        <div className="bg-card rounded-2xl shadow-xl p-8 border border-border">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md">
              <img 
                src="/images/shayboub-logo.png" 
                alt="Shayboub Logo" 
                className="w-16 h-16 object-contain"
              />
            </div>
            <h1 className="font-display text-2xl font-bold text-foreground">
              Shayboub Admin
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Sign in to manage your café
            </p>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-destructive shrink-0" />
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@shayboub.com"
                  required
                  className="w-full pl-11 pr-4 py-3 rounded-lg border border-border bg-background 
                    text-foreground placeholder:text-muted-foreground
                    focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary
                    transition-all"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-11 pr-4 py-3 rounded-lg border border-border bg-background 
                    text-foreground placeholder:text-muted-foreground
                    focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary
                    transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-primary-foreground font-semibold py-3 rounded-lg
                hover:opacity-90 hover:shadow-lg hover:shadow-primary/25 
                active:scale-[0.98] transition-all duration-200
                disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Back to website */}
          <div className="mt-6 text-center">
            <a 
              href="/" 
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              ← Back to website
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
