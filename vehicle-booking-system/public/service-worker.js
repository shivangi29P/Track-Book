self.addEventListener('install', event => {
    console.log('🔧 Service Worker installing.');
    event.waitUntil(
      caches.open('v1').then(cache => {
        return cache.addAll([
          '/',
        //   '/styles.css',
          '/logo.png',
          '/logo1.png',
          // Add other pages you want offline
        ]);
      })
    );
  });
  
  self.addEventListener('fetch', event => {
    event.respondWith(
      caches.match(event.request)
        .then(resp => resp || fetch(event.request))
    );
  });
  