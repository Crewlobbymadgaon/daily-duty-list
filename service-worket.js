const CACHE_NAME = 'duty-table-v1';
const PRECACHE_URLS = [
  '/',                 // index
  '/index.html',
  '/manifest.json',
  // list other static assets you want cached:
  '/styles.css',       // if you moved CSS to file
  '/icons/icon-192.png',
  '/icons/icon-512.png'
  // add your link JSON files if desired for offline: '/link1.json', ...
];

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(PRECACHE_URLS))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
    ))
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  // network-first for firebase (real-time data), cache-first for static assets
  const url = new URL(event.request.url);
  // treat dynamic API / firebase requests as network-first:
  if (url.origin !== location.origin) {
    return event.respondWith(fetch(event.request).catch(() => caches.match(event.request)));
  }
  // for local requests use cache-first
  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request).then(resp => {
      // optionally cache fetched responses for subsequent visits
      if (event.request.method === 'GET' && resp && resp.status === 200) {
        const respClone = resp.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, respClone));
      }
      return resp;
    }).catch(()=> caches.match('/')))
  );
});
