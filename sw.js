var C='czas-pracy-v2';
var CORE=['./','index.html','manifest.json','icon.svg','icon-180.png'];
var LIBS=['https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js','https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js'];
self.addEventListener('install',function(e){
 e.waitUntil(caches.open(C).then(function(c){
  return c.addAll(CORE).then(function(){return Promise.all(LIBS.map(function(u){return c.add(u).catch(function(){})}))});
 }).then(function(){return self.skipWaiting()}));
});
self.addEventListener('activate',function(e){
 e.waitUntil(caches.keys().then(function(k){
  return Promise.all(k.filter(function(n){return n.indexOf('czas-pracy-')===0&&n!==C}).map(function(n){return caches.delete(n)}));
 }).then(function(){return self.clients.claim()}));
});
self.addEventListener('fetch',function(e){
 var r=e.request;if(r.method!=='GET')return;
 if(new URL(r.url).origin!==self.location.origin&&LIBS.indexOf(r.url)<0)return;
 e.respondWith(caches.open(C).then(function(c){
  return c.match(r,{ignoreSearch:true}).then(function(hit){
   var net=fetch(r).then(function(res){if(res&&(res.ok||res.type==='opaque'))c.put(r,res.clone());return res}).catch(function(){return hit||Response.error()});
   if(hit){e.waitUntil(net);return hit}
   return net;
  });
 }));
});
