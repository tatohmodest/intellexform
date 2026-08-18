/** Browser-only Web Push helpers. Safe to import from client components. */

export function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const raw = atob(base64);
  const output = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i += 1) {
    output[i] = raw.charCodeAt(i);
  }
  return output;
}

export function pushSupported(): boolean {
  return (
    typeof window !== 'undefined' &&
    'serviceWorker' in navigator &&
    'PushManager' in window &&
    'Notification' in window
  );
}

export function isStandalonePwa(): boolean {
  if (typeof window === 'undefined') return false;
  const mq = window.matchMedia('(display-mode: standalone)').matches;
  const ios = Boolean((navigator as Navigator & { standalone?: boolean }).standalone);
  return mq || ios;
}

export function isIosDevice(): boolean {
  if (typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent || '';
  const iOS = /iPad|iPhone|iPod/.test(ua);
  const iPadOs = navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1;
  return iOS || iPadOs;
}

export async function ensureServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return null;
  const existing = await navigator.serviceWorker.getRegistration('/');
  if (existing) return existing;
  try {
    return await navigator.serviceWorker.register('/sw.js', { scope: '/' });
  } catch {
    return navigator.serviceWorker.ready.catch(() => null);
  }
}

export async function subscribeToPush(): Promise<{ ok: boolean; error?: string }> {
  if (!pushSupported()) {
    return { ok: false, error: 'This browser does not support push alerts.' };
  }

  const permission =
    Notification.permission === 'granted'
      ? 'granted'
      : await Notification.requestPermission();
  if (permission !== 'granted') {
    return { ok: false, error: 'Permission was not granted.' };
  }

  const registration = await ensureServiceWorker();
  if (!registration) return { ok: false, error: 'Could not register the app worker.' };
  await navigator.serviceWorker.ready;

  const keyRes = await fetch('/api/push/public-key');
  if (!keyRes.ok) return { ok: false, error: 'Could not load push keys.' };
  const { publicKey } = (await keyRes.json()) as { publicKey?: string };
  if (!publicKey) return { ok: false, error: 'Push keys are not configured.' };

  let subscription = await registration.pushManager.getSubscription();
  const keyBytes = urlBase64ToUint8Array(publicKey);
  const applicationServerKey = keyBytes.buffer.slice(
    keyBytes.byteOffset,
    keyBytes.byteOffset + keyBytes.byteLength,
  ) as ArrayBuffer;
  if (subscription) {
    const currentKey = subscription.options.applicationServerKey
      ? new Uint8Array(subscription.options.applicationServerKey as ArrayBuffer)
      : null;
    const sameKey =
      currentKey &&
      currentKey.length === keyBytes.length &&
      currentKey.every((b, i) => b === keyBytes[i]);
    if (!sameKey) {
      await subscription.unsubscribe().catch(() => undefined);
      subscription = null;
    }
  }
  if (!subscription) {
    subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey,
    });
  }

  const json = subscription.toJSON();
  const endpoint = json.endpoint;
  const p256dh = json.keys?.p256dh;
  const auth = json.keys?.auth;
  if (!endpoint || !p256dh || !auth) {
    return { ok: false, error: 'The browser did not return a complete subscription.' };
  }

  const save = await fetch('/api/push/subscribe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      endpoint,
      keys: { p256dh, auth },
      expirationTime: json.expirationTime ?? null,
    }),
  });
  if (!save.ok) {
    const data = await save.json().catch(() => ({}));
    return { ok: false, error: (data as { error?: string }).error || 'Could not save subscription.' };
  }
  return { ok: true };
}

export async function showDeviceNotification(opts: {
  title: string;
  body: string;
  url?: string;
  tag?: string;
}) {
  if (typeof window === 'undefined' || !('Notification' in window)) return;
  if (Notification.permission !== 'granted') return;

  const options = {
    body: opts.body,
    icon: '/pwa/icon-192.png',
    badge: '/pwa/icon-192.png',
    tag: opts.tag || `intellex-${Date.now()}`,
    renotify: true,
    requireInteraction: true,
    silent: false,
    vibrate: [200, 80, 200, 80, 400],
    data: { url: opts.url || '/dashboard/notifications' },
  } as NotificationOptions;

  try {
    const reg = await navigator.serviceWorker.getRegistration('/');
    if (reg) {
      await reg.showNotification(opts.title, options);
      return;
    }
  } catch {
    /* fall through to Notification constructor */
  }
  try {
    new Notification(opts.title, options);
  } catch {
    /* ignore */
  }
}
