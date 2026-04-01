# 📱 PWA Installation Guide

## How to Install Shayboub App

### **On Android (Chrome/Edge):**

1. **Visit the website:** https://shayboub.com
2. **Install prompt appears:** Look for the popup at the bottom saying "Install Shayboub App"
3. **Click "Install App"** button
4. **Alternative method:** 
   - Tap the 3-dot menu (⋮) in browser
   - Select "Install app" or "Add to Home screen"
5. **Done!** The Shayboub icon now appears on your home screen

### **On iPhone/iPad (Safari):**

1. **Visit the website:** https://shayboub.com
2. **Tap the Share button** (box with arrow ↗️) at the bottom of Safari
3. **Scroll down** and tap "Add to Home Screen"
4. **Tap "Add"** in the top right
5. **Done!** The Shayboub icon now appears on your home screen

### **On Desktop (Chrome/Edge):**

1. **Visit the website:** https://shayboub.com
2. **Look for install icon** (⊕) in the address bar
3. **Click "Install"** in the prompt
4. **Done!** Shayboub opens as a standalone app

---

## ✨ What You Get:

| Feature | Benefit |
|---|---|
| **📲 Home Screen Icon** | Quick access like any other app |
| **🚀 Faster Loading** | Cached content loads instantly |
| **📡 Works Offline** | Browse menu even without internet |
| **🎨 Fullscreen** | No browser bars, looks professional |
| **💾 Less Data** | Cached assets reduce data usage |
| **🔔 Notifications** | Get updates about reservations (coming soon) |

---

## 🧪 Testing PWA Features:

### **Test Offline Mode:**
1. Install the app
2. Turn on Airplane Mode
3. Open Shayboub app
4. Menu and cached pages still work!

### **Test Install Prompt:**
1. Visit shayboub.com in Chrome/Edge
2. After a few seconds, install prompt appears
3. Dismiss it and it won't show again this session
4. Clear session storage to see it again

### **Check Service Worker:**
1. Open Chrome DevTools (F12)
2. Go to "Application" tab
3. Click "Service Workers" in sidebar
4. Should see: `sw.js` status: "activated and running"

---

## 🛠️ Developer Notes:

**Files:**
- `public/manifest.json` - App configuration
- `public/sw.js` - Service worker for caching
- `src/components/PWAInstallPrompt.tsx` - Custom install UI
- `src/main.tsx` - Service worker registration

**Cache Strategy:**
- **Network First** - Always try to fetch fresh data
- **Cache Fallback** - Use cached version if offline
- **Firebase Bypass** - Never cache Firebase API calls

**Icons:**
- Using `/images/shayboub-logo.png` as app icon
- Supports 192x192 and 512x512 sizes
- Maskable icon for Android adaptive icons

---

## 🌐 Important:

**The website still works normally!**
- Typing shayboub.com → Works as usual ✅
- PWA is just an **optional** install feature
- Doesn't replace the website, only adds app experience
