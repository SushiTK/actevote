// ActeVote : fonctionne hors connexion. La page est toujours rechargée depuis le réseau quand c'est possible,
// pour que chaque mise à jour publiée soit visible immédiatement.
const CACHE = 'actevote-v2';
const FILES = ['./', 'index.html', 'manifest.webmanifest', 'icon-192-v2.png', 'icon-512-v2.png', 'apple-touch-icon-v2.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES))); self.skipWaiting(); });
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(k => Promise.all(k.filter(n => n !== CACHE).map(n => caches.delete(n)))));
  self.clients.claim();
});
self.addEventListener('fetch', e => {
  const r = e.request;
  if (r.method !== 'GET' || new URL(r.url).origin !== location.origin) return;
  if (r.mode === 'navigate') {
    e.respondWith(fetch(r).then(res => { caches.open(CACHE).then(c => c.put('index.html', res.clone())); return res; })
      .catch(() => caches.match('index.html')));
    return;
  }
  e.respondWith(caches.match(r).then(c => c || fetch(r)));
});
