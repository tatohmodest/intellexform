import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/auth/getUser';
import { getStudentCommandCenter } from '@/lib/learn/commandCenter';
import { hasActiveCertSubscription } from '@/lib/learn/certSubscription';
import PageHeader from '@/components/dashboard/PageHeader';

export const dynamic = 'force-dynamic';

export default async function MyLearningPage({
  searchParams,
}: {
  searchParams?: { tab?: string };
}) {
  const session = getSessionUser();
  if (!session) redirect('/login?next=/dashboard/my-learning');

  const [cc, isMember] = await Promise.all([
    getStudentCommandCenter(session.uid),
    hasActiveCertSubscription(session.uid),
  ]);

  const tab = searchParams?.tab || 'currently';
  const sections = [
    { id: 'currently', label: 'Currently learning', courses: cc.learningBuckets.currently },
    { id: 'upcoming', label: 'Upcoming', courses: cc.learningBuckets.upcoming },
    { id: 'completed', label: 'Completed', courses: cc.learningBuckets.completed },
    { id: 'recommended', label: 'Recommended', courses: cc.learningBuckets.recommended },
  ] as const;

  const active = sections.find((s) => s.id === tab) || sections[0];

  return (
    <div className="mx-auto max-w-[1080px]">
      <PageHeader
        title="My Learning"
        actions={
          <>
            <Link href="/dashboard/courses" className="chip">
              Browse courses
            </Link>
            <Link href="/dashboard/library/learn" className="chip">
              Book tutor
            </Link>
            {isMember ? (
              <Link href="/dashboard/courses/browse/suggested-catalogue" className="chip">
                Catalogue
              </Link>
            ) : (
              <Link href="/membership" className="chip chip-primary">
                Upgrade
              </Link>
            )}
          </>
        }
      />

      <nav className="no-scrollbar -mx-4 mb-6 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:px-0">
        {sections.map((s) => {
          const on = active.id === s.id;
          return (
            <Link
              key={s.id}
              href={`/dashboard/my-learning?tab=${s.id}`}
              className={`chip shrink-0 ${on ? 'chip-primary' : ''}`}
            >
              {s.label} <span className="opacity-60">{s.courses.length}</span>
            </Link>
          );
        })}
      </nav>

      {active.courses.length === 0 ? (
        <div className="card p-10 text-center">
          <p className="font-display text-[19px]">Nothing here yet</p>
          <Link href="/dashboard/courses" className="chip chip-primary mt-4">
            Browse courses
          </Link>
        </div>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2">
          {active.courses.map((c) => (
            <li key={c.id}>
              <Link
                href={c.continueHref || c.href}
                className="card block p-4"
              >
                <p className="truncate font-semibold">{c.title}</p>
                <p className="muted mt-1 text-[12.5px] capitalize">
                  {c.kind ? c.kind.replace(/-/g, ' ') : 'Course'}
                  {c.deliveryMode ? ` · ${String(c.deliveryMode).replace(/_/g, ' ')}` : ''}
                  {c.liveSession ? ' · Live now' : ''}
                </p>
                <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full" style={{ background: 'var(--paper-dim)' }}>
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${Math.min(100, Math.max(0, c.pct))}%`,
                      background: 'var(--green)',
                    }}
                  />
                </div>
                <p className="mt-2 text-[12.5px] font-semibold" style={{ color: 'var(--green-deep)' }}>
                  {c.pct >= 100 ? 'Review' : c.pct > 0 ? 'Continue →' : 'Start →'} · {Math.round(c.pct)}%
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
