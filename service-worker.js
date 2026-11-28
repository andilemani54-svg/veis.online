const CACHE_NAME = "veis-shell-v2";

const APP_SHELL = [
  "/",
  "/manifest.json",
  "/icons/icon-192.png",
  "/icons/icon-512.png"
];

// Install VEIS PWA and cache essential app files.
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(APP_SHELL);
    })
  );

  self.skipWaiting();
});

// Activate the new version and clean up old VEIS caches only.
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter(
            (key) =>
              key.startsWith("veis-") &&
              key !== CACHE_NAME
          )
          .map((key) => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

// Handle safe website caching.
self.addEventListener("fetch", (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // Only handle same-origin GET requests.
  if (
    request.method !== "GET" ||
    url.origin !== self.location.origin
  ) {
    return;
  }

  // Never intercept API, authentication, storage or realtime endpoints.
  if (
    url.pathname.startsWith("/api/") ||
    url.pathname.startsWith("/auth/") ||
    url.pathname.startsWith("/rest/") ||
    url.pathname.startsWith("/functions/") ||
    url.pathname.startsWith("/storage/") ||
    url.pathname.startsWith("/realtime/")
  ) {
    return;
  }

  // Network-first for website navigation.
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response && response.ok) {
            const copy = response.clone();

            event.waitUntil(
              caches.open(CACHE_NAME).then((cache) =>
                cache.put("/", copy)
              )
            );
          }

          return response;
        })
        .catch(() => caches.match("/"))
    );

    return;
  }

  // Cache-first only for essential PWA files.
  if (APP_SHELL.includes(url.pathname)) {
    event.respondWith(
      caches.match(request).then((cached) => {
        return cached || fetch(request);
      })
    );
  }
});
