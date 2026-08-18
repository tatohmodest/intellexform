/* InTelleX PWA service worker - installable shell + Web Push alerts. */
const CACHE = 'intellex-shell-v2';
const PRECACHE = ['/', '/manifest.webmanifest', '/pwa/icon-192.png', '/pwa/icon-512.png'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => cache.addAll(PRECACHE).catch(() => undefined))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

self.addEventListener('push', (event) => {
  let data = {
    title: 'InTelleX',
    body: 'You have a new update.',
    url: '/dashboard/notifications',
    tag: '',
  };
  try {
    if (event.data) {
      const parsed = event.data.json();
      data = { ...data, ...parsed };
    }
  } catch {
    try {
      const text = event.data && event.data.text();
      if (text) data.body = text;
    } catch {
      /* ignore malformed payloads */
    }
  }

  const tag = data.tag || `intellex-${Date.now()}`;
  const options = {
    body: data.body || 'You have a new update.',
    icon: '/pwa/icon-192.png',
    badge: '/pwa/icon-192.png',
    vibrate: [200, 80, 200, 80, 400],
    tag,
    renotify: true,
    requireInteraction: true,
    silent: false,
    timestamp: Date.now(),
    data: { url: data.url || '/dashboard/notifications' },
    actions: [
      { action: 'open', title: 'Open' },
      { action: 'dismiss', title: 'Dismiss' },
    ],
  };

  event.waitUntil(self.registration.showNotification(data.title || 'InTelleX', options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  if (event.action === 'dismiss') return;

  const targetUrl = new URL(
    event.notification.data?.url || '/dashboard/notifications',
    self.location.origin,
  ).toString();

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
      const existing = clients.find(
        (client) => 'focus' in client && client.url.startsWith(self.location.origin),
      );
      if (existing) {
        return existing.focus().then(() => {
          if ('navigate' in existing) {
            return existing.navigate(targetUrl);
          }
          return undefined;
        });
      }
      return self.clients.openWindow(targetUrl);
    }),
  );
});

self.addEventListener('pushsubscriptionchange', (event) => {
  event.waitUntil(
    (async () => {
      try {
        const registration = self.registration;
        const old = event.oldSubscription;
        const options = old
          ? { userVisibleOnly: true, applicationServerKey: old.options.applicationServerKey }
          : { userVisibleOnly: true };
        const sub = await registration.pushManager.subscribe(options);
        await fetch('/api/push/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(sub),
          credentials: 'include',
        });
      } catch {
        /* client will re-subscribe on next dashboard visit */
      }
    })(),
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // Never cache API / auth / dashboard mutations paths aggressively.
  if (
    url.pathname.startsWith('/api/') ||
    url.pathname.startsWith('/oauth/') ||
    url.pathname.startsWith('/dashboard/')
  ) {
    return;
  }

  // Navigation: network-first, fall back to cached home shell.
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((cache) => cache.put(request, copy)).catch(() => undefined);
          return res;
        })
        .catch(() => caches.match(request).then((cached) => cached || caches.match('/'))),
    );
    return;
  }

  // Static assets: cache-first.
  if (
    url.pathname.startsWith('/_next/static/') ||
    url.pathname.startsWith('/pwa/') ||
    url.pathname.match(/\.(png|jpg|jpeg|webp|svg|ico|woff2?)$/i)
  ) {
    event.respondWith(
      caches.match(request).then(
        (cached) =>
          cached ||
          fetch(request).then((res) => {
            const copy = res.clone();
            caches.open(CACHE).then((cache) => cache.put(request, copy)).catch(() => undefined);
            return res;
          }),
      ),
    );
  }
});
