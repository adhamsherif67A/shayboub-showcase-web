import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

const NotFound = () => {
  const location = useLocation();
  const { t, isRTL } = useLanguage();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted" dir={isRTL ? "rtl" : "ltr"}>
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold">{t.errors.notFoundTitle}</h1>
        <p className="mb-4 text-xl text-muted-foreground">{t.errors.notFoundMessage}</p>
        <a href="/" className="text-primary underline hover:text-primary/90">
          {t.errors.returnHome}
        </a>
      </div>
    </div>
  );
};

export default NotFound;
