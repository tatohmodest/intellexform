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
    <div className="mx-auto max-w-[760px]">
      <div className="mb-8">
        <div className="tab mb-2 inline-flex items-center gap-1.5">
          <Settings size={11} />
          Account
        </div>
        <h1 className="font-display text-[30px] leading-tight">Settings</h1>
      </div>

      <div
        className="mb-8 flex flex-wrap items-center gap-4 rounded-2xl border p-5"
        style={{ borderColor: 'var(--line)', background: 'var(--paper-dim)' }}
      >
        <span
          className="flex h-10 w-10 items-center justify-center rounded-xl"
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
      />
    </div>
  );
}
