'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Video, Bot, BookOpen, ShieldCheck, Flame } from 'lucide-react';
import BrandLogo from '@/components/BrandLogo';

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
  return (
    <div className="flex min-h-screen">
      <div
        className="relative hidden w-[46%] flex-col justify-between overflow-hidden p-12 lg:flex"
        style={{
          background:
            'radial-gradient(1200px 600px at -10% -10%, rgba(0,179,105,0.35), transparent 60%), radial-gradient(900px 500px at 110% 110%, rgba(74,144,226,0.3), transparent 60%), #0C1116',
        }}
      >
        <div className="flex items-center gap-2.5">
          <BrandLogo href="/" height={30} className="brightness-0 invert" />
          <span className="mono rounded-full border border-white/20 px-2.5 py-0.5 text-[10px] uppercase tracking-[0.14em] text-white/70">
            Learning
          </span>
        </div>

        <div>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="font-display text-[40px] leading-[1.15] text-white"
          >
            Learn like the world is
            <span className="italic" style={{ color: '#1ED77E' }}>
              {' '}
              watching you win.
            </span>
          </motion.h1>
          <p className="mt-4 max-w-md text-[15.5px] leading-relaxed text-white/70">
            {campus
              ? 'One InTelleX account. After you sign in, you will continue into your campus dashboard when you have access.'
              : 'Self-paced courses with real curricula, live mentorship, and an AI tutor. Create your account once — then join any campus that invites you.'}
          </p>

          {!campus && (
            <div className="mt-8 space-y-3.5">
              {[
                { icon: <BookOpen size={16} />, text: '17 course tracks · 500+ hands-on lessons' },
                { icon: <Video size={16} />, text: '1-on-1 mentorship & live classes (HD video)' },
                { icon: <Bot size={16} />, text: 'AI tutor that knows InTelleX + your catalogue' },
                { icon: <Flame size={16} />, text: 'Streaks, XP and certificates that keep you going' },
              ].map((f, i) => (
                <motion.div
                  key={f.text}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + i * 0.08 }}
                  className="flex items-center gap-3 text-[14px] text-white/85"
                >
                  <span
                    className="flex h-8 w-8 items-center justify-center rounded-full"
                    style={{ background: 'rgba(30,215,126,0.14)', color: '#1ED77E' }}
                  >
                    {f.icon}
                  </span>
                  {f.text}
                </motion.div>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 text-[12.5px] text-white/50">
          <ShieldCheck size={14} />
          Verify your email with a link, then sign in with your password.
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center bg-paper px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-[420px]"
        >
          <div className="mb-10 lg:hidden">
            <BrandLogo href="/" height={28} />
          </div>

          <div className="tab mb-4 inline-flex items-center gap-1.5">{tab}</div>
          <h2 className="font-display text-[30px] leading-tight">{title}</h2>
          <p className="mt-2 text-[14.5px]" style={{ color: 'var(--ink-soft)' }}>
            {subtitle}
          </p>
          {children}
          {footer}
        </motion.div>
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
      className="mt-2 flex w-full items-center justify-center gap-2 rounded-full px-6 py-4 text-[15px] font-semibold text-white transition-transform hover:-translate-y-0.5 disabled:opacity-60"
      style={{ background: '#0C1116' }}
    >
      {busy ? busyLabel : label}
    </button>
  );
}
