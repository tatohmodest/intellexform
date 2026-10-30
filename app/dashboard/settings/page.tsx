import { redirect } from 'next/navigation';
import { ShieldCheck } from 'lucide-react';
import { getSessionUser } from '@/lib/auth/getUser';
import { getLearner } from '@/lib/learn/repo';
import SettingsForm from '@/components/dashboard/SettingsForm';
import PageHeader from '@/components/dashboard/PageHeader';

export const dynamic = 'force-dynamic';

export default async function SettingsPage() {
  const session = getSessionUser();
  if (!session) redirect('/login?next=/dashboard/settings');

  const learner = await getLearner(session.uid);

  return (
    <div className="mx-auto max-w-[760px] overflow-x-hidden">
      <PageHeader title="Settings" />

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
          <div className="text-[14px] font-semibold">Signed in with email</div>
          <div className="truncate text-[13px]" style={{ color: 'var(--ink-soft)' }}>
            {learner?.email || session.email || 'Connected account'}
          </div>
        </div>
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
