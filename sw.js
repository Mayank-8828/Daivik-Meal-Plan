/* Daivik's Food Journey — service worker.
   Strategy:
   - Same-origin HTML / SVG / manifest / sw → network-first, fall back to cache.
     Lets new deploys win without forcing a hard refresh.
   - Cross-origin assets (Google Fonts, jsDelivr CDN scripts) → stale-while-revalidate.
   - Firebase, Firestore, gstatic, and *.googleapis.com requests → always go to
     network. Caching realtime data would silently desync the app. */

const SHELL_CACHE = 'daivik-shell-v4';
const RUNTIME_CACHE = 'daivik-runtime-v4';

const SHELL_URLS = [
  './',
  './index.html',
  './styles.css',
  './seed-data.js',
  './embedded-photo.js',
  './guide.html',
  './guide-dietician.html',
  './guide-family.html',
  './manifest.webmanifest',
  './icon.svg',
  './icon-maskable.svg'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(SHELL_CACHE)
      .then(c => c.addAll(SHELL_URLS).catch(()=>{/* tolerate missing in dev */}))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys
        .filter(k => k !== SHELL_CACHE && k !== RUNTIME_CACHE)
        .map(k => caches.delete(k))
    )).then(() => self.clients.claim())
  );
});

function isFirebaseLike(url) {
  return /(firestore|firebaseio|firebaseapp|googleapis|gstatic\.com\/firebasejs|identitytoolkit|securetoken)/i.test(url);
}

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // Don't intercept Firebase / Google API traffic — let it stream live.
  if (isFirebaseLike(url.href)) return;

  // Cross-origin (fonts, CDN scripts): stale-while-revalidate
  if (url.origin !== self.location.origin) {
    event.respondWith((async () => {
      const cache = await caches.open(RUNTIME_CACHE);
      const cached = await cache.match(req);
      const fetcher = fetch(req).then(resp => {
        if (resp && resp.status === 200) cache.put(req, resp.clone());
        return resp;
      }).catch(() => cached);
      return cached || fetcher;
    })());
    return;
  }

  // Same-origin: network-first, fall back to cache
  event.respondWith((async () => {
    try {
      const resp = await fetch(req);
      if (resp && resp.status === 200 && resp.type === 'basic') {
        const cache = await caches.open(SHELL_CACHE);
        cache.put(req, resp.clone());
      }
      return resp;
    } catch (err) {
      const cached = await caches.match(req);
      if (cached) return cached;
      // Final fallback: the cached index for navigation requests
      if (req.mode === 'navigate') {
        const idx = await caches.match('./index.html');
        if (idx) return idx;
      }
      throw err;
    }
  })());
});
