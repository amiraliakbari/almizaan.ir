const version = '532c96ea';
const cachePrefix = 'almizaan-';
const expectedCaches = [cachePrefix + version];

self.addEventListener('install', event => {
  console.log('SW Installed ' + version);
  self.skipWaiting();
  event.waitUntil(
    caches.open(cachePrefix + version).then(cache => {
      return cache.addAll([
        '/',
        '/template/main-df1400f0.css',
        '/template/main-47c24db7.js',
        '/template/vendor-90b5d4dd.css',
        '/template/vendor-9028d055.js',
        '/quran/',
        '/quran/quran-f435e0b2.css',
        '/quran/quran-bb3523d4.js',
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
