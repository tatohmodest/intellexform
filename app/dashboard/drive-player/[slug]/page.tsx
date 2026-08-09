import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { getSessionUser } from '@/lib/auth/getUser';
import { getCourseBySlug, getDb } from '@/lib/repo';
import { canAccessContent, getContentAccess, type LessonLevel } from '@/lib/contentAccess';
import GoogleDriveCoursePlayer, { type DriveLessonItem } from '@/components/dashboard/GoogleDriveCoursePlayer';

export const dynamic = 'force-dynamic';

import { getCatalogTrack } from '@/lib/learn/catalog';

export default async function GoogleDrivePlayerPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams?: { link?: string; folder?: string };
}) {
  const session = getSessionUser();
  if (!session) redirect(`/login?next=/dashboard/drive-player/${params.slug}`);

  // 1. Try fetching from Mongo catalogue courses first
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
      driveFolderUrl = driveFolderUrl || track.courseLink || null;
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

  // 2. Try fetching from teacher_courses collection if not catalogue
  if (!course) {
    try {
      const db = await getDb();
      const doc = await db.collection('teacher_courses').findOne({
        $or: [{ slug: params.slug }, { id: params.slug }, { _id: params.slug as any }],
      });
      if (doc) {
        title = String(doc.title || doc.name || title);
        driveFolderUrl = driveFolderUrl || doc.googleDriveFolderUrl || doc.googleDriveUrl || doc.courseLink || null;
        if (Array.isArray(doc.lessons)) {
          lessons = doc.lessons.map((l: any, idx: number) => ({
            id: l.id || idx,
            title: String(l.title || `Lesson ${idx + 1}`),
            videoUrl: l.videoUrl || null,
            googleDriveUrl: l.googleDriveUrl || l.videoUrl || driveFolderUrl || null,
            durationMinutes: Number(l.durationMinutes) || 10,
            description: l.notes || null,
          }));
        }
      }
    } catch {
      // Fallback ignore
    }
  }

  // Ensure title is human readable
  if (title === params.slug) {
    title = params.slug
      .replace(/[-_]/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase());
  }

  // Fallback default lesson if lessons array is empty
  if (lessons.length === 0) {
    lessons = [
      {
        id: 'drive-main',
        title: `${title} - Google Drive Folder`,
        googleDriveUrl: driveFolderUrl || 'https://drive.google.com',
        durationMinutes: 45,
        description: 'Explore and play all video lessons in this Google Drive folder.',
      },
    ];
  }

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
        <span className="rounded-full px-3 py-1 font-mono text-[11px] font-semibold uppercase tracking-wider text-emerald-700 bg-emerald-100">
          InTelleX Drive Player
        </span>
      </div>

      <GoogleDriveCoursePlayer
        courseTitle={title}
        lessons={lessons}
        googleDriveFolderUrl={driveFolderUrl}
      />
    </div>
  );
}
