const version = '__VERSION__';
const cachePrefix = 'almizaan-';
const expectedCaches = [cachePrefix + version];

self.addEventListener('install', event => {
  console.log('SW Installed ' + version);
  self.skipWaiting();
  event.waitUntil(
    caches.open(cachePrefix + version).then(cache => {
      return cache.addAll([
        '/',
        '/template/main.css',
        '/template/main.js',
        '/template/vendor.css',
        '/template/vendor.js',
        '/quran/',
        '/quran/quran.css',
        '/quran/quran.js',
        '/logo.png',
        '/logo.svg',
      ]);
    })
  );
});

self.addEventListener('activate', event => {
  console.log('SW Activated ' + version);
  clients.claim();
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.filter(cacheName => {
          return cacheName.indexOf(cachePrefix) === 0 && expectedCaches.indexOf(cacheName) === -1;
        }).map(cacheName => {
          return caches.delete(cacheName);
        })
      );
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
