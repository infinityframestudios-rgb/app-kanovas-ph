const C='kp-fotografo-v4',P='kp-fotografo-';
self.addEventListener('install',e=>self.skipWaiting());
// cancella solo le PROPRIE cache vecchie (mai quelle di altre app sullo stesso dominio)
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x.startsWith(P)&&x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim())));
self.addEventListener('push',e=>{let d={};try{d=e.data?e.data.json():{}}catch(x){d={body:e.data?e.data.text():''}}
const url=new URL('/app-kanovas-ph/'+(d.url||''),location.origin).href;
e.waitUntil(self.registration.showNotification(d.title||'Kanovas Ph',{body:d.body||'',icon:'/app-kanovas-ph/icon-192.png',badge:'/app-kanovas-ph/icon-192.png',tag:'kp-fotografo-'+(d.tag||'consegne'),data:{url}}))});
self.addEventListener('notificationclick',e=>{e.notification.close();const url=(e.notification.data&&e.notification.data.url)||new URL('/app-kanovas-ph/',location.origin).href;
e.waitUntil(clients.matchAll({type:'window',includeUncontrolled:true}).then(l=>{for(const c of l){if(c.url.startsWith(location.origin+'/app-kanovas-ph/')&&'focus' in c){if(c.navigate)c.navigate(url).catch(()=>{});return c.focus()}}return clients.openWindow(url)}))});
self.addEventListener('fetch',e=>{const u=new URL(e.request.url);if(e.request.method!=='GET'||u.origin!==location.origin||!u.pathname.startsWith('/app-kanovas-ph/'))return;
if(u.pathname.endsWith('/cliente.html')||u.pathname.endsWith('/licenza.json'))return;
e.respondWith(fetch(e.request,e.request.mode==='navigate'||u.pathname.endsWith('/sw.js')?{cache:'no-store'}:{}).then(r=>{const c=r.clone();caches.open(C).then(x=>x.put(e.request,c));return r}).catch(()=>caches.match(e.request,{cacheName:C}).then(r=>r||(e.request.mode==='navigate'?caches.open(C).then(x=>x.match('./')):undefined))))});
