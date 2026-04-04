import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Mail, Lock, AlertCircle, LogOut } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, logout, user, isAdmin } = useAuth();
  const { t, isRTL } = useLanguage();
  const navigate = useNavigate();

  // Only redirect if already logged in as admin/staff
  useEffect(() => {
    if (user && user.role) {
      if (isAdmin) {
        navigate("/admin", { replace: true });
      } else if (user.role === "staff") {
        navigate("/staff", { replace: true });
      }
      // If customer, DON'T redirect - show "switch account" option instead
    }
  }, [user, isAdmin, navigate]);

  // If user is logged in but not admin/staff, show switch account option
  if (user && user.role && user.role !== "admin" && user.role !== "staff") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center px-4" dir={isRTL ? "rtl" : "ltr"}>
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{t.adminAuth.switchAccountTitle}</h2>
          <p className="text-gray-600 mb-2">{t.adminAuth.currentlyLoggedIn}</p>
          <p className="font-semibold text-orange-600 mb-6">{user.email}</p>
          <p className="text-gray-500 mb-6 text-sm">{t.adminAuth.customerAccountWarning}</p>
          <button
            onClick={async () => {
              await logout();
              window.location.reload();
            }}
            className="w-full bg-orange-600 text-white py-3 rounded-xl font-semibold hover:bg-orange-700 transition-colors flex items-center justify-center gap-2"
          >
            <LogOut size={20} />
            {t.adminAuth.logoutAndSwitch}
          </button>
          <button
            onClick={() => navigate("/")}
            className="mt-4 text-orange-600 hover:text-orange-700 font-medium"
          >
            {t.errors.backToHome}
          </button>
        </div>
      </div>
    );
  }

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
        setError(t.adminAuth.invalidCredentials);
      } else if (err.code === "auth/invalid-email") {
        setError(t.adminAuth.invalidEmail);
      } else if (err.code === "auth/too-many-requests") {
        setError(t.adminAuth.tooManyAttempts);
      } else {
        setError(t.adminAuth.loginFailed);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary px-4" dir={isRTL ? "rtl" : "ltr"}>
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
              {t.adminAuth.title}
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              {t.adminAuth.subtitle}
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
                {t.adminAuth.emailLabel}
              </label>
              <div className="relative">
                <Mail className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground`} />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@shayboub.com"
                  required
                  className={`w-full ${isRTL ? 'pr-11 pl-4' : 'pl-11 pr-4'} py-3 rounded-lg border border-border bg-background 
                    text-foreground placeholder:text-muted-foreground
                    focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary
                    transition-all`}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
                {t.adminAuth.passwordLabel}
              </label>
              <div className="relative">
                <Lock className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground`} />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className={`w-full ${isRTL ? 'pr-11 pl-4' : 'pl-11 pr-4'} py-3 rounded-lg border border-border bg-background 
                    text-foreground placeholder:text-muted-foreground
                    focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary
                    transition-all`}
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
                  {t.adminAuth.signingIn}
                </span>
              ) : (
                t.adminAuth.signInButton
              )}
            </button>
          </form>

          {/* Back to website */}
          <div className="mt-6 text-center">
            <a 
              href="/" 
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              {t.errors.backToHome}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
