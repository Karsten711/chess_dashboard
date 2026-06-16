/* Chess Trainer — service worker
   Cache-first voor de app-shell zodat alles offline werkt.
   Lichess API-calls (cross-origin) gaan altijd direct naar het netwerk. */

const VERSION = "ct-v0.5";
const SHELL = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./icon-192.png",
  "./icon-512.png",
  "./apple-touch-icon.png",
  "./chess.min.js",
  "./pieces.js",
  "./stockfish-18-lite-single.js",
  "./stockfish-18-lite-single.wasm"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(VERSION).then((cache) => cache.addAll(SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);
  // Alleen onze eigen bestanden; Lichess e.d. gaan altijd naar het netwerk.
  if (url.origin !== self.location.origin) return;

  // Grote, onveranderlijke binary: cache-first (snel, scheelt data).
  if (url.pathname.endsWith(".wasm")) {
    event.respondWith(
      caches.match(req).then((hit) => hit || fetch(req).then((res) => {
        if (res && res.status === 200) {
          const copy = res.clone();
          caches.open(VERSION).then((cache) => cache.put(req, copy));
        }
        return res;
      }))
    );
    return;
  }

  // Rest (html/js/json/icons): network-first — updates verschijnen na herladen,
  // zonder de app te herinstalleren, dus de queue in IndexedDB blijft staan.
  event.respondWith(
    fetch(req).then((res) => {
      if (res && res.status === 200 && res.type === "basic") {
        const copy = res.clone();
        caches.open(VERSION).then((cache) => cache.put(req, copy));
      }
      return res;
    }).catch(() => caches.match(req).then((hit) => hit || caches.match("./index.html")))
  );
});
