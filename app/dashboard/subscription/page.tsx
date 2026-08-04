import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Award, CheckCircle2, Clock3, Lock, Sparkles } from 'lucide-react';
import { getSessionUser } from '@/lib/auth/getUser';
import {
  CERT_MONTHLY_XAF,
  CERT_YEARLY_XAF,
  getActiveCertSubscription,
  hasActiveCertSubscription,
} from '@/lib/learn/certSubscription';
import { listPublishedBooks } from '@/lib/learn/ecosystem';
import { TUTORIALS } from '@/lib/tutorials';

export const dynamic = 'force-dynamic';

function countLessonsByLevel() {
  let beginner = 0;
  let intermediate = 0;
  let advanced = 0;

  for (const course of TUTORIALS) {
    for (const section of course.sections) {
      if (section.level === 'beginner') beginner += section.lessons.length;
      if (section.level === 'intermediate') intermediate += section.lessons.length;
      if (section.level === 'advanced') advanced += section.lessons.length;
    }
  }

  return {
    beginner,
    intermediate,
    advanced,
    total: beginner + intermediate + advanced,
  };
}

export default async function SubscriptionPage() {
  const session = getSessionUser();
  if (!session) redirect('/login?next=/dashboard/subscription');

  const [{ beginner, intermediate, advanced, total }, hasActive, activeSub, books] = await Promise.all([
    Promise.resolve(countLessonsByLevel()),
    hasActiveCertSubscription(session.uid),
    getActiveCertSubscription(session.uid),
    listPublishedBooks(),
  ]);

  const paidBooksCount = books.filter((b) => (Number(b.priceXAF) || 0) > 0).length;
  const unlockedLessons = hasActive ? total : beginner;
  const lockedLessons = Math.max(0, total - unlockedLessons);

  return (
    <div className="mx-auto max-w-[980px]">
      <header className="mb-8 border-b pb-6" style={{ borderColor: 'var(--line)' }}>
        <div className="tab mb-2 inline-flex items-center gap-1.5">
          <Award size={11} /> Subscription
        </div>
        <h1 className="font-display text-[30px] leading-tight">Your subscription</h1>
        <p className="mt-2 max-w-[680px] text-[14.5px]" style={{ color: 'var(--ink-soft)' }}>
          See your current InTelleX student plan, renewal window, and exactly what content is
          unlocked in your dashboard.
        </p>
      </header>

      {hasActive && activeSub ? (
        <section
          className="mb-7 rounded-2xl border p-5 sm:p-6"
          style={{ borderColor: 'rgba(0,179,105,0.38)', background: 'rgba(0,179,105,0.08)' }}
        >
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 text-[13px] font-semibold" style={{ color: 'var(--green-deep)' }}>
                <CheckCircle2 size={14} /> Active plan
              </div>
              <h2 className="mt-2 font-display text-[24px] capitalize">
                {activeSub.plan} certification subscription
              </h2>
              <p className="mt-1 text-[13.5px]" style={{ color: 'var(--ink-soft)' }}>
                Started {new Date(activeSub.startsAt).toLocaleDateString()} · Ends{' '}
                {new Date(activeSub.endsAt).toLocaleDateString()}
              </p>
            </div>
            <div className="rounded-xl border px-4 py-3" style={{ borderColor: 'rgba(0,179,105,0.28)' }}>
              <div className="text-[12px]" style={{ color: 'var(--ink-soft)' }}>Current price</div>
              <div className="mt-1 text-[20px] font-semibold" style={{ color: 'var(--ink)' }}>
                {activeSub.priceXAF.toLocaleString()} XAF
              </div>
            </div>
          </div>
        </section>
      ) : (
        <section className="mb-7 rounded-2xl border p-5 sm:p-6" style={{ borderColor: 'var(--line)' }}>
          <div className="flex flex-wrap items-start justify-between gap-5">
            <div>
              <div className="inline-flex items-center gap-2 text-[13px] font-semibold" style={{ color: 'var(--ink-soft)' }}>
                <Lock size={14} /> No active subscription
              </div>
              <h2 className="mt-2 font-display text-[24px]">Upgrade to unlock everything</h2>
              <p className="mt-1 max-w-[560px] text-[13.5px]" style={{ color: 'var(--ink-soft)' }}>
                Beginner lessons stay open. Intermediate and advanced paths unlock with the
                certification plan.
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <Link href="/membership" className="btn btn-primary">
                <Sparkles size={14} /> Subscribe now
              </Link>
              <div className="text-[12px]" style={{ color: 'var(--ink-soft)' }}>
                {CERT_MONTHLY_XAF.toLocaleString()} XAF/month · {CERT_YEARLY_XAF.toLocaleString()} XAF/year
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="mb-7 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border p-4" style={{ borderColor: 'var(--line)' }}>
          <div className="text-[12px] uppercase tracking-[0.12em]" style={{ color: 'var(--ink-soft)' }}>
            Lessons unlocked
          </div>
          <div className="mt-2 font-display text-[30px]">{unlockedLessons}</div>
          <p className="mt-1 text-[12.5px]" style={{ color: 'var(--ink-soft)' }}>
            Out of {total} total guided lessons
          </p>
        </div>
        <div className="rounded-2xl border p-4" style={{ borderColor: 'var(--line)' }}>
          <div className="text-[12px] uppercase tracking-[0.12em]" style={{ color: 'var(--ink-soft)' }}>
            Locked lessons
          </div>
          <div className="mt-2 font-display text-[30px]">{lockedLessons}</div>
          <p className="mt-1 text-[12.5px]" style={{ color: 'var(--ink-soft)' }}>
            Intermediate + advanced progression
          </p>
        </div>
        <div className="rounded-2xl border p-4" style={{ borderColor: 'var(--line)' }}>
          <div className="text-[12px] uppercase tracking-[0.12em]" style={{ color: 'var(--ink-soft)' }}>
            Paid books included
          </div>
          <div className="mt-2 font-display text-[30px]">{hasActive ? paidBooksCount : 0}</div>
          <p className="mt-1 text-[12.5px]" style={{ color: 'var(--ink-soft)' }}>
            {hasActive ? 'All paid library books are included' : 'Activate plan to unlock paid books'}
          </p>
        </div>
      </section>

      <section className="rounded-2xl border p-5 sm:p-6" style={{ borderColor: 'var(--line)' }}>
        <h3 className="font-display text-[22px]">What is unlocked</h3>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          <li className="rounded-xl border p-3" style={{ borderColor: 'var(--line)' }}>
            <div className="text-[14px] font-semibold">Beginner tutorials</div>
            <p className="mt-1 text-[13px]" style={{ color: 'var(--ink-soft)' }}>
              {beginner} lessons are always open for registered students.
            </p>
          </li>
          <li className="rounded-xl border p-3" style={{ borderColor: 'var(--line)' }}>
            <div className="text-[14px] font-semibold">Intermediate tutorials</div>
            <p className="mt-1 text-[13px]" style={{ color: 'var(--ink-soft)' }}>
              {hasActive ? `${intermediate} lessons unlocked` : `${intermediate} lessons locked until you subscribe`}.
            </p>
          </li>
          <li className="rounded-xl border p-3" style={{ borderColor: 'var(--line)' }}>
            <div className="text-[14px] font-semibold">Advanced tutorials</div>
            <p className="mt-1 text-[13px]" style={{ color: 'var(--ink-soft)' }}>
              {hasActive ? `${advanced} lessons unlocked` : `${advanced} lessons locked until you subscribe`}.
            </p>
          </li>
          <li className="rounded-xl border p-3" style={{ borderColor: 'var(--line)' }}>
            <div className="text-[14px] font-semibold">Library paid books</div>
            <p className="mt-1 text-[13px]" style={{ color: 'var(--ink-soft)' }}>
              {hasActive
                ? `Included: ${paidBooksCount} paid books plus all free books.`
                : `Locked: ${paidBooksCount} paid books. Free books are still available.`}
            </p>
          </li>
        </ul>

        <div className="mt-5 flex flex-wrap gap-3">
          <Link href="/dashboard/courses" className="btn btn-ghost">
            Continue learning
          </Link>
          <Link href="/dashboard/library" className="btn btn-ghost">
            Open library
          </Link>
          {!hasActive && (
            <Link href="/membership" className="btn btn-primary">
              <Clock3 size={14} /> Activate subscription
            </Link>
          )}
        </div>
      </section>
    </div>
  );
}
