// service-worker.js (very small, safe cache-first)
const CACHE_NAME = 'daily-duty-list-v1';
const ASSETS = [
  '/daily-duty-list/',
  '/daily-duty-list/index.html',
  '/daily-duty-list/manifest.json',
  '/daily-duty-list/icons/icon-192.png',
  '/daily-duty-list/icons/icon-512.png',
];

self.addEventListener('install', (e) => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS).catch(()=>{})));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(clients.claim());
});

self.addEventListener('fetch', (e) => {
  // lightweight cache-first strategy
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request).catch(()=>cached))
  );
});
