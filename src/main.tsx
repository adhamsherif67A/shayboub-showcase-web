import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// PWA standalone mode URL fix for iOS
// iOS doesn't use manifest start_url, so we need to handle it manually
(function() {
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                       (window.navigator as any).standalone === true;
  
  // If running as PWA and on homepage, check if we should redirect to admin
  if (isStandalone) {
    const savedRoute = localStorage.getItem('pwa-start-route');
    const currentPath = window.location.pathname;
    
    // If we're on root and have a saved admin route, redirect
    if (currentPath === '/' && savedRoute && savedRoute.startsWith('/admin')) {
      window.location.replace(savedRoute);
    }
  }
  
  // Save current route for PWA start (only save admin routes)
  if (window.location.pathname.startsWith('/admin')) {
    localStorage.setItem('pwa-start-route', window.location.pathname);
  }
})();

createRoot(document.getElementById("root")!).render(<App />);

// Register Service Worker for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        console.log('✅ Service Worker registered:', registration);
      })
      .catch((error) => {
        console.log('❌ Service Worker registration failed:', error);
      });
  });
}

