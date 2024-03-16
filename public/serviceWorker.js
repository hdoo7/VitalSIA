// public/serviceWorker.js

const CACHE_NAME = 'v1';
const URLS_TO_IGNORE = ['/index.html', /\.js$/, /\.html$/];

self.addEventListener('install', (event) => {
  self.skipWaiting(); // Activate worker immediately
});

self.addEventListener('fetch', (event) => {
  const requestUrl = new URL(event.request.url);
  if (URLS_TO_IGNORE.some(pattern => pattern instanceof RegExp ? pattern.test(requestUrl.pathname) : requestUrl.pathname.includes(pattern))) {
    return; // Skip caching JS and HTML files
  }

  event.respondWith(
    caches.open(CACHE_NAME).then(cache => {
      return cache.match(event.request).then(response => {
        return response || fetch(event.request).then(response => {
          cache.put(event.request, response.clone());
          return response;
        });
      });
    })
  );
});
