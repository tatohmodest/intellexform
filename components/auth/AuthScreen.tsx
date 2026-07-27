'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Video,
  Bot,
  BookOpen,
  ShieldCheck,
  Flame,
  ArrowRight,
} from 'lucide-react';
import BrandLogo from '@/components/BrandLogo';

const ERROR_MESSAGES: Record<string, string> = {
  oauth_not_configured:
    'LoopingBinary sign-in is not configured yet. Add LB_OAUTH_CLIENT_ID to the environment and try again.',
  state_mismatch: 'Your sign-in session expired. Please try again.',
  missing_code: 'LoopingBinary did not return an authorization code. Please try again.',
  exchange_failed: 'We could not verify your LoopingBinary account. Please try again.',
  access_denied: 'You cancelled the sign-in. No worries — try again whenever you are ready.',
};

function LoopingBinaryMark({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M8 4a8 8 0 1 0 8 8"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <path
        d="M16 20a8 8 0 1 0-8-8"
        stroke="#1ED77E"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function AuthScreen({ mode }: { mode: 'login' | 'signup' }) {
  const params = useSearchParams();
  const error = params.get('error');
  const next = params.get('next') || '/dashboard';
  const isSignup = mode === 'signup';

  const oauthHref = `/api/auth/login?intent=${mode}&next=${encodeURIComponent(next)}`;

  return (
    <div className="flex min-h-screen">
      {/* ── Left: brand panel ── */}
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
              {' '}watching you win.
            </span>
          </motion.h1>
          <p className="mt-4 max-w-md text-[15.5px] leading-relaxed text-white/70">
            Self-paced courses with real curricula, live mentorship over crystal-clear
            video, and an AI tutor that never sleeps. One account across the whole
            LoopingBinary ecosystem.
          </p>

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
        </div>

        <div className="flex items-center gap-2 text-[12.5px] text-white/50">
          <ShieldCheck size={14} />
          Secured by LoopingBinary Auth — OAuth 2.0, no passwords stored on Intellex.
        </div>
      </div>

      {/* ── Right: auth card ── */}
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

          <div className="tab mb-4 inline-flex items-center gap-1.5">
            {isSignup ? 'Create your account' : 'Welcome back'}
          </div>
          <h2 className="font-display text-[30px] leading-tight">
            {isSignup ? 'Start learning in seconds' : 'Sign in to keep learning'}
          </h2>
          <p className="mt-2 text-[14.5px]" style={{ color: 'var(--ink-soft)' }}>
            {isSignup
              ? 'One click with your LoopingBinary account — no forms, no passwords.'
              : 'Pick up right where you left off — courses, mentors and your AI tutor.'}
          </p>

          {error && (
            <div
              className="mt-6 rounded-xl border px-4 py-3 text-[13.5px]"
              style={{
                background: 'rgba(196,98,42,0.08)',
                borderColor: 'rgba(196,98,42,0.3)',
                color: '#a14d18',
              }}
            >
              {ERROR_MESSAGES[error] ?? 'Something went wrong signing you in. Please try again.'}
            </div>
          )}

          <a
            href={oauthHref}
            className="mt-8 flex w-full items-center justify-center gap-3 rounded-full px-6 py-4 text-[15px] font-semibold text-white transition-transform hover:-translate-y-0.5"
            style={{ background: '#0C1116' }}
          >
            <LoopingBinaryMark />
            {isSignup ? 'Sign up with LoopingBinary' : 'Continue with LoopingBinary'}
            <ArrowRight size={16} className="opacity-70" />
          </a>

          <div className="mt-5 flex items-center gap-3">
            <div className="h-px flex-1" style={{ background: 'var(--line)' }} />
            <span className="mono text-[10.5px] uppercase tracking-[0.14em]" style={{ color: 'var(--ink-soft)' }}>
              One account, whole ecosystem
            </span>
            <div className="h-px flex-1" style={{ background: 'var(--line)' }} />
          </div>

          <p className="mt-5 text-center text-[13.5px]" style={{ color: 'var(--ink-soft)' }}>
            {isSignup ? (
              <>
                Already have an account?{' '}
                <Link href="/login" className="font-semibold" style={{ color: 'var(--green-deep)' }}>
                  Sign in
                </Link>
              </>
            ) : (
              <>
                New to Intellex?{' '}
                <Link href="/signup" className="font-semibold" style={{ color: 'var(--green-deep)' }}>
                  Create an account
                </Link>
              </>
            )}
          </p>

          <p className="mt-10 text-center text-[12px] leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
            By continuing you agree to the Intellex terms. Your identity is verified by{' '}
            <a
              href="https://auth.loopingbinary.com"
              target="_blank"
              rel="noreferrer"
              className="underline"
            >
              LoopingBinary Auth
            </a>
            .
          </p>
        </motion.div>
      </div>
    </div>
  );
}
