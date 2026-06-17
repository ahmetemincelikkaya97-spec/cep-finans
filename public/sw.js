self.addEventListener('install', (e) => {
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => caches.delete(cacheName))
      );
    }).then(() => {
      self.registration.unregister();
    }).then(() => {
      return self.clients.claim();
    })
  );
});

self.addEventListener('fetch', (e) => {
  // Do nothing, let the browser handle it
});
