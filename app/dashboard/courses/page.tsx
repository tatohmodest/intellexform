import Link from 'next/link';
import { redirect } from 'next/navigation';
import { BookOpen, GraduationCap, Video } from 'lucide-react';
import { getSessionUser } from '@/lib/auth/getUser';
import { getMyCourseSections } from '@/lib/learn/myCourses';
import { getLearner } from '@/lib/learn/repo';
import { interestLabels } from '@/lib/learn/interests';
import { PROGRAMMES, PROGRAMME_CATEGORIES, type ProgrammeCategory } from '@/lib/programmes';
import CoursesBrowser from '@/components/dashboard/CoursesBrowser';
import PageHeader from '@/components/dashboard/PageHeader';
import ProgrammeCard from '@/components/programmes/ProgrammeCard';

export const dynamic = 'force-dynamic';

export default async function CoursesPage({ searchParams }: { searchParams?: { category?: string } }) {
  const session = getSessionUser();
  if (!session) redirect('/login?next=/dashboard/courses');

  const learner = await getLearner(session.uid);
  const interestText = interestLabels(learner?.preferences?.interests || []).join(' · ');
  const active = PROGRAMME_CATEGORIES.find((c) => c.id === searchParams?.category)?.id as ProgrammeCategory | undefined;
  const programmes = PROGRAMMES.filter((p) => !active || p.category === active);

  let sections: Awaited<ReturnType<typeof getMyCourseSections>>['sections'] = [];
  let total = 0;
  let inProgress = 0;
  try {
    const data = await getMyCourseSections(session.uid);
    sections = data.sections;
    total = data.total;
    inProgress = data.inProgress;
  } catch (err) {
    console.error('getMyCourseSections failed:', err);
  }

  const jump = [
    { href: '#programmes', label: 'Programmes', icon: GraduationCap },
    { href: '#free-courses', label: 'Free & self-paced', icon: BookOpen },
    { href: '/dashboard/classroom', label: 'Live classes', icon: Video },
  ];

  return (
    <div className="mx-auto max-w-[1180px] overflow-x-hidden">
      <PageHeader
        art="/hero_illustration.webp"
        tone="sky"
        title="Courses"
        description={
          interestText
            ? `Picked for ${interestText}. Learn live in a programme, or at your own pace for free.`
            : 'Learn live in a programme with an instructor, or study free and self-paced courses at your own pace.'
        }
      >
        <nav className="mt-6 inline-flex flex-wrap gap-1 rounded-2xl bg-white/60 p-1" aria-label="Course sections">
          {jump.map((j) => (
            <Link
              key={j.href}
              href={j.href}
              className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-[14px] font-semibold text-[var(--navy)] transition-colors hover:bg-white"
            >
              <j.icon size={15} /> {j.label}
            </Link>
          ))}
        </nav>
      </PageHeader>

      {/* Programmes: the same catalogue as the homepage */}
      <section id="programmes" className="scroll-mt-24">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="text-[13px] font-semibold text-[var(--green-deep)]">Programmes</div>
            <h2 className="mt-1 text-[24px] font-bold text-[var(--navy)] sm:text-[28px]">Learn live with an instructor</h2>
          </div>
          <div className="no-scrollbar -mx-3 flex gap-1 overflow-x-auto rounded-2xl bg-white p-1 px-3 sm:mx-0 sm:px-1">
            <Link
              href="/dashboard/courses#programmes"
              className={`shrink-0 rounded-xl px-3.5 py-2 text-[13.5px] font-semibold transition-colors ${
                !active ? 'bg-[var(--navy)] text-white' : 'text-[var(--navy)] hover:bg-[var(--paper-dim)]'
              }`}
            >
              All
            </Link>
            {PROGRAMME_CATEGORIES.map((c) => (
              <Link
                key={c.id}
                href={`/dashboard/courses?category=${c.id}#programmes`}
                className={`shrink-0 rounded-xl px-3.5 py-2 text-[13.5px] font-semibold transition-colors ${
                  active === c.id ? 'bg-[var(--navy)] text-white' : 'text-[var(--navy)] hover:bg-[var(--paper-dim)]'
                }`}
              >
                {c.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {programmes.map((p) => (
            <ProgrammeCard key={p.id} programme={p} />
          ))}
        </div>
      </section>

      {/* Free + self-paced courses (enrolled first, then suggestions) */}
      <section id="free-courses" className="mt-14 scroll-mt-24">
        <div className="mb-5">
          <div className="text-[13px] font-semibold text-[var(--green-deep)]">Free & self-paced</div>
          <h2 className="mt-1 text-[24px] font-bold text-[var(--navy)] sm:text-[28px]">Learn at your own pace</h2>
        </div>
        <CoursesBrowser sections={sections} total={total} inProgress={inProgress} />
      </section>
    </div>
  );
}
