var scope = new URL(self.registration.scope);
var prefix = 'czas-pracy-pwa:' + scope.pathname + ':';
var cacheName = prefix + '2.4';
var core = ['./', 'index.html', 'manifest.json', 'icon.svg', 'icon-180.png'].map(function (path) {
  return new URL(path, scope).href;
});
var libraries = [
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js'
];

self.addEventListener('install', function (event) {
  event.waitUntil((async function () {
    var cache = await caches.open(cacheName);
    await cache.addAll(core.map(function (url) { return new Request(url, {cache: 'reload'}); }));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', function (event) {
  event.waitUntil((async function () {
    var names = await caches.keys();
    await Promise.all(names.filter(function (name) {
      return name.indexOf(prefix) === 0 && name !== cacheName;
    }).map(function (name) { return caches.delete(name); }));
    await self.clients.claim();
  })());
});

self.addEventListener('message', function (event) {
  if (event.data !== 'cache-export-libraries') return;
  event.waitUntil((async function () {
    if (!(await caches.has(cacheName))) return;
    var cache = await caches.open(cacheName);
    await Promise.all(libraries.map(async function (url) {
      if (!(await cache.match(url))) await cache.add(url).catch(function () {});
    }));
    if (event.ports[0]) event.ports[0].postMessage('done');
  })());
});

self.addEventListener('fetch', function (event) {
  var request = event.request;
  if (request.method !== 'GET') return;
  var url = new URL(request.url);
  if (url.origin === scope.origin) url.search = '';
  var key = url.href;
  if (core.indexOf(key) === -1 && libraries.indexOf(key) === -1) return;

  // After an opt-out, an already open page can still have a controller until reload.
  // Use caches.match instead of caches.open, so requests cannot recreate the cache.
  var hit = caches.match(key, {cacheName: cacheName});
  var network = fetch(request).then(async function (response) {
    if ((response.ok || response.type === 'opaque') && !response.redirected && await caches.has(cacheName)) {
      try {
        var cache = await caches.open(cacheName);
        await cache.put(key, response.clone());
      } catch (e) {}
    }
    return response;
  }).catch(function () { return null; });
  event.waitUntil(network.then(function () {}));
  event.respondWith(hit.then(async function (cached) {
    return cached || await network || Response.error();
  }));
});
