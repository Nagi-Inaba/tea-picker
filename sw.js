// Simple offline cache for PWA
const CACHE = 'tea-picker-cache-v1';
const ASSETS = ['/', './', './index.html', './manifest.webmanifest'];

self.addEventListener('install', (e)=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)));
  self.skipWaiting();
});
self.addEventListener('activate', (e)=>{
  e.waitUntil(caches.keys().then(keys=>Promise.all(keys.map(k=>k===CACHE?null:caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener('fetch', (e)=>{
  const req = e.request;
  e.respondWith(
    caches.match(req).then(cached=> cached || fetch(req).then(res=>{
      // Optional: cache new GET requests
      if(req.method==='GET'){
        const copy = res.clone();
        caches.open(CACHE).then(c=>c.put(req, copy));
      }
      return res;
    }).catch(()=> cached || new Response('オフラインです', {status:200})) )
  );
});
