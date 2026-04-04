import { useState, useEffect } from "react";
import { X, Download, Share, PlusSquare } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const PWAInstallPrompt = () => {
  const [showPrompt, setShowPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const { t, isRTL } = useLanguage();

  useEffect(() => {
    // Check if on admin routes - don't show there
    if (window.location.pathname.startsWith('/admin') || window.location.pathname.startsWith('/staff')) {
      return;
    }

    // Check if already installed (running as standalone)
    const standalone = window.matchMedia('(display-mode: standalone)').matches || 
                       (window.navigator as any).standalone === true;
    setIsStandalone(standalone);
    
    if (standalone) {
      return; // Already installed, don't show prompt
    }

    // Check if already dismissed
    if (sessionStorage.getItem('pwa-prompt-dismissed')) {
      return;
    }

    // Detect iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(iOS);

    if (iOS) {
      // On iOS, show our custom instructions after a delay
      const timer = setTimeout(() => {
        setShowPrompt(true);
      }, 3000);
      return () => clearTimeout(timer);
    } else {
      // On other platforms, listen for beforeinstallprompt
      const handler = (e: Event) => {
        e.preventDefault();
        setDeferredPrompt(e);
        setShowPrompt(true);
      };

      window.addEventListener('beforeinstallprompt', handler);
      return () => window.removeEventListener('beforeinstallprompt', handler);
    }
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`PWA install: ${outcome}`);
    
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    sessionStorage.setItem('pwa-prompt-dismissed', 'true');
  };

  // Don't show if already installed, dismissed, or on admin routes
  if (!showPrompt || isStandalone) {
    return null;
  }
  
  if (window.location.pathname.startsWith('/admin') || window.location.pathname.startsWith('/staff')) {
    return null;
  }

  return (
    <div className={`fixed bottom-4 ${isRTL ? 'right-4 left-4 md:right-4 md:left-auto' : 'left-4 right-4 md:left-auto md:right-4'} md:max-w-sm z-50 animate-in slide-in-from-bottom duration-300`} dir={isRTL ? "rtl" : "ltr"}>
      <div className="bg-card border-2 border-primary/20 rounded-xl shadow-2xl p-4">
        <button
          onClick={handleDismiss}
          className={`absolute top-2 ${isRTL ? 'left-2' : 'right-2'} p-1 rounded-full hover:bg-muted transition-colors`}
          aria-label={t.pwa.dismiss}
        >
          <X className="w-4 h-4 text-muted-foreground" />
        </button>
        
        <div className={`flex items-start gap-3 ${isRTL ? 'pl-6' : 'pr-6'}`}>
          <div className="w-12 h-12 shrink-0 bg-primary/10 rounded-lg flex items-center justify-center">
            <img 
              src="/images/shayboub-logo.png" 
              alt="Shayboub" 
              className="w-10 h-10 rounded-lg"
            />
          </div>
          
          <div className="flex-1">
            <h3 className="font-display font-bold text-foreground text-sm mb-1">
              {t.pwa.installTitle}
            </h3>
            
            {isIOS ? (
              // iOS Instructions
              <div>
                <p className="text-xs text-muted-foreground mb-3">
                  {t.pwa.addToHomeScreen}
                </p>
                <div className="bg-muted/50 rounded-lg p-3 space-y-2">
                  <div className="flex items-center gap-2 text-xs">
                    <Share className="w-4 h-4 text-primary" />
                    <span className="text-foreground">{t.pwa.iosStep1}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <PlusSquare className="w-4 h-4 text-primary" />
                    <span className="text-foreground">{t.pwa.iosStep2}</span>
                  </div>
                </div>
              </div>
            ) : (
              // Android/Desktop Install Button
              <div>
                <p className="text-xs text-muted-foreground mb-3">
                  {t.pwa.androidDescription}
                </p>
                <button
                  onClick={handleInstall}
                  className="w-full bg-primary text-primary-foreground font-semibold text-sm px-4 py-2 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  {t.pwa.installButton}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PWAInstallPrompt;
