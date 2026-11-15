// Drift King service worker: caches the game so it runs offline after the first visit.
// When you upload a new index.html, change VERSION (e.g. dk-v2) so phones fetch the new one.
const VERSION='dk-v2';
const FILES=['./','index.html','manifest.json','icon-192.png','icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(VERSION).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==VERSION).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;
 e.respondWith(caches.match(e.request,{ignoreSearch:true}).then(r=>r||fetch(e.request).then(res=>{if(res&&res.ok&&new URL(e.request.url).origin===location.origin){const cp=res.clone();caches.open(VERSION).then(c=>c.put(e.request,cp))}return res}).catch(()=>caches.match('index.html'))))});
