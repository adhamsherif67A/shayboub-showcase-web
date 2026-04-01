import { useState, useEffect } from "react";
import { X, Download, Shield, Share, PlusSquare } from "lucide-react";

const AdminPWAInstallPrompt = () => {
  const [showPrompt, setShowPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Only show on admin routes
    if (!window.location.pathname.startsWith('/admin') && !window.location.pathname.startsWith('/staff')) {
      return;
    }

    // Save the admin route for PWA startup (iOS fix)
    localStorage.setItem('pwa-start-route', window.location.pathname);

    // Check if already installed (running as standalone)
    const standalone = window.matchMedia('(display-mode: standalone)').matches || 
                       (window.navigator as any).standalone === true;
    setIsStandalone(standalone);
    
    if (standalone) {
      return; // Already installed
    }

    // Check if already dismissed
    if (sessionStorage.getItem('admin-pwa-prompt-dismissed')) {
      return;
    }

    // Detect iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(iOS);

    if (iOS) {
      // On iOS, show custom instructions after delay
      const timer = setTimeout(() => {
        setShowPrompt(true);
      }, 2000);
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
    console.log(`Admin PWA install: ${outcome}`);
    
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    sessionStorage.setItem('admin-pwa-prompt-dismissed', 'true');
  };

  // Don't show if already installed, dismissed, or not on admin route
  if (!showPrompt || isStandalone) {
    return null;
  }

  if (!window.location.pathname.startsWith('/admin') && !window.location.pathname.startsWith('/staff')) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-sm z-50 animate-in slide-in-from-bottom duration-300">
      <div className="bg-slate-900 border-2 border-slate-700 rounded-xl shadow-2xl p-4">
        <button
          onClick={handleDismiss}
          className="absolute top-2 right-2 p-1 rounded-full hover:bg-slate-800 transition-colors"
          aria-label="Dismiss"
        >
          <X className="w-4 h-4 text-slate-400" />
        </button>
        
        <div className="flex items-start gap-3 pr-6">
          <div className="w-12 h-12 shrink-0 bg-blue-500/20 rounded-lg flex items-center justify-center">
            <Shield className="w-6 h-6 text-blue-400" />
          </div>
          
          <div className="flex-1">
            <h3 className="font-display font-bold text-white text-sm mb-1">
              Install Admin Dashboard
            </h3>
            
            {isIOS ? (
              // iOS Instructions
              <div>
                <p className="text-xs text-slate-300 mb-3">
                  Add admin panel to your home screen!
                </p>
                <div className="bg-slate-800 rounded-lg p-3 space-y-2">
                  <div className="flex items-center gap-2 text-xs">
                    <Share className="w-4 h-4 text-blue-400" />
                    <span className="text-slate-200">1. Tap the <strong>Share</strong> button</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <PlusSquare className="w-4 h-4 text-blue-400" />
                    <span className="text-slate-200">2. Select <strong>"Add to Home Screen"</strong></span>
                  </div>
                </div>
              </div>
            ) : (
              // Android/Desktop Install
              <div>
                <p className="text-xs text-slate-300 mb-3">
                  Quick access to manage reservations, menu, and analytics.
                </p>
                <button
                  onClick={handleInstall}
                  className="w-full bg-blue-600 text-white font-semibold text-sm px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Install Admin App
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPWAInstallPrompt;
