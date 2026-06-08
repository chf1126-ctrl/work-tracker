const CACHE = 'work-tracker-v11';
const ASSETS = ['./','index.html','manifest.json','icons/icon-192.png','icons/icon-512.png','icons/icon-180.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS).catch(()=>{})));
  self.skipWaiting();
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(caches.match(e.request).then(c => c || fetch(e.request).then(r => {
    if (r.status === 200) { const rc = r.clone(); caches.open(CACHE).then(ca => ca.put(e.request, rc)); }
    return r;
  })));
});
