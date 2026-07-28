import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { ArrowLeft, Bot, CheckCircle2, Circle, Clock } from 'lucide-react';
import { getSessionUser } from '@/lib/auth/getUser';
import { getProgress } from '@/lib/learn/repo';
import { getCatalogTrack } from '@/lib/learn/catalog';
import { getTutorial, getTutorialLessons } from '@/lib/tutorials';
import LessonBlocks from '@/components/tutorials/LessonBlocks';
import LessonActions from '@/components/dashboard/LessonActions';
import TrackLogo from '@/components/TrackLogo';
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
          {gate.reason === 'cert_required'
            ? 'Locked · subscribe to get certified'
            : 'Locked · subscribe to continue'}
        </p>
        <h1 className="font-display text-[28px] leading-tight sm:text-[32px]">{lesson.title}</h1>
        <p className="mt-2 text-[15px]" style={{ color: 'var(--ink-soft)' }}>
          {gate.reason === 'cert_required'
            ? 'Beginner is free. Intermediate through Pro unlock with a certification subscription (4,999 XAF/month, or yearly with 10% off).'
            : `Admin set this track as payable. Unlock full access or the ${lesson.level} level to keep learning.`}
        </p>
        <div className="mt-8">
          <SubscribePanel
            config={access}
            level={lesson.level as LessonLevel}
            returnPath={`/dashboard/courses/${params.slug}/${params.lesson}`}
            kind="tutorial"
            slug={params.slug}
            gateReason={gate.reason === 'cert_required' ? 'cert_required' : 'subscribe_required'}
          />
        </div>
      </div>
    );
  }

  const progress = await getProgress(session.uid, params.slug);
  const done = new Set(progress.map((p) => p.lessonSlug));
  const pct = lessons.length ? Math.round((done.size / lessons.length) * 100) : 0;

  return (
    <div className="mx-auto flex max-w-[1180px] gap-8">
      <aside className="sticky top-[88px] hidden max-h-[calc(100vh-110px)] w-[290px] shrink-0 overflow-y-auto rounded-2xl border xl:block" style={{ borderColor: 'var(--line)' }}>
        <div className="border-b p-4" style={{ borderColor: 'var(--line)' }}>
          <Link href={`/dashboard/courses/${params.slug}`} className="flex items-center gap-2.5">
            <TrackLogo slug={track.slug} color={track.color} size={36} className="rounded-lg" />
            <div className="min-w-0">
              <div className="truncate text-[13.5px] font-semibold">{track.shortTitle}</div>
              <div className="text-[11.5px]" style={{ color: 'var(--ink-soft)' }}>
                {pct}% · {done.size}/{lessons.length} lessons
              </div>
            </div>
          </Link>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full" style={{ background: 'var(--paper-dim)' }}>
            <div
              className="h-full rounded-full"
              style={{ width: `${Math.max(pct, 2)}%`, background: 'var(--green)' }}
            />
          </div>
        </div>
        <div className="p-2">
          {course.sections.map((section) => (
            <div key={section.id} className="mb-1">
              <div className="mono px-3 pb-1 pt-3 text-[10px] uppercase tracking-[0.14em]" style={{ color: 'var(--ink-soft)' }}>
                {section.title}
              </div>
              {section.lessons.map((l) => {
                const active = l.slug === params.lesson;
                const isDone = done.has(l.slug);
                return (
                  <Link
                    key={l.slug}
                    href={`/dashboard/courses/${params.slug}/${l.slug}`}
                    className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px]"
                    style={
                      active
                        ? { background: 'rgba(0,179,105,0.1)', color: 'var(--green-deep)', fontWeight: 600 }
                        : { color: isDone ? 'var(--ink-soft)' : 'var(--ink)' }
                    }
                  >
                    {isDone ? (
                      <CheckCircle2 size={14} style={{ color: 'var(--green)' }} className="shrink-0" />
                    ) : (
                      <Circle size={14} style={{ color: 'var(--line)' }} className="shrink-0" />
                    )}
                    <span className="truncate">{l.title}</span>
                  </Link>
                );
              })}
            </div>
          ))}
        </div>
      </aside>

      <article className="min-w-0 flex-1">
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
            <Bot size={14} /> Ask AI about this lesson
          </Link>
        </div>

        <div className="mono mb-2 flex items-center gap-3 text-[11px] uppercase tracking-[0.12em]" style={{ color: 'var(--ink-soft)' }}>
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
        <h1 className="font-display text-[28px] leading-tight sm:text-[32px]">{lesson.title}</h1>
        <p className="mt-2 text-[15px] leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
          {lesson.description}
        </p>

        <div className="mt-8">
          <LessonBlocks blocks={lesson.content} />
        </div>

        <LessonActions
          courseSlug={params.slug}
          lessonSlug={params.lesson}
          initiallyDone={done.has(params.lesson)}
          prevHref={prev ? `/dashboard/courses/${params.slug}/${prev.slug}` : null}
          nextHref={next ? `/dashboard/courses/${params.slug}/${next.slug}` : null}
        />
      </article>
    </div>
  );
}
