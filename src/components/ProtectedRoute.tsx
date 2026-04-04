import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: "admin" | "staff";
}

const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { user, loading, isAdmin, isStaff, isCustomer } = useAuth();
  const { t, isRTL } = useLanguage();
  const location = useLocation();

  // Show loading while auth is initializing
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background" dir={isRTL ? "rtl" : "ltr"}>
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">{t.common.loading}</p>
        </div>
      </div>
    );
  }

  // If not logged in, redirect to appropriate login page
  if (!user) {
    return <Navigate to={requiredRole ? "/login" : "/customer-login"} replace />;
  }

  // For admin/staff routes, check permissions
  if (requiredRole === "admin") {
    if (isAdmin) {
      return <>{children}</>;
    }
    // Not admin - show access denied instead of redirect loop
    return (
      <div className="min-h-screen flex items-center justify-center bg-background" dir={isRTL ? "rtl" : "ltr"}>
        <div className="text-center p-8">
          <h1 className="text-2xl font-bold text-destructive mb-2">{t.errors.accessDenied}</h1>
          <p className="text-muted-foreground mb-4">{t.errors.noPermission}</p>
          <p className="text-sm text-muted-foreground">{t.errors.loggedInAs} {user.email}</p>
          <p className="text-sm text-muted-foreground">{t.errors.yourRole} {user.role || "unknown"}</p>
          <a href="/" className="mt-4 inline-block text-primary hover:underline">
            {t.errors.backToHome}
          </a>
        </div>
      </div>
    );
  }

  if (requiredRole === "staff") {
    if (isStaff) {
      return <>{children}</>;
    }
    // Not staff - show access denied instead of redirect loop
    return (
      <div className="min-h-screen flex items-center justify-center bg-background" dir={isRTL ? "rtl" : "ltr"}>
        <div className="text-center p-8">
          <h1 className="text-2xl font-bold text-destructive mb-2">{t.errors.accessDenied}</h1>
          <p className="text-muted-foreground mb-4">{t.errors.noPermission}</p>
          <p className="text-sm text-muted-foreground">{t.errors.loggedInAs} {user.email}</p>
          <p className="text-sm text-muted-foreground">{t.errors.yourRole} {user.role || "unknown"}</p>
          <a href="/" className="mt-4 inline-block text-primary hover:underline">
            {t.errors.backToHome}
          </a>
        </div>
      </div>
    );
  }

  // For customer routes (no requiredRole), just check if logged in
  return <>{children}</>;
};

export default ProtectedRoute;
