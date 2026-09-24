/* Network first, cache as fallback: always fresh when online, still works if the venue Wi-Fi drops.
   Bump VERSION when files are renamed or removed. */
var VERSION = 'qf-feelings-v7';
var FILES = [
  './', 'index.html', 'css/style.css?v=5', 'js/content.js?v=3', 'js/app.js?v=2',
  'assets/tree.svg', 'icons/icon.svg', 'icons/apple-touch-icon.png', 'manifest.webmanifest',
  'assets/fonts/QF-Regular.otf', 'assets/fonts/QF-Medium.otf', 'assets/fonts/QF-Semibold.otf',
  'assets/fonts/amiri-quran-arabic.woff2', 'assets/fonts/amiri-latin.woff2', 'assets/fonts/amiri-latin-italic.woff2'
];

self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(VERSION).then(function (c) { return c.addAll(FILES); }).then(function () { return self.skipWaiting(); }));
});

self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (k) { return k !== VERSION; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});

self.addEventListener('fetch', function (e) {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request).then(function (res) {
      if (res.ok && new URL(e.request.url).origin === location.origin) {
        var copy = res.clone();
        caches.open(VERSION).then(function (c) { c.put(e.request, copy); });
      }
      return res;
    }).catch(function () {
      return caches.match(e.request, { ignoreSearch: e.request.mode === 'navigate' });
    })
  );
});
