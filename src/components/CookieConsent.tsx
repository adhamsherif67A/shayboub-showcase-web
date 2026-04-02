import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { X, Cookie } from "lucide-react";
import { Button } from "@/components/ui/button";

const COOKIE_CONSENT_KEY = "shayboub_cookie_consent";

const CookieConsent = () => {
  const [showBanner, setShowBanner] = useState(false);
  const { language } = useLanguage();
  const isRTL = language === "ar";

  useEffect(() => {
    // Check if user has already consented
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!consent) {
      // Show banner after a short delay
      const timer = setTimeout(() => setShowBanner(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, "accepted");
    setShowBanner(false);
  };

  const handleDecline = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, "declined");
    setShowBanner(false);
  };

  if (!showBanner) return null;

  const content = {
    en: {
      title: "We use cookies",
      description: "We use cookies to improve your experience, remember your preferences, and analyze site usage.",
      accept: "Accept All",
      decline: "Decline",
      learnMore: "Learn more"
    },
    ar: {
      title: "نستخدم ملفات تعريف الارتباط",
      description: "نستخدم ملفات تعريف الارتباط لتحسين تجربتك وتذكر تفضيلاتك وتحليل استخدام الموقع.",
      accept: "قبول الكل",
      decline: "رفض",
      learnMore: "اعرف المزيد"
    }
  };

  const t = content[language as keyof typeof content] || content.en;

  return (
    <div 
      className={`fixed bottom-0 left-0 right-0 z-50 p-4 animate-in slide-in-from-bottom duration-500 ${isRTL ? 'rtl' : ''}`}
    >
      <div className="max-w-4xl mx-auto">
        <div className={`bg-card border border-border rounded-xl shadow-2xl p-4 md:p-6 flex flex-col md:flex-row items-start md:items-center gap-4 ${isRTL ? 'md:flex-row-reverse' : ''}`}>
          {/* Icon */}
          <div className="flex-shrink-0 hidden md:block">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <Cookie className="w-6 h-6 text-primary" />
            </div>
          </div>
          
          {/* Content */}
          <div className={`flex-1 ${isRTL ? 'text-right' : ''}`}>
            <h3 className="font-semibold text-foreground mb-1 flex items-center gap-2">
              <Cookie className="w-5 h-5 text-primary md:hidden" />
              {t.title}
            </h3>
            <p className="text-sm text-muted-foreground">
              {t.description}{" "}
              <Link to="/privacy" className="text-primary hover:underline">
                {t.learnMore}
              </Link>
            </p>
          </div>
          
          {/* Buttons */}
          <div className={`flex gap-2 w-full md:w-auto ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleDecline}
              className="flex-1 md:flex-none"
            >
              {t.decline}
            </Button>
            <Button 
              size="sm"
              onClick={handleAccept}
              className="flex-1 md:flex-none bg-primary hover:bg-primary/90"
            >
              {t.accept}
            </Button>
          </div>
          
          {/* Close button */}
          <button
            onClick={handleDecline}
            className="absolute top-2 right-2 md:hidden p-1 text-muted-foreground hover:text-foreground"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
