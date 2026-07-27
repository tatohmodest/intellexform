import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { ArrowLeft, Bot, Clock } from 'lucide-react';
import { getSessionUser } from '@/lib/auth/getUser';
import { getProgress } from '@/lib/learn/repo';
import { getCatalogTrack } from '@/lib/learn/catalog';
import { getTutorial, getTutorialLessons } from '@/lib/tutorials';
import LessonBlocks from '@/components/tutorials/LessonBlocks';
import LessonActions from '@/components/dashboard/LessonActions';
import LessonCurriculum from '@/components/dashboard/LessonCurriculum';
import SubscribePanel from '@/components/content/SubscribePanel';
import { canAccessContent, getContentAccess, type LessonLevel } from '@/lib/contentAccess';

export const dynamic = 'force-dynamic';

export default async function LessonPlayerPage({
  params,
}: {
  params: { slug: string; lesson: string };
}) {
  const session = getSessionUser();
  if (!session) redirect(`/login?next=/dashboard/courses/${params.slug}/${params.lesson}`);

  const track = getCatalogTrack(params.slug);
  const course = getTutorial(params.slug);
  if (!track || !course) notFound();

  const lessons = getTutorialLessons(params.slug);
  const idx = lessons.findIndex((l) => l.slug === params.lesson);
  if (idx === -1) notFound();
  const lesson = lessons[idx];
  const prev = idx > 0 ? lessons[idx - 1] : null;
  const next = idx < lessons.length - 1 ? lessons[idx + 1] : null;

  const access = await getContentAccess('tutorial', params.slug, course.title);
  const gate = await canAccessContent({
    userId: session.uid,
    kind: 'tutorial',
    slug: params.slug,
    level: lesson.level as LessonLevel,
    config: access,
  });

  if (!gate.allowed) {
    return (
      <div className="mx-auto max-w-[640px] py-6">
        <Link
          href={`/dashboard/courses/${params.slug}`}
          className="mb-6 inline-flex items-center gap-1.5 text-[13.5px] font-semibold"
          style={{ color: 'var(--ink-soft)' }}
        >
          <ArrowLeft size={14} /> {track.shortTitle}
        </Link>
        <p className="mono mb-2 text-[11px] uppercase tracking-[0.14em]" style={{ color: 'var(--ink-soft)' }}>
          Locked · subscribe to continue
        </p>
        <h1 className="font-display text-[28px] leading-tight sm:text-[32px]">{course.title}</h1>
        <p className="mt-2 text-[15px]" style={{ color: 'var(--ink-soft)' }}>
          Admin set this track as payable. Unlock full access or the {lesson.level} level to keep learning.
        </p>
        <div className="mt-8">
          <SubscribePanel
            config={access}
            level={lesson.level as LessonLevel}
            returnPath={`/dashboard/courses/${params.slug}/${params.lesson}`}
            kind="tutorial"
            slug={params.slug}
          />
        </div>
      </div>
    );
  }

  const progress = await getProgress(session.uid, params.slug);
  const done = progress.map((p) => p.lessonSlug);
  const pct = lessons.length ? Math.round((done.length / lessons.length) * 100) : 0;

  return (
    <div className="mx-auto flex max-w-[1180px] flex-col lg:flex-row lg:gap-8">
      <LessonCurriculum
        course={course}
        trackSlug={track.slug}
        trackColor={track.color}
        trackTitle={track.shortTitle}
        activeSlug={params.lesson}
        activeTitle={lesson.title}
        doneSlugs={done}
        pct={pct}
        doneCount={done.length}
        totalLessons={lessons.length}
      />

      <article className="min-w-0 flex-1 pb-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <Link
            href={`/dashboard/courses/${params.slug}`}
            className="inline-flex items-center gap-1.5 text-[13.5px] font-semibold"
            style={{ color: 'var(--ink-soft)' }}
          >
            <ArrowLeft size={14} /> {track.shortTitle}
          </Link>
          <Link
            href={`/dashboard/tutor?topic=${encodeURIComponent(lesson.title)}`}
            className="flex items-center gap-1.5 rounded-full border px-4 py-2 text-[12.5px] font-semibold"
            style={{ borderColor: 'rgba(74,144,226,0.35)', color: 'var(--blue-ink)', background: 'var(--amber-soft)' }}
          >
            <Bot size={14} /> Ask AI
          </Link>
        </div>

        <div className="mono mb-2 flex flex-wrap items-center gap-3 text-[11px] uppercase tracking-[0.12em]" style={{ color: 'var(--ink-soft)' }}>
          <span>
            Lesson {idx + 1} of {lessons.length}
          </span>
          <span className="flex items-center gap-1">
            <Clock size={11} /> {lesson.minutes} min
          </span>
          <span className="rounded-full px-2 py-0.5" style={{ background: 'var(--paper-dim)' }}>
            {lesson.level}
          </span>
        </div>
        <h1 className="break-words font-display text-[26px] leading-tight sm:text-[32px]">{lesson.title}</h1>
        <p className="mt-2 text-[15px] leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
          {lesson.description}
        </p>

        <div className="mt-8 max-w-full overflow-x-auto">
          <LessonBlocks blocks={lesson.content} />
        </div>

        <LessonActions
          courseSlug={params.slug}
          lessonSlug={params.lesson}
          initiallyDone={done.includes(params.lesson)}
          prevHref={prev ? `/dashboard/courses/${params.slug}/${prev.slug}` : null}
          nextHref={next ? `/dashboard/courses/${params.slug}/${next.slug}` : null}
        />
      </article>
    </div>
  );
}
