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

  return (
    <aside
      className="fixed inset-x-0 bottom-0 z-[80] px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:px-5"
      aria-label={`Install ${appName}`}
    >
      <div
        className="mx-auto max-w-[760px] overflow-hidden rounded-[24px] border shadow-[0_18px_60px_-24px_rgba(12,17,22,0.4)] backdrop-blur-xl"
        style={{
          background: `linear-gradient(110deg, ${accent}14 0%, rgba(255,255,255,0.97) 42%)`,
          borderColor: 'var(--line)',
          color: 'var(--ink)',
        }}
      >
        <div className="flex items-center gap-3 p-3.5 sm:gap-4 sm:px-5 sm:py-4">
          <span
            className="flex h-12 w-12 flex-shrink-0 items-center justify-center overflow-hidden rounded-[15px] border bg-[#0C1116]"
            style={{ borderColor: 'var(--line)' }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={iconSrc} alt="" width={48} height={48} className="h-12 w-12 object-cover" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em]" style={{ color: accent }}>
              Take learning with you
            </p>
            <h2 id="pwa-install-title" className="display mt-0.5 text-[16px] leading-tight sm:text-[18px]">
              Get {appName} on your device
            </h2>
            <p className="mt-1 hidden text-[13px] leading-relaxed sm:block" style={{ color: 'var(--ink-soft)' }}>
              {brand
                ? `Open ${appName} from your home screen with your campus branding.`
                : 'Launch your courses and dashboard from your home screen.'}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={canNativeInstall ? install : () => setShowInstallHelp((value) => !value)}
              disabled={installing}
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full px-3.5 text-[12px] font-semibold text-white transition hover:brightness-95 disabled:opacity-70 sm:px-5 sm:text-[13px]"
              style={{ background: accent }}
            >
              {canNativeInstall ? <Download size={15} /> : ios ? <PlusSquare size={15} /> : <Smartphone size={15} />}
              <span className="hidden sm:inline">
                {canNativeInstall ? (installing ? 'Installing…' : 'Install app') : 'How to install'}
              </span>
              <span className="sm:hidden">{canNativeInstall ? (installing ? 'Installing…' : 'Install') : 'How-to'}</span>
            </button>
            <button
              type="button"
              onClick={dismiss}
              aria-label="Dismiss app install banner"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition hover:bg-black/5"
              style={{ color: 'var(--ink-soft)' }}
            >
              <X size={17} />
            </button>
          </div>
        </div>
        {showInstallHelp && !canNativeInstall ? (
          <div
            className="border-t px-4 py-3 text-[13px] leading-relaxed sm:px-5"
            style={{ borderColor: 'var(--line)', color: 'var(--ink-soft)' }}
          >
            {ios ? (
              <p>
                Open this page in Safari, tap <Share size={14} className="inline align-[-2px]" /> Share, choose{' '}
                <span className="font-semibold" style={{ color: 'var(--ink)' }}>
                  Add to Home Screen <PlusSquare size={14} className="inline align-[-2px]" />
                </span>
                , then tap Add.
              </p>
            ) : (
              <p>Open your browser menu and choose Install app or Add to Home Screen.</p>
            )}
          </div>
        ) : null}
      </div>
    </aside>
  );
}
