const CACHE_NAME = 'unity-assets-cache-v1';
const UNITY_FILES = [
    // List all your Unity build files here
    'https://evalibre.blob.core.windows.net/evalibre/001_FEMALE_CAU_2019_05_06/webgl.data.unityweb'
    // Add other Unity related files
];

// Install event - cache UNITY_FILES
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(UNITY_FILES))
            .catch(error => console.error('Failed to cache Unity files on install', error))
    );
});

// Fetch event - serve files from cache or fetch from network
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(cachedResponse => {
                if (cachedResponse) {
                    return cachedResponse; // Return cached file
                }
                // Fetch from network and cache the new files
                return fetch(event.request).then(response => {
                    return caches.open(CACHE_NAME).then(cache => {
                        cache.put(event.request, response.clone());
                        return response;
                    });
                });
            })
    );
});