import { useState, useEffect } from "react";
import { X, Download, Shield } from "lucide-react";

const AdminPWAInstallPrompt = () => {
  const [showPrompt, setShowPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handler = (e: Event) => {
      // Prevent the mini-infobar from appearing
      e.preventDefault();
      // Stash the event
      setDeferredPrompt(e);
      // Show prompt only if on admin routes
      if (window.location.pathname.startsWith('/admin') || window.location.pathname.startsWith('/staff')) {
        setShowPrompt(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    // Show the install prompt
    deferredPrompt.prompt();
    
    // Wait for the user to respond
    const { outcome } = await deferredPrompt.userChoice;
    
    console.log(`Admin PWA install: ${outcome}`);
    
    // Clear the prompt
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    // Don't show again for this session
    sessionStorage.setItem('admin-pwa-prompt-dismissed', 'true');
  };

  // Don't show if dismissed or not on admin route
  if (!showPrompt || sessionStorage.getItem('admin-pwa-prompt-dismissed')) {
    return null;
  }

  // Only show on admin routes
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
            <p className="text-xs text-slate-300 mb-3">
              Quick access to manage reservations, menu, and analytics from your home screen.
            </p>
            
            <div className="space-y-2">
              <button
                onClick={handleInstall}
                className="w-full bg-blue-600 text-white font-semibold text-sm px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                Install Admin App
              </button>
              
              <p className="text-xs text-slate-400 text-center">
                Includes shortcuts to Reservations, Menu, and Analytics
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPWAInstallPrompt;
