const CACHE_NAME = 'duty-table-v1';
const BASE = '/daily-duty-list';
const PRECACHE = [
  `${BASE}/`,
  `${BASE}/index.html`,
  `${BASE}/manifest.json`,
  `${BASE}/icons/icon-192.png`,
  `${BASE}/icons/icon-512.png`
];

self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(PRECACHE)));
});

self.addEventListener('activate', e => {
  e.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (url.origin !== location.origin) {
    // network-first for external requests (Firebase, fonts)
    e.respondWith(fetch(e.request).catch(()=>caches.match(e.request)));
    return;
  }
  // cache-first for app assets
  e.respondWith(caches.match(e.request).then(cached => cached || fetch(e.request)));
});
