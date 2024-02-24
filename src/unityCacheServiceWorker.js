const CACHE_NAME = 'unity-assets-cache-v1';
const UNITY_FILE_URL = 'https://evalibre.blob.core.windows.net/evalibre/001_FEMALE_CAU_2019_05_06/webgl.data.unityweb';

// Install event - cache the specified Unity file
self.addEventListener('install', event => {
    console.log('[Service Worker] Install event');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('[Service Worker] Caching Unity file');
                return cache.add(UNITY_FILE_URL);
            })
            .catch(error => console.error('[Service Worker] Failed to cache Unity file on install', error))
    );
});

// Fetch event - serve files from cache or fetch from network
self.addEventListener('fetch', event => {
    console.log(`[Service Worker] Fetching: ${event.request.url}`);
    if (event.request.url === UNITY_FILE_URL) {
        console.log('[Service Worker] Handling fetch event for Unity file');
        event.respondWith(
            caches.match(event.request)
                .then(cachedResponse => {
                    if (cachedResponse) {
                        console.log('[Service Worker] Found Unity file in cache');
                        return cachedResponse;
                    }
                    console.log('[Service Worker] Unity file not found in cache, fetching from network');
                    return fetch(event.request).then(response => {
                        // Check if the fetch was successful
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            console.log('[Service Worker] Fetch from network failed or response not valid');
                            return response;
                        }
                        console.log('[Service Worker] Caching new response for Unity file');
                        const responseToCache = response.clone();
                        caches.open(CACHE_NAME)
                            .then(cache => {
                                cache.put(event.request, responseToCache);
                            });
                        return response;
                    });
                })
        );
    } else {
        console.log('[Service Worker] Fetch event bypassed for non-target URL');
        return fetch(event.request);
    }
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
    console.log('[Service Worker] Activate event');
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        console.log('[Service Worker] Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
