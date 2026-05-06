const CACHE_NAME = 'shanti-jewel-v1';

// Install event - caches the basic files
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(['./', './index.html', './manifest.json', './logo.png']);
    })
  );
});

// Fetch event - required for "Install App" to appear
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
