import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { getSessionUser } from '@/lib/auth/getUser';
import { getCourseBySlug, getDb } from '@/lib/repo';
import { canAccessContent, getContentAccess, type LessonLevel } from '@/lib/contentAccess';
import DriveCoursePlayerClient from '@/components/dashboard/DriveCoursePlayerClient';
import type { DriveLessonItem } from '@/components/dashboard/GoogleDriveCoursePlayer';
import { getCatalogTrack } from '@/lib/learn/catalog';
import { getProgress } from '@/lib/learn/repo';

export const dynamic = 'force-dynamic';

export default async function GoogleDrivePlayerPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams?: { link?: string; folder?: string };
}) {
  const session = getSessionUser();
  if (!session) redirect(`/login?next=/dashboard/drive-player/${params.slug}`);

  let course = await getCourseBySlug(params.slug);
  let lessons: DriveLessonItem[] = [];
  let driveFolderUrl: string | null =
    course?.googleDriveFolderUrl ||
    course?.courseLink ||
    searchParams?.link ||
    searchParams?.folder ||
    null;

  let title = course?.name || params.slug;

  if (!course) {
    const track = getCatalogTrack(params.slug);
    if (track) {
      title = track.title;
      driveFolderUrl =
        driveFolderUrl || (track as { courseLink?: string }).courseLink || null;
    }
  }

  if (course) {
    const access = await getContentAccess('course', params.slug, course.name);
    const gate = await canAccessContent({
      userId: session.uid,
      kind: 'course',
      slug: params.slug,
      level: 'beginner' as LessonLevel,
      config: access,
      courseOrigin: course.courseOrigin,
    });

    if (!gate.allowed) {
      redirect(`/courses/${params.slug}`);
    }
  }

  if (!course) {
    try {
      const db = await getDb();
      const doc = await db.collection('teacher_courses').findOne({
        $or: [{ slug: params.slug }, { id: params.slug }],
      });
      if (doc) {
        title = String(doc.title || doc.name || title);
        driveFolderUrl =
          driveFolderUrl ||
          (doc.googleDriveFolderUrl as string) ||
          (doc.googleDriveUrl as string) ||
          (doc.courseLink as string) ||
          null;
        if (Array.isArray(doc.lessons)) {
          lessons = doc.lessons.map((l: Record<string, unknown>, idx: number) => ({
            id: (l.id as string) || idx,
            slug: String(l.slug || l.id || idx),
            title: String(l.title || `Lesson ${idx + 1}`),
            videoUrl: (l.videoUrl as string) || null,
            googleDriveUrl:
              (l.googleDriveUrl as string) ||
              (l.videoUrl as string) ||
              driveFolderUrl ||
              null,
            durationMinutes: Number(l.durationMinutes) || 10,
            description: (l.notes as string) || null,
          }));
        }
      }
    } catch {
      /* ignore */
    }
  }

  if (title === params.slug) {
    title = params.slug
      .replace(/[-_]/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase());
  }

  if (lessons.length === 0) {
    lessons = [
      {
        id: 'drive-main',
        slug: 'drive-main',
        title: `${title} - Google Drive Folder`,
        googleDriveUrl: driveFolderUrl || 'https://drive.google.com',
        durationMinutes: 45,
        description: 'Explore and play all video lessons in this Google Drive folder.',
      },
    ];
  }

  const progress = await getProgress(session.uid, params.slug).catch(() => []);
  const done = new Set(progress.map((p) => p.lessonSlug));
  lessons = lessons.map((l) => ({
    ...l,
    completed: done.has(String(l.slug || l.id)),
  }));

  return (
    <div className="mx-auto max-w-[1240px] px-4 py-6 sm:px-6">
      <div className="mb-6 flex items-center justify-between">
        <Link
          href="/dashboard/courses"
          className="inline-flex items-center gap-2 text-sm font-semibold transition-colors hover:opacity-80"
          style={{ color: 'var(--ink-soft)' }}
        >
          <ArrowLeft size={16} /> Back to Courses
        </Link>
        <span className="rounded-full bg-emerald-100 px-3 py-1 font-mono text-[11px] font-semibold uppercase tracking-wider text-emerald-700">
          Course player
        </span>
      </div>

      <DriveCoursePlayerClient
        courseSlug={params.slug}
        courseTitle={title}
        lessons={lessons}
        googleDriveFolderUrl={driveFolderUrl}
      />
    </div>
  );
}
