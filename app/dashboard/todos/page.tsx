import Link from 'next/link';
import { redirect } from 'next/navigation';
import { CheckSquare, Circle } from 'lucide-react';
import { getSessionUser } from '@/lib/auth/getUser';
import { getStudentAgenda } from '@/lib/learn/studentAgenda';

export const dynamic = 'force-dynamic';

const PRIORITY_LABEL = {
  high: 'Do now',
  medium: 'This week',
  low: 'Keep going',
} as const;

export default async function StudentTodosPage() {
  const session = getSessionUser();
  if (!session) redirect('/login?next=/dashboard/todos');

  const { todos } = await getStudentAgenda(session.uid);

  const groups = {
    high: todos.filter((t) => t.priority === 'high'),
    medium: todos.filter((t) => t.priority === 'medium'),
    low: todos.filter((t) => t.priority === 'low'),
  };

  return (
    <div className="mx-auto max-w-[920px]">
      <header className="mb-8 border-b pb-6" style={{ borderColor: 'var(--line)' }}>
        <div className="tab mb-2 inline-flex items-center gap-1.5">
          <CheckSquare size={11} /> To-do
        </div>
        <h1 className="font-display text-[30px] leading-tight">My to-do list</h1>
        <p className="mt-2 max-w-[620px] text-[14.5px]" style={{ color: 'var(--ink-soft)' }}>
          Built from live classes, assignment deadlines, and courses you should continue — so you
          always know what matters next.
        </p>
        <div className="mt-4 flex flex-wrap gap-3 text-[13px] font-semibold">
          <Link href="/dashboard/calendar" style={{ color: 'var(--green-deep)' }}>
            Open calendar →
          </Link>
          <Link href="/dashboard/assignments" style={{ color: 'var(--ink-soft)' }}>
            All assignments
          </Link>
          <Link href="/dashboard/courses" style={{ color: 'var(--ink-soft)' }}>
            My courses
          </Link>
        </div>
      </header>

      {todos.length === 0 ? (
        <div
          className="rounded-2xl border border-dashed p-10 text-center"
          style={{ borderColor: 'var(--line)' }}
        >
          <CheckSquare size={28} style={{ color: 'var(--ink-soft)' }} />
          <p className="mt-3 font-display text-[20px]">You&apos;re clear</p>
          <p className="mt-1 text-[14px]" style={{ color: 'var(--ink-soft)' }}>
            No urgent assignments or live classes right now. Browse courses to keep learning.
          </p>
          <Link
            href="/dashboard/courses"
            className="mt-5 inline-block text-[13.5px] font-semibold"
            style={{ color: 'var(--green-deep)' }}
          >
            Go to My Courses →
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          {(['high', 'medium', 'low'] as const).map((priority) => {
            const items = groups[priority];
            if (!items.length) return null;
            return (
              <section key={priority}>
                <h2
                  className="mb-3 font-mono text-[11px] uppercase tracking-[0.16em]"
                  style={{ color: 'var(--ink-soft)' }}
                >
                  {PRIORITY_LABEL[priority]}
                </h2>
                <ul className="space-y-2">
                  {items.map((t) => (
                    <li key={t.id}>
                      <Link
                        href={t.href}
                        className="flex items-start gap-3 border p-4 transition-shadow hover:shadow-card"
                        style={{ borderColor: 'var(--line)' }}
                      >
                        <Circle
                          size={16}
                          className="mt-1 shrink-0"
                          style={{
                            color:
                              priority === 'high'
                                ? '#b91c1c'
                                : priority === 'medium'
                                  ? '#b45309'
                                  : 'var(--ink-soft)',
                          }}
                        />
                        <div className="min-w-0">
                          <p className="font-semibold">{t.title}</p>
                          <p className="mt-0.5 text-[12.5px]" style={{ color: 'var(--ink-soft)' }}>
                            {t.detail}
                          </p>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
