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
      <PageHeader art="/illustrations/multitasking.png" tone="sky" title="Settings" description="Your profile, notifications and account preferences." />

      <div
        className="mb-6 flex flex-wrap items-center gap-4 rounded-3xl p-5"
        style={{ background: 'var(--pastel-mint)' }}
      >
        <span
          className="flex h-10 w-10 items-center justify-center rounded-full"
          style={{ background: 'rgba(255,255,255,0.8)', color: 'var(--green-deep)' }}
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
