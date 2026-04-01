// Service Worker for Shayboub PWA
const CACHE_NAME = 'shayboub-v2';

// Assets to cache on install
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/images/shayboub-logo.png',
  '/manifest.json',
  '/manifest-admin.json'
];

// Install event - cache critical assets
self.addEventListener('install', (event) => {
  console.log('[SW] Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Caching files');
        return cache.addAll(PRECACHE_URLS);
      })
      .then(() => {
        console.log('[SW] Install complete, skipping waiting');
        return self.skipWaiting();
      })
      .catch((err) => {
        console.error('[SW] Install failed:', err);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => {
            console.log('[SW] Deleting old cache:', name);
            return caches.delete(name);
          })
      );
    }).then(() => {
      console.log('[SW] Claiming clients');
      return self.clients.claim();
    })
  );
});

// Fetch event - network first with cache fallback
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }
  
  // Skip cross-origin requests except for allowed domains
  if (url.origin !== self.location.origin) {
    // Allow Google Fonts and menu images
    if (!url.hostname.includes('fonts.googleapis.com') && 
        !url.hostname.includes('fonts.gstatic.com') &&
        !url.hostname.includes('media.alimento.io')) {
      return;
    }
  }

  // Skip Firebase/API requests - always go to network
  if (
    url.hostname.includes('firestore.googleapis.com') ||
    url.hostname.includes('firebase') ||
    url.hostname.includes('identitytoolkit')
  ) {
    return;
  }

  event.respondWith(
    // Network first strategy
    fetch(event.request)
      .then((response) => {
        // Don't cache non-successful responses
        if (!response || response.status !== 200) {
          return response;
        }
        
        // Clone and cache the response
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseClone);
        });
        
        return response;
      })
      .catch(() => {
        // Network failed, try cache
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          
          // For navigation requests, return cached index.html (SPA support)
          if (event.request.mode === 'navigate') {
            return caches.match('/index.html');
          }
          
          // No cache available
          return new Response('Offline - content not available', {
            status: 503,
            headers: { 'Content-Type': 'text/plain' }
          });
        });
      })
  );
});
