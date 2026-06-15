// Minimal service worker: enables "Add to Home Screen" / install prompts without
// caching the app shell, so deployments are always picked up fresh (see the
// no-cache meta tags in index.html).
self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  event.respondWith(fetch(event.request));
});
