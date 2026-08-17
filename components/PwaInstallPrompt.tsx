'use client';

import { useEffect, useState } from 'react';
import { Download, Share, PlusSquare, X, Smartphone } from 'lucide-react';
import { readCampusPwaBrand, type CampusPwaBrandInfo } from '@/components/CampusPwaBrand';

const STORAGE_KEY = 'intellex_pwa_install_prompt';
const COOKIE_KEY = 'intellex_cookie_consent';

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
};

function isStandalone(): boolean {
  if (typeof window === 'undefined') return false;
  const mq = window.matchMedia('(display-mode: standalone)').matches;
  const iosStandalone = Boolean(
    (navigator as Navigator & { standalone?: boolean }).standalone,
  );
  return mq || iosStandalone;
}

function isIosDevice(): boolean {
  if (typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent || '';
  const iOS = /iPad|iPhone|iPod/.test(ua);
  const iPadOs = navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1;
  return iOS || iPadOs;
}

function brandFromPath(): CampusPwaBrandInfo | null {
  if (typeof window === 'undefined') return null;
  const path = window.location.pathname;
  const site = path.match(/^\/site\/([^/]+)/);
  if (site?.[1]) return { slug: decodeURIComponent(site[1]), name: decodeURIComponent(site[1]) };
  const dash = path.match(/^\/dashboard\/institutions\/([^/]+)/);
  if (dash?.[1]) return { slug: decodeURIComponent(dash[1]), name: decodeURIComponent(dash[1]) };
  return null;
}

export default function PwaInstallPrompt() {
  const [open, setOpen] = useState(false);
  const [ios, setIos] = useState(false);
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [installing, setInstalling] = useState(false);
  const [installed, setInstalled] = useState(false);
  const [brand, setBrand] = useState<CampusPwaBrandInfo | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    setBrand(readCampusPwaBrand() || brandFromPath());

    if (isStandalone()) {
      setInstalled(true);
      return;
    }

    try {
      if (localStorage.getItem(STORAGE_KEY) === 'dismissed') return;
    } catch {
      /* ignore */
    }

    setIos(isIosDevice());

    const onBip = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
    };
    const onInstalled = () => {
      setInstalled(true);
      setOpen(false);
      try {
        localStorage.setItem(STORAGE_KEY, 'dismissed');
      } catch {
        /* ignore */
      }
    };

    window.addEventListener('beforeinstallprompt', onBip);
    window.addEventListener('appinstalled', onInstalled);

    let cancelled = false;
    let attempts = 0;
    const maybeOpen = () => {
      if (cancelled || isStandalone()) return;
      try {
        const cookieDone = Boolean(localStorage.getItem(COOKIE_KEY));
        if (!cookieDone && attempts < 16) {
          attempts += 1;
          window.setTimeout(maybeOpen, 500);
          return;
        }
      } catch {
        /* ignore */
      }
      if (!cancelled) {
        setBrand(readCampusPwaBrand() || brandFromPath());
        setOpen(true);
      }
    };
    const timer = window.setTimeout(maybeOpen, 2400);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
      window.removeEventListener('beforeinstallprompt', onBip);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  function dismiss() {
    try {
      localStorage.setItem(STORAGE_KEY, 'dismissed');
    } catch {
      /* ignore */
    }
    setOpen(false);
  }

  async function install() {
    if (!deferred) return;
    setInstalling(true);
    try {
      await deferred.prompt();
      const choice = await deferred.userChoice;
      setDeferred(null);
      if (choice.outcome === 'accepted') dismiss();
    } catch {
      /* user cancelled */
    } finally {
      setInstalling(false);
    }
  }

  if (!open || installed) return null;

  const canNativeInstall = Boolean(deferred) && !ios;
  const appName = brand?.name || 'InTelleX';
  const iconSrc = brand?.slug
    ? `/api/pwa/icon?slug=${encodeURIComponent(brand.slug)}&size=192`
    : '/pwa/icon-192.png';
  const accent = brand?.accent || '#00B369';

  return (
    <div className="fixed inset-0 z-[95] flex items-end justify-center p-4 sm:items-center sm:p-6">
      <button
        type="button"
        aria-label="Dismiss"
        className="absolute inset-0 bg-black/45 backdrop-blur-[2px]"
        onClick={dismiss}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="pwa-install-title"
        className="relative z-10 w-full max-w-md overflow-hidden rounded-[22px] border shadow-book"
        style={{
          background: 'var(--paper)',
          borderColor: 'var(--line)',
          color: 'var(--ink)',
        }}
      >
        <div
          className="relative px-5 pb-4 pt-5"
          style={{
            background: `linear-gradient(160deg, ${accent}24 0%, rgba(242,246,251,0.9) 48%, var(--paper) 100%)`,
          }}
        >
          <button
            type="button"
            onClick={dismiss}
            aria-label="Close"
            className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full"
            style={{ background: 'rgba(12,17,22,0.06)', color: 'var(--ink-soft)' }}
          >
            <X size={16} />
          </button>

          <div className="flex items-start gap-3.5 pr-8">
            <span
              className="flex h-12 w-12 flex-shrink-0 items-center justify-center overflow-hidden rounded-[14px] border"
              style={{ borderColor: 'var(--line)', background: '#0C1116' }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={iconSrc}
                alt=""
                width={48}
                height={48}
                className="h-12 w-12 object-cover"
              />
            </span>
            <div>
              <p
                className="text-[11px] font-semibold uppercase tracking-[0.14em]"
                style={{ color: accent }}
              >
                Get the app
              </p>
              <h2 id="pwa-install-title" className="display mt-1 text-[1.35rem] leading-tight">
                Install {appName}
              </h2>
              <p className="mt-1.5 text-[13.5px] leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
                {brand
                  ? `Add ${appName} to your home screen — your campus icon, one-tap login, and a full-screen learning experience.`
                  : 'Open courses, mentors, and your dashboard like a real app - home screen icon, faster launches, and a full-screen experience.'}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4 px-5 pb-5 pt-1">
          {ios ? (
            <ol className="space-y-3">
              <li className="flex gap-3 text-[13.5px] leading-snug">
                <span
                  className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-[12px] font-semibold"
                  style={{ background: `${accent}1f`, color: accent }}
                >
                  1
                </span>
                <span>
                  Tap the{' '}
                  <span
                    className="inline-flex items-center gap-1 font-semibold"
                    style={{ color: 'var(--ink)' }}
                  >
                    Share <Share size={14} className="inline" aria-hidden />
                  </span>{' '}
                  button in Safari (bottom on iPhone, top on iPad).
                </span>
              </li>
              <li className="flex gap-3 text-[13.5px] leading-snug">
                <span
                  className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-[12px] font-semibold"
                  style={{ background: `${accent}1f`, color: accent }}
                >
                  2
                </span>
                <span>
                  Scroll and tap{' '}
                  <span
                    className="inline-flex items-center gap-1 font-semibold"
                    style={{ color: 'var(--ink)' }}
                  >
                    Add to Home Screen <PlusSquare size={14} className="inline" aria-hidden />
                  </span>
                  .
                </span>
              </li>
              <li className="flex gap-3 text-[13.5px] leading-snug">
                <span
                  className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-[12px] font-semibold"
                  style={{ background: `${accent}1f`, color: accent }}
                >
                  3
                </span>
                <span>
                  Tap <span className="font-semibold">Add</span> — {appName} lands on your Home Screen
                  like an app.
                </span>
              </li>
            </ol>
          ) : (
            <div
              className="flex items-start gap-3 rounded-2xl border px-3.5 py-3 text-[13.5px] leading-snug"
              style={{
                borderColor: 'var(--line)',
                background: 'var(--paper-dim)',
                color: 'var(--ink-soft)',
              }}
            >
              <Smartphone
                size={18}
                className="mt-0.5 flex-shrink-0"
                style={{ color: accent }}
              />
              <p>
                {canNativeInstall
                  ? `Install ${appName} on this device for one-tap access from your home screen or app drawer.`
                  : 'On Android Chrome, use the menu (⋮) and choose Install app or Add to Home screen.'}
              </p>
            </div>
          )}

          <div className="flex flex-col gap-2.5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={dismiss}
              className="btn btn-ghost order-2 sm:order-1"
              style={{ padding: '11px 18px' }}
            >
              Not now
            </button>
            {canNativeInstall ? (
              <button
                type="button"
                onClick={install}
                disabled={installing}
                className="btn btn-primary order-1 inline-flex items-center justify-center gap-2 sm:order-2"
                style={{ padding: '11px 20px' }}
              >
                <Download size={16} />
                {installing ? 'Installing…' : 'Download as app'}
              </button>
            ) : (
              <button
                type="button"
                onClick={dismiss}
                className="btn btn-primary order-1 inline-flex items-center justify-center gap-2 sm:order-2"
                style={{ padding: '11px 20px' }}
              >
                {ios ? <PlusSquare size={16} /> : <Download size={16} />}
                {ios ? 'Got it' : 'Maybe later'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
