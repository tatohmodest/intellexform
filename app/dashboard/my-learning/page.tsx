import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Sparkles } from 'lucide-react';
import { getSessionUser } from '@/lib/auth/getUser';
import { getStudentCommandCenter } from '@/lib/learn/commandCenter';
import { hasActiveCertSubscription } from '@/lib/learn/certSubscription';

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
      <header className="mb-8 border-b pb-6" style={{ borderColor: 'var(--line)' }}>
        <div className="tab mb-2 inline-flex items-center gap-1.5">
          <Sparkles size={11} /> My Learning
        </div>
        <h1 className="font-display text-[32px] leading-tight">My Learning</h1>
        <p className="mt-2 max-w-[560px] text-[14.5px]" style={{ color: 'var(--ink-soft)' }}>
          Currently learning, upcoming, completed, and recommended — return exactly where you
          stopped.
        </p>
        <div className="mt-4 flex flex-wrap gap-3 text-[13px] font-semibold">
          <Link href="/dashboard/courses" style={{ color: 'var(--green-deep)' }}>
            Full course browser →
          </Link>
          <Link href="/dashboard/library/learn" style={{ color: 'var(--green-deep)' }}>
            Book tutor →
          </Link>
          {isMember ? (
            <Link href="/dashboard/courses/browse/suggested-catalogue" style={{ color: 'var(--ink-soft)' }}>
              Explore catalogue
            </Link>
          ) : (
            <Link href="/membership" style={{ color: 'var(--ink-soft)' }}>
              Unlock more with Student plan
            </Link>
          )}
        </div>
      </header>

      <nav className="mb-6 flex gap-2 overflow-x-auto">
        {sections.map((s) => {
          const on = active.id === s.id;
          return (
            <Link
              key={s.id}
              href={`/dashboard/my-learning?tab=${s.id}`}
              className="shrink-0 border px-3 py-2 text-[12.5px] font-semibold"
              style={{
                borderColor: on ? 'var(--ink)' : 'var(--line)',
                background: on ? 'var(--ink)' : 'transparent',
                color: on ? '#fff' : 'var(--ink-soft)',
              }}
            >
              {s.label} ({s.courses.length})
            </Link>
          );
        })}
      </nav>

      {active.courses.length === 0 ? (
        <div className="border border-dashed p-10 text-center" style={{ borderColor: 'var(--line)' }}>
          <p className="font-display text-[20px]">No courses here yet</p>
          <p className="mt-1 text-[14px]" style={{ color: 'var(--ink-soft)' }}>
            Enroll from My Courses or explore recommendations.
          </p>
          <Link
            href="/dashboard/courses"
            className="mt-5 inline-block px-4 py-2.5 text-[13px] font-semibold text-white"
            style={{ background: 'var(--green-deep)' }}
          >
            Browse courses
          </Link>
        </div>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2">
          {active.courses.map((c) => (
            <li key={c.id}>
              <Link
                href={c.continueHref || c.href}
                className="block border p-4 hover:shadow-card"
                style={{ borderColor: 'var(--line)' }}
              >
                <p className="font-semibold">{c.title}</p>
                <p className="mt-1 text-[12.5px]" style={{ color: 'var(--ink-soft)' }}>
                  {c.kind ? c.kind.replace(/-/g, ' ') : 'Course'}
                  {c.deliveryMode ? ` · ${String(c.deliveryMode).replace(/_/g, ' ')}` : ''}
                  {c.liveSession ? ' · Live now' : ''}
                </p>
                <div className="mt-3 h-1.5 w-full" style={{ background: 'var(--paper-dim)' }}>
                  <div
                    className="h-full"
                    style={{
                      width: `${Math.min(100, Math.max(0, c.pct))}%`,
                      background: 'var(--green-deep)',
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
