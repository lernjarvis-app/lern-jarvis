/*
 * Service Worker für den Offline-Betrieb von Lern-Jarvis.
 * Verwaltet ausschließlich die Cache Storage API (App-Dateien) – fasst
 * niemals localStorage an, dort liegt der Lernfortschritt sicher getrennt.
 *
 * WICHTIG: Bei jeder Änderung an App-Dateien diese Versionsnummer erhöhen
 * (z. B. "lernjarvis-v2"), damit Nutzer:innen zuverlässig die neue Version
 * erhalten, sobald sie die App das nächste Mal öffnen.
 */
const CACHE_VERSION = "lernjarvis-v3";

const APP_SHELL = [
  "./",
  "index.html",
  "src/style.css",
  "src/script.js",
  "src/fortschritt.js",
  "src/einmaleins-generator.js",
  "inhalte/katalog.js",
  "inhalte/deutsch-grossklein.js",
  "inhalte/mathe-einmaleins.js",
  "manifest.webmanifest",
  "icons/icon-192.png",
  "icons/icon-512.png",
  "icons/icon-maskable-512.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_VERSION)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== CACHE_VERSION)
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      const netzwerkFallback = fetch(event.request)
        .then((response) => {
          if (response && response.status === 200) {
            const kopie = response.clone();
            caches.open(CACHE_VERSION).then((cache) => cache.put(event.request, kopie));
          }
          return response;
        })
        .catch(() => cached);

      return cached || netzwerkFallback;
    })
  );
});
