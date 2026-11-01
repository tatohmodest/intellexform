'use client';

import { useEffect, useState } from 'react';
import { ArrowRight, Check, Download, Share, PlusSquare, X, Smartphone } from 'lucide-react';
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
  const [showInstallHelp, setShowInstallHelp] = useState(false);
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

  const points = brand
    ? [`Open ${appName} from your home screen`, 'Your campus branding, one tap away']
    : ['Open your courses in one tap', 'Class reminders right on your phone'];

  return (
    <aside
      className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] left-3 z-[80] w-[min(360px,calc(100vw-96px))] sm:left-5 sm:w-[360px]"
      aria-label={`Install ${appName}`}
    >
      <div className="overflow-hidden rounded-[24px] bg-white shadow-[0_24px_60px_-24px_rgba(18,50,79,0.45)] ring-1 ring-black/5">
        <div className="relative p-4 pr-11">
          <button
            type="button"
            onClick={dismiss}
            aria-label="Dismiss app install banner"
            className="absolute right-2.5 top-2.5 flex h-8 w-8 items-center justify-center rounded-full text-[var(--ink-soft)] transition hover:bg-black/5"
          >
            <X size={16} />
          </button>
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-[#0C1116]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={iconSrc} alt="" width={44} height={44} className="h-11 w-11 object-cover" />
            </span>
            <h2 id="pwa-install-title" className="text-[16px] font-bold leading-tight text-[var(--navy)]">
              Get the {appName} app
            </h2>
          </div>
          <ul className="mt-3 flex flex-col gap-1.5">
            {points.map((point) => (
              <li key={point} className="flex items-center gap-2 text-[13.5px] text-[var(--navy)]/80">
                <span className="flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full" style={{ background: `${accent}22`, color: accent }}>
                  <Check size={11} strokeWidth={3} />
                </span>
                {point}
              </li>
            ))}
          </ul>
          {showInstallHelp && !canNativeInstall ? (
            <div className="mt-3 rounded-2xl bg-[#f6f7f9] p-3 text-[12.5px] leading-relaxed text-[var(--navy)]/80">
              {ios ? (
                <p>
                  In Safari, tap <Share size={13} className="inline align-[-2px]" /> Share, then{' '}
                  <span className="font-semibold text-[var(--navy)]">
                    Add to Home Screen <PlusSquare size={13} className="inline align-[-2px]" />
                  </span>
                  .
                </p>
              ) : (
                <p>Open your browser menu and choose Install app or Add to Home Screen.</p>
              )}
            </div>
          ) : null}
        </div>
        <button
          type="button"
          onClick={canNativeInstall ? install : () => setShowInstallHelp((value) => !value)}
          disabled={installing}
          className="flex w-full items-center justify-center gap-2 px-4 py-3.5 text-[14.5px] font-semibold text-white transition hover:brightness-95 disabled:opacity-70"
          style={{ background: accent }}
        >
          {canNativeInstall ? <Download size={16} /> : ios ? <PlusSquare size={16} /> : <Smartphone size={16} />}
          {canNativeInstall ? (installing ? 'Installing…' : 'Download app') : showInstallHelp ? 'Got it' : 'How to install'}
          {!installing ? <ArrowRight size={16} /> : null}
        </button>
      </div>
    </aside>
  );
}
