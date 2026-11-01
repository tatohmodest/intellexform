import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Circle } from 'lucide-react';
import { getSessionUser } from '@/lib/auth/getUser';
import { getStudentCommandCenter } from '@/lib/learn/commandCenter';
import PersonalTasksPanel from '@/components/dashboard/PersonalTasksPanel';
import PageHeader from '@/components/dashboard/PageHeader';

export const dynamic = 'force-dynamic';

const PRIORITY_LABEL = {
  high: 'Do now',
  medium: 'This week',
  low: 'Keep going',
} as const;

export default async function StudentTodosPage() {
  const session = getSessionUser();
  if (!session) redirect('/login?next=/dashboard/todos');

  const cc = await getStudentCommandCenter(session.uid);

  const academicTodos: {
    id: string;
    title: string;
    detail: string;
    href: string;
    priority: 'high' | 'medium' | 'low';
    source: 'academic';
  }[] = [
    ...cc.assignmentBuckets.overdue.map((a) => ({
      id: a.id,
      title: a.title,
      detail: 'Overdue assignment',
      href: a.href,
      priority: 'high' as const,
      source: 'academic' as const,
    })),
    ...cc.assignmentBuckets.due_today.map((a) => ({
      id: `t-${a.id}`,
      title: a.title,
      detail: 'Due today',
      href: a.href,
      priority: 'high' as const,
      source: 'academic' as const,
    })),
    ...cc.assignmentBuckets.due_week.map((a) => ({
      id: `w-${a.id}`,
      title: a.title,
      detail: 'Due this week',
      href: a.href,
      priority: 'medium' as const,
      source: 'academic' as const,
    })),
    ...cc.today
      .filter((t) => t.kind === 'live_class')
      .map((t) => ({
        id: t.id,
        title: t.title,
        detail: t.subtitle,
        href: t.href,
        priority: 'high' as const,
        source: 'academic' as const,
      })),
    ...cc.continueLearning.slice(0, 3).map((c) => ({
      id: `c-${c.course.id}`,
      title: `Continue: ${c.course.title}`,
      detail: c.nextTitle,
      href: c.href,
      priority: 'low' as const,
      source: 'academic' as const,
    })),
  ];

  const groups = {
    high: academicTodos.filter((t) => t.priority === 'high'),
    medium: academicTodos.filter((t) => t.priority === 'medium'),
    low: academicTodos.filter((t) => t.priority === 'low'),
  };

  return (
    <div className="mx-auto max-w-[920px] space-y-10">
      <PageHeader art="/eco_learning.webp" tone="mint"
        title="Tasks"
        actions={
          <Link href="/dashboard/calendar" className="chip">
            Calendar
          </Link>
        }
      />

      <section>
        <h2 className="mb-3 font-display text-[18px]">Academic</h2>
        {academicTodos.length === 0 ? (
          <p className="text-[14px]" style={{ color: 'var(--ink-soft)' }}>
            No academic tasks right now.
          </p>
        ) : (
          <div className="space-y-6">
            {(['high', 'medium', 'low'] as const).map((priority) => {
              const items = groups[priority];
              if (!items.length) return null;
              return (
                <div key={priority}>
                  <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.14em]" style={{ color: 'var(--ink-soft)' }}>
                    {PRIORITY_LABEL[priority]}
                  </p>
                  <ul className="space-y-2">
                    {items.map((t) => (
                      <li key={t.id}>
                        <Link
                          href={t.href}
                          className="flex items-start gap-3 card p-4"
                        >
                          <Circle size={14} className="mt-1" style={{ color: 'var(--green-deep)' }} />
                          <div>
                            <p className="font-semibold">{t.title}</p>
                            <p className="text-[12.5px]" style={{ color: 'var(--ink-soft)' }}>
                              {t.detail} · Academic
                            </p>
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <PersonalTasksPanel />
    </div>
  );
}
