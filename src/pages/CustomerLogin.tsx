import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Coffee, AlertCircle } from "lucide-react";
import { toast } from "sonner";

export default function CustomerLogin() {
  const { t, isRTL } = useLanguage();
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [error, setError] = useState("");

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!email || !password) {
      setError(isRTL ? "يرجى ملء جميع الحقول" : "Please fill all fields");
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      toast.success(isRTL ? "تم تسجيل الدخول بنجاح!" : "Logged in successfully!");
      navigate("/my-account");
    } catch (error: any) {
      console.error("Login error:", error);
      if (error.code === "auth/wrong-password" || error.code === "auth/invalid-credential") {
        setError(isRTL ? "كلمة المرور غير صحيحة" : "Incorrect password");
      } else if (error.code === "auth/user-not-found") {
        setError(isRTL ? "المستخدم غير موجود" : "User not found");
      } else if (error.code === "auth/invalid-email") {
        setError(isRTL ? "البريد الإلكتروني غير صالح" : "Invalid email");
      } else if (error.code === "auth/too-many-requests") {
        setError(isRTL ? "محاولات كثيرة، حاول لاحقاً" : "Too many attempts, try later");
      } else {
        setError(isRTL ? "حدث خطأ، حاول مرة أخرى" : "An error occurred, please try again");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError("");
    try {
      await loginWithGoogle();
      toast.success(isRTL ? "تم تسجيل الدخول بنجاح!" : "Logged in successfully!");
      navigate("/my-account");
    } catch (error: any) {
      console.error("Google login error:", error);
      // Common Firebase Auth errors for Google Sign-In
      if (error.code === "auth/popup-closed-by-user") {
        setError(isRTL ? "تم إغلاق نافذة تسجيل الدخول" : "Sign-in window was closed");
      } else if (error.code === "auth/popup-blocked") {
        setError(isRTL ? "تم حظر النافذة المنبثقة" : "Popup was blocked by browser");
      } else if (error.code === "auth/cancelled-popup-request") {
        // User cancelled, no need to show error
      } else if (error.code === "auth/unauthorized-domain") {
        setError(isRTL 
          ? "هذا النطاق غير مصرح به. يرجى استخدام البريد الإلكتروني"
          : "This domain is not authorized. Please use email login instead");
      } else {
        setError(isRTL 
          ? "فشل تسجيل الدخول بجوجل. جرب البريد الإلكتروني"
          : "Google sign-in failed. Try email login instead");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted flex items-center justify-center p-4" dir={isRTL ? 'rtl' : 'ltr'}>
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Coffee className="h-12 w-12 text-orange-500" />
          </div>
          <CardTitle className="text-2xl">{isRTL ? "مرحباً بعودتك" : "Welcome Back"}</CardTitle>
          <CardDescription>{isRTL ? "سجل دخولك للحصول على النقاط" : "Login to earn loyalty points"}</CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-lg flex items-center gap-2 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          {!showEmailForm ? (
            <>
              {/* Social Login Buttons */}
              <Button 
                variant="outline" 
                className="w-full h-12 text-base" 
                onClick={handleGoogleLogin}
                disabled={loading}
              >
                <svg className={`${isRTL ? 'ml-3' : 'mr-3'} h-5 w-5`} viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              {isRTL ? "المتابعة مع جوجل" : "Continue with Google"}
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">{isRTL ? "أو" : "or"}</span>
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full h-12 text-base"
                onClick={() => setShowEmailForm(true)}
              >
                {isRTL ? "المتابعة بالبريد الإلكتروني" : "Continue with Email"}
              </Button>
            </>
          ) : (
            /* Email/Password Form */
            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">{isRTL ? "البريد الإلكتروني" : "Email"}</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={isRTL ? "your@email.com" : "your@email.com"}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">{isRTL ? "كلمة المرور" : "Password"}</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-12"
                />
              </div>

              <Button type="submit" className="w-full h-12 bg-orange-500 hover:bg-orange-600" disabled={loading}>
                {loading 
                  ? (isRTL ? "جاري تسجيل الدخول..." : "Signing in...") 
                  : (isRTL ? "تسجيل الدخول" : "Sign In")}
              </Button>

              <Button
                type="button"
                variant="ghost"
                className="w-full"
                onClick={() => {
                  setShowEmailForm(false);
                  setError("");
                }}
              >
                ← {isRTL ? "رجوع" : "Back"}
              </Button>
            </form>
          )}
        </CardContent>

        <CardFooter className="flex flex-col space-y-3">
          <div className="text-sm text-muted-foreground text-center">
            {isRTL ? "ليس لديك حساب؟" : "Don't have an account?"}{" "}
            <Link to="/signup" className="text-orange-500 hover:underline font-medium">
              {isRTL ? "سجل الآن" : "Sign Up"}
            </Link>
          </div>
          <Link to="/" className="text-sm text-muted-foreground hover:text-orange-500">
            ← {isRTL ? "العودة للرئيسية" : "Back to Home"}
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
