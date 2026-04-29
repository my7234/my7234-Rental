self.options = { 
  "domain": "5gvci.com", 
  "zoneId": 10943053 
}
self.lary = ""
importScripts('https://5gvci.com/act/files/service-worker.min.js?r=sw')

const CACHE_NAME = 'rental-hub-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
