const CACHE_NAME = 'fither-v1';
const ASSETS = ['/', '/index.html'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
  ));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  // Only intercept same-origin requests. Letting cross-origin requests
  // (e.g. Supabase-hosted audio tracks) pass through the SW's fetch() wrapper
  // was turning them into opaque responses that break Range-request streaming,
  // which made the music player hang forever at 0:00 with no error.
  const url = new URL(e.request.url);
  if (url.origin !== location.origin) return;

  // Network-first for the HTML shell (navigations + index.html itself).
  // Cache-first was serving a stale copy of the app for a while after every
  // deploy — sometimes for several reloads — because the old cached HTML
  // stuck around until the new service worker fully took over. Always
  // reaching for the network first means users get the latest version
  // immediately when online, while still falling back to the cached copy
  // if they're offline.
  const isHtmlShell = e.request.mode === 'navigate' || url.pathname === '/' || url.pathname === '/index.html';
  if (isHtmlShell) {
    e.respondWith(
      fetch(e.request).then(res => {
        caches.open(CACHE_NAME).then(c => c.put(e.request, res.clone()));
        return res;
      }).catch(() => caches.match('/index.html'))
    );
    return;
  }

  // Cache-first for everything else same-origin (icons, manifest, etc.) —
  // these rarely change and it's fine/good to serve them instantly from cache.
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request).catch(() => caches.match('/index.html')))
  );
});
