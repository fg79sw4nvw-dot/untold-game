const CACHE_PREFIX = "untold-pwa";
const SHELL_CACHE = `${CACHE_PREFIX}-shell-v2`;
const RUNTIME_CACHE = `${CACHE_PREFIX}-runtime-v2`;

const CORE_PATHS = [
  "/manifest.webmanifest",
  "/assets/cards/card-001-forgotten-bookmark.webp",
  "/assets/cards/card-055-book-eating-rat.webp",
];

function sameOriginAssetUrls(html) {
  const urls = new Set();
  for (const match of html.matchAll(/(?:src|href)=["']([^"']+)["']/g)) {
    const value = match[1];
    if (!value || value.startsWith("data:") || value.startsWith("#")) continue;
    const url = new URL(value, self.location.origin);
    if (url.origin === self.location.origin) urls.add(url.pathname + url.search);
  }
  return [...urls];
}

async function precacheCurrentShell() {
  const cache = await caches.open(SHELL_CACHE);
  const rootResponse = await fetch(new Request("/", { cache: "reload" }));
  if (!rootResponse.ok) throw new Error(`Failed to precache app shell: ${rootResponse.status}`);

  const html = await rootResponse.clone().text();
  await cache.put("/", rootResponse);

  const urls = [...new Set([...CORE_PATHS, ...sameOriginAssetUrls(html)])];
  await Promise.all(urls.map(async url => {
    const response = await fetch(new Request(url, { cache: "reload" }));
    if (!response.ok) throw new Error(`Failed to precache ${url}: ${response.status}`);
    await cache.put(url, response);
  }));
}

self.addEventListener("install", event => {
  event.waitUntil(precacheCurrentShell().then(() => self.skipWaiting()));
});

self.addEventListener("activate", event => {
  event.waitUntil((async () => {
    const names = await caches.keys();
    await Promise.all(
      names
        .filter(name => name.startsWith(CACHE_PREFIX) && name !== SHELL_CACHE && name !== RUNTIME_CACHE)
        .map(name => caches.delete(name)),
    );
    await self.clients.claim();
  })());
});

async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;

  const response = await fetch(request);
  if (response.ok) {
    const cache = await caches.open(RUNTIME_CACHE);
    await cache.put(request, response.clone());
  }
  return response;
}

async function cachedRuntimeFirst(request) {
  const runtimeCache = await caches.open(RUNTIME_CACHE);
  const runtimeResponse = await runtimeCache.match(request);
  if (runtimeResponse) return runtimeResponse;
  return caches.match(request);
}

async function staleWhileRevalidate(request, event) {
  const cached = await cachedRuntimeFirst(request);
  const updatePromise = fetch(request).then(async response => {
    if (response.ok) {
      const cache = await caches.open(RUNTIME_CACHE);
      await cache.put(request, response.clone());
    }
    return response;
  });

  if (cached) {
    event.waitUntil(updatePromise.catch(() => undefined));
    return cached;
  }

  return updatePromise;
}

async function networkFirst(request, fallbackUrl) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(RUNTIME_CACHE);
      await cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    const cached = await caches.match(request);
    if (cached) return cached;
    if (fallbackUrl) {
      const fallback = await caches.match(fallbackUrl);
      if (fallback) return fallback;
    }
    throw error;
  }
}

self.addEventListener("fetch", event => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    event.respondWith(networkFirst(request, "/"));
    return;
  }

  if (url.pathname.startsWith("/assets/cards/")) {
    event.respondWith(staleWhileRevalidate(request, event));
    return;
  }

  if (
    url.pathname.startsWith("/assets/")
    || url.pathname === "/manifest.webmanifest"
  ) {
    event.respondWith(cacheFirst(request));
    return;
  }

  event.respondWith(networkFirst(request));
});
