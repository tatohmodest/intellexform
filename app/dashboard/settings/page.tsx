import { redirect } from 'next/navigation';
import { Settings, ShieldCheck } from 'lucide-react';
import { getSessionUser } from '@/lib/auth/getUser';
import { getLearner } from '@/lib/learn/repo';
import SettingsForm from '@/components/dashboard/SettingsForm';

export const dynamic = 'force-dynamic';

export default async function SettingsPage() {
  const session = getSessionUser();
  if (!session) redirect('/login?next=/dashboard/settings');

  const learner = await getLearner(session.uid);

  return (
    <div className="mx-auto max-w-[760px] overflow-x-hidden">
      <header className="mb-10 border-b pb-8" style={{ borderColor: 'var(--line)' }}>
        <p className="font-mono text-[11px] uppercase tracking-[0.18em]" style={{ color: 'var(--ink-soft)' }}>
          Account
        </p>
        <h1 className="mt-2 font-display text-[32px] leading-[0.95] tracking-tight sm:text-[36px]">
          Settings
        </h1>
        <p className="mt-3 max-w-md text-[15px]" style={{ color: 'var(--ink-soft)' }}>
          Customize your profile, preferences, and how InTelleX reaches you.
        </p>
      </header>

      <div
        className="mb-10 flex flex-wrap items-center gap-4 border-b pb-8"
        style={{ borderColor: 'var(--line)' }}
      >
        <span
          className="flex h-10 w-10 items-center justify-center"
          style={{ background: 'rgba(0,179,105,0.12)', color: 'var(--green-deep)' }}
        >
          <ShieldCheck size={19} />
        </span>
        <div className="min-w-0 flex-1">
          <div className="text-[14px] font-semibold">Signed in with LoopingBinary</div>
          <div className="truncate text-[13px]" style={{ color: 'var(--ink-soft)' }}>
            {learner?.email || session.email || 'Connected account'} · account id{' '}
            <span className="mono">{session.uid.slice(0, 12)}…</span>
          </div>
        </div>
        <a
          href="https://auth.loopingbinary.com"
          target="_blank"
          rel="noreferrer"
          className="text-[13px] font-semibold underline"
          style={{ color: 'var(--blue-ink)' }}
        >
          Manage account
        </a>
      </div>

      <SettingsForm
        initialName={learner?.name ?? session.name}
        initialWeeklyGoal={learner?.weeklyGoalMinutes ?? 150}
        initialAvatar={learner?.avatar}
        initialPreferences={learner?.preferences}
      />
    </div>
  );
}
