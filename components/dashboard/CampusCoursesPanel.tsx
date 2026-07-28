'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Award, Clock, Play, Radio, Users, Video } from 'lucide-react';
import { courseDurationHours, type TeacherCourseView } from '@/lib/learn/courseTypes';
import { toEmbedUrl, isDirectVideo } from '@/lib/learn/videoEmbed';

export default function CampusCoursesPanel({
  slug,
  accent,
  isStaff,
  digitalLearning,
}: {
  slug: string;
  accent: string;
  isStaff: boolean;
  digitalLearning: boolean;
}) {
  const [courses, setCourses] = useState<TeacherCourseView[]>([]);
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/learn/teacher-courses?campus=${encodeURIComponent(slug)}`)
      .then((r) => r.json())
      .then((d) => setCourses((d.courses || []).filter((c: TeacherCourseView) => c.published || isStaff)))
      .catch(() => setCourses([]));
  }, [slug, isStaff]);

  const open = courses.find((c) => c.id === openId) || null;

  return (
    <section>
      <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-[24px]">
            {isStaff ? 'Campus courses' : 'Your courses'}
          </h2>
          <p className="mt-1 max-w-lg text-[14px] leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
            {isStaff
              ? 'Record lessons, host them on Google Drive (public or private link), set visibility, and publish for students. Same Course Studio InTelleX tutors use.'
              : 'Video courses published by instructors on this campus.'}
          </p>
        </div>
        {isStaff && (
          <Link
            href={`/dashboard/teach/courses?campus=${encodeURIComponent(slug)}`}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-[13px] font-semibold text-white"
            style={{ background: accent }}
          >
            <Video size={15} /> Open Course Studio
          </Link>
        )}
      </div>

      {!digitalLearning && isStaff && (
        <p className="mb-4 text-[13px]" style={{ color: 'var(--ink-soft)' }}>
          Tip: Digital Learning unlocks the full campus learning module. Course Studio still works
          for Core instructors to publish Drive-backed lessons.
        </p>
      )}

      {courses.length === 0 ? (
        <div className="border border-dashed py-10 text-center" style={{ borderColor: 'var(--line)' }}>
          <p className="text-[14px]" style={{ color: 'var(--ink-soft)' }}>
            {isStaff ? 'No courses yet - open Course Studio to create one.' : 'No published courses yet.'}
          </p>
        </div>
      ) : (
        <ul className="divide-y" style={{ borderColor: 'var(--line)' }}>
          {courses.map((c) => (
            <li key={c.id} className="py-4">
              <button
                type="button"
                onClick={() => setOpenId(openId === c.id ? null : c.id)}
                className="flex w-full items-start gap-4 text-left"
              >
                {c.coverUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={c.coverUrl}
                    alt=""
                    className="hidden h-[72px] w-[128px] shrink-0 object-cover sm:block"
                  />
                ) : (
                  <span
                    className="hidden h-[72px] w-[128px] shrink-0 items-center justify-center sm:flex"
                    style={{ background: `${accent}14`, color: accent }}
                  >
                    <Video size={18} />
                  </span>
                )}
                <div className="min-w-0 flex-1">
                  <div className="text-[16px] font-semibold">{c.title}</div>
                  <div className="mt-1 text-[13px]" style={{ color: 'var(--ink-soft)' }}>
                    {c.instructorName || c.authorName} · {c.lessons?.length || 0} lessons
                    {!c.published ? ' · draft' : ''}
                  </div>
                  <div
                    className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[10px] uppercase tracking-[0.12em]"
                    style={{ color: 'var(--ink-soft)' }}
                  >
                    {c.deliveryMode === 'live' || c.deliveryMode === 'hybrid' ? (
                      <span className="inline-flex items-center gap-1">
                        <Radio size={10} /> Live sessions
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1">
                        <Video size={10} /> Self-paced
                      </span>
                    )}
                    {courseDurationHours(c) > 0 && (
                      <span className="inline-flex items-center gap-1">
                        <Clock size={10} /> {courseDurationHours(c)}h
                      </span>
                    )}
                    {c.level && c.level !== 'all' && <span>{c.level}</span>}
                    {c.certificate && (
                      <span className="inline-flex items-center gap-1">
                        <Award size={10} /> Certificate
                      </span>
                    )}
                    {typeof c.seats === 'number' && c.seats > 0 && (
                      <span className="inline-flex items-center gap-1">
                        <Users size={10} /> {c.seats} seats
                      </span>
                    )}
                    <span style={{ color: c.priceXAF ? 'var(--ink)' : 'inherit' }}>
                      {c.priceXAF ? `${c.priceXAF.toLocaleString()} XAF` : 'Free'}
                    </span>
                  </div>
                  {c.description ? (
                    <p className="mt-2 line-clamp-2 text-[13.5px]" style={{ color: 'var(--ink-soft)' }}>
                      {c.description}
                    </p>
                  ) : null}
                </div>
                <span className="inline-flex shrink-0 items-center gap-1 text-[12.5px] font-semibold" style={{ color: accent }}>
                  <Play size={13} /> {openId === c.id ? 'Close' : 'Watch'}
                </span>
              </button>

              {open?.id === c.id && (
                <div className="mt-4 space-y-5">
                  {(c.lessons || []).map((lesson) => {
                    const embed = toEmbedUrl(lesson.videoUrl, lesson.videoProvider);
                    const direct = isDirectVideo(lesson.videoUrl, lesson.videoProvider);
                    return (
                      <div key={lesson.id}>
                        <div className="mb-2 text-[14px] font-semibold">{lesson.title}</div>
                        <div className="overflow-hidden" style={{ background: '#0C1116' }}>
                          {direct ? (
                            // eslint-disable-next-line jsx-a11y/media-has-caption
                            <video src={embed} controls className="aspect-video w-full" />
                          ) : (
                            <iframe
                              title={lesson.title}
                              src={embed}
                              className="aspect-video w-full"
                              allow="autoplay; encrypted-media"
                              allowFullScreen
                            />
                          )}
                        </div>
                        {lesson.notes ? (
                          <p className="mt-2 text-[13px]" style={{ color: 'var(--ink-soft)' }}>
                            {lesson.notes}
                          </p>
                        ) : null}
                      </div>
                    );
                  })}
                  {isStaff && (
                    <Link
                      href={`/dashboard/teach/courses?campus=${encodeURIComponent(slug)}`}
                      className="text-[13px] font-semibold"
                      style={{ color: accent }}
                    >
                      Edit in Course Studio →
                    </Link>
                  )}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
