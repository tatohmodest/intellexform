'use client';

import { ReactNode } from 'react';
import { Check, ShieldCheck } from 'lucide-react';
import BrandLogo from '@/components/BrandLogo';
import { LaptopReview } from '@/components/landing/LineArt';
import { useT } from '@/components/i18n/I18nRoot';

export default function AuthChrome({
  campus,
  tab,
  title,
  subtitle,
  children,
  footer,
}: {
  campus: boolean;
  tab: string;
  title: string;
  subtitle: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
}) {
  const t = useT();
  return (
    <div className="site airy flex min-h-screen">
      <div className="relative hidden w-[46%] flex-col justify-between overflow-hidden border-r border-[#e7e9ec] bg-[#fafbfa] p-12 lg:flex">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-70"
          style={{ backgroundImage: 'radial-gradient(#e7e9ec 1px, transparent 1px)', backgroundSize: '18px 18px' }}
        />
        <div className="relative">
          <BrandLogo href="/" height={30} />
        </div>

        <div className="relative">
          <h1 className="text-[40px] leading-[1.05]">
            {campus ? t('One account for your campus.') : t('Tutorials show you how.')}{' '}
            {!campus && <span className="text-[var(--green-deep)]">{t('We make sure you can.')}</span>}
          </h1>
          <p className="mt-4 max-w-md text-[15px] leading-relaxed text-[#4b5563]">
            {campus
              ? t('One InTelleX account. After you sign in, you will continue into your campus dashboard when you have access.')
              : t('Programmes taught live by InTelleX instructors, a self-paced library and an AI tutor, all in one account.')}
          </p>

          {!campus && (
            <ul className="mt-7 space-y-3">
              {[
                t('Live classes with an InTelleX instructor'),
                t('Projects reviewed by a person, not a quiz'),
                t('An AI tutor for questions between classes'),
                t('A certificate when you complete a programme'),
              ].map((text) => (
                <li key={text} className="flex items-center gap-2.5 text-[14px]">
                  <Check size={16} strokeWidth={2.5} className="shrink-0 text-[var(--green-deep)]" />
                  {text}
                </li>
              ))}
            </ul>
          )}

          <div className="relative mt-8 max-w-[420px]">
            <LaptopReview className="w-full" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/doodles/laying.svg" alt="" className="pointer-events-none absolute left-[30%] top-[-6%] w-[44%] select-none" />
          </div>
        </div>

        <div className="relative flex items-center gap-2 text-[12.5px] text-[#4b5563]">
          <ShieldCheck size={14} />
          {t('Verify your email with a link, then sign in with your password.')}
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center bg-white px-6 py-12">
        <div className="w-full max-w-[420px]">
          <div className="mb-10 lg:hidden">
            <BrandLogo href="/" height={28} />
          </div>

          <div className="eyebrow mb-4">{t(tab)}</div>
          <h2 className="text-[32px] leading-tight">{t(title)}</h2>
          <p className="mt-2 text-[14.5px] text-[#4b5563]">
            {typeof subtitle === 'string' ? t(subtitle) : subtitle}
          </p>
          {children}
          {footer}
        </div>
      </div>
    </div>
  );
}

export function AuthAlert({
  kind,
  children,
}: {
  kind: 'error' | 'info';
  children: ReactNode;
}) {
  const error = kind === 'error';
  return (
    <div
      className="mt-6 rounded-xl border px-4 py-3 text-[13.5px]"
      style={
        error
          ? {
              background: 'rgba(196,98,42,0.08)',
              borderColor: 'rgba(196,98,42,0.3)',
              color: '#a14d18',
            }
          : {
              background: 'rgba(0,179,105,0.08)',
              borderColor: 'rgba(0,179,105,0.28)',
              color: 'var(--green-deep)',
            }
      }
    >
      {children}
    </div>
  );
}

export function AuthSubmit({
  busy,
  label,
  busyLabel,
}: {
  busy: boolean;
  label: string;
  busyLabel: string;
}) {
  return (
    <button
      type="submit"
      disabled={busy}
      className="btn btn-green mt-2 w-full !py-3.5 text-[15px] disabled:opacity-60"
    >
      {busy ? busyLabel : label}
    </button>
  );
}
