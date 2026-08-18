'use client';

import { useCallback, useEffect, useState } from 'react';
import { BellRing, X } from 'lucide-react';
import {
  isIosDevice,
  isStandalonePwa,
  pushSupported,
  subscribeToPush,
} from '@/lib/push/browser';

const SNOOZE_KEY = 'intellex_push_snooze_until';
const SNOOZE_MS = 4 * 60 * 60 * 1000;

type Status = 'checking' | 'ready' | 'needs-install' | 'blocked' | 'unsupported' | 'on';

function snoozed(): boolean {
  try {
    const until = Number(localStorage.getItem(SNOOZE_KEY) || '0');
    return until > Date.now();
  } catch {
    return false;
  }
}

function setSnooze() {
  try {
    localStorage.setItem(SNOOZE_KEY, String(Date.now() + SNOOZE_MS));
  } catch {
    /* ignore */
  }
}

export default function PushAlertsBanner({ accent = '#00b369' }: { accent?: string }) {
  const [status, setStatus] = useState<Status>('checking');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [hidden, setHidden] = useState(false);

  const refresh = useCallback(async () => {
    if (typeof window === 'undefined') return;
    if (!pushSupported()) {
      if (isIosDevice() && !isStandalonePwa()) {
        setStatus('needs-install');
        return;
      }
      setStatus('unsupported');
      return;
    }

    if (Notification.permission === 'denied') {
      setStatus('blocked');
      return;
    }

    if (Notification.permission === 'granted') {
      const result = await subscribeToPush();
      if (result.ok) {
        setStatus('on');
        return;
      }
    }

    if (isIosDevice() && !isStandalonePwa()) {
      setStatus('needs-install');
      return;
    }

    setStatus('ready');
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  async function enable() {
    setBusy(true);
    setError('');
    const result = await subscribeToPush();
    setBusy(false);
    if (!result.ok) {
      if (typeof Notification !== 'undefined' && Notification.permission === 'denied') {
        setStatus('blocked');
      } else {
        setError(result.error || 'Could not turn on alerts.');
      }
      await refresh();
      return;
    }
    setStatus('on');
    try {
      await fetch('/api/push/test', { method: 'POST' });
    } catch {
      /* local permission is already granted */
    }
  }

  if (hidden || status === 'checking' || status === 'on' || status === 'unsupported') {
    return null;
  }
  if (status === 'ready' && snoozed()) return null;

  const copy =
    status === 'needs-install'
      ? 'Install InTelleX on your Home Screen, then tap Turn on alerts. iPhone only delivers push from the installed app.'
      : status === 'blocked'
        ? 'Alerts are blocked in this browser. Open site settings (the lock icon) and allow Notifications, then reload.'
        : 'Turn on alerts so assignments, messages, live classes, and campus activity pop up on this device — even when the app is closed.';

  return (
    <div
      className="border-b px-4 py-3 lg:pl-[264px] lg:pr-8"
      style={{
        borderColor: 'var(--line)',
        background: `${accent}14`,
      }}
    >
      <div className="flex items-start gap-3">
        <span
          className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white"
          style={{ background: accent }}
        >
          <BellRing size={16} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[14px] font-semibold leading-snug">Turn on InTelleX alerts</p>
          <p className="mt-0.5 text-[12.5px] leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
            {copy}
          </p>
          {error ? (
            <p className="mt-1 text-[12px]" style={{ color: '#b91c1c' }}>
              {error}
            </p>
          ) : null}
          <div className="mt-2.5 flex flex-wrap items-center gap-2">
            {status !== 'blocked' ? (
              <button
                type="button"
                onClick={enable}
                disabled={busy}
                className="rounded-full px-3.5 py-1.5 text-[12.5px] font-semibold text-white disabled:opacity-60"
                style={{ background: accent }}
              >
                {busy ? 'Turning on…' : 'Turn on alerts'}
              </button>
            ) : null}
            {status === 'ready' ? (
              <button
                type="button"
                onClick={() => {
                  setSnooze();
                  setHidden(true);
                }}
                className="text-[12px] font-semibold"
                style={{ color: 'var(--ink-soft)' }}
              >
                Not now
              </button>
            ) : null}
          </div>
        </div>
        {status === 'ready' ? (
          <button
            type="button"
            aria-label="Dismiss for now"
            onClick={() => {
              setSnooze();
              setHidden(true);
            }}
            className="mt-0.5 shrink-0 p-1"
            style={{ color: 'var(--ink-soft)' }}
          >
            <X size={16} />
          </button>
        ) : null}
      </div>
    </div>
  );
}

export function PushAlertsSettings({ accent = '#00b369' }: { accent?: string }) {
  const [status, setStatus] = useState<Status>('checking');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!pushSupported()) {
      setStatus(isIosDevice() && !isStandalonePwa() ? 'needs-install' : 'unsupported');
      return;
    }
    if (Notification.permission === 'denied') {
      setStatus('blocked');
      return;
    }
    if (Notification.permission === 'granted') {
      subscribeToPush().then((result) => setStatus(result.ok ? 'on' : 'ready'));
      return;
    }
    setStatus(isIosDevice() && !isStandalonePwa() ? 'needs-install' : 'ready');
  }, []);

  async function enable() {
    setBusy(true);
    setMessage('');
    const result = await subscribeToPush();
    setBusy(false);
    if (!result.ok) {
      setMessage(result.error || 'Could not turn on alerts.');
      setStatus(Notification.permission === 'denied' ? 'blocked' : 'ready');
      return;
    }
    setStatus('on');
    await fetch('/api/push/test', { method: 'POST' }).catch(() => undefined);
    setMessage('Alerts are on. You should see a test pop-up now.');
  }

  return (
    <div className="mt-8 border p-4" style={{ borderColor: 'var(--line)' }}>
      <h3 className="font-display text-[18px]">Device pop-up alerts</h3>
      <p className="mt-1 text-[13px]" style={{ color: 'var(--ink-soft)' }}>
        PWA push notifications for messages, assignments, live classes, payments, and campus
        activity. They appear even when InTelleX is in the background.
      </p>
      {status === 'on' ? (
        <p className="mt-3 text-[13px] font-semibold" style={{ color: accent }}>
          Alerts are on for this device.
        </p>
      ) : status === 'blocked' ? (
        <p className="mt-3 text-[13px]" style={{ color: '#b91c1c' }}>
          Notifications are blocked. Allow them in the browser site settings, then reload.
        </p>
      ) : status === 'needs-install' ? (
        <p className="mt-3 text-[13px]" style={{ color: 'var(--ink-soft)' }}>
          On iPhone / iPad, add InTelleX to your Home Screen first, then open it and tap Turn on
          alerts.
        </p>
      ) : status === 'unsupported' ? (
        <p className="mt-3 text-[13px]" style={{ color: 'var(--ink-soft)' }}>
          This browser does not support Web Push.
        </p>
      ) : (
        <button
          type="button"
          onClick={enable}
          disabled={busy}
          className="mt-3 rounded-full px-3.5 py-1.5 text-[13px] font-semibold text-white disabled:opacity-60"
          style={{ background: accent }}
        >
          {busy ? 'Turning on…' : 'Turn on alerts'}
        </button>
      )}
      {status === 'on' ? (
        <button
          type="button"
          onClick={enable}
          disabled={busy}
          className="mt-3 ml-0 block text-[12.5px] font-semibold"
          style={{ color: accent }}
        >
          Send a test alert
        </button>
      ) : null}
      {message ? (
        <p className="mt-2 text-[12.5px]" style={{ color: 'var(--ink-soft)' }}>
          {message}
        </p>
      ) : null}
    </div>
  );
}
