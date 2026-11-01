import { NextRequest, NextResponse } from 'next/server';
import { renderToBuffer } from '@react-pdf/renderer';
import { getSessionUser } from '@/lib/auth/getUser';
import { getTeacherCourse } from '@/lib/learn/ecosystem';
import { getLearner } from '@/lib/learn/repo';
import CurriculumPdf from '@/lib/pdf/CurriculumPdf';
import { buildTeacherCourseCurriculum, buildTrackCurriculum } from '@/lib/pdf/curriculumBuild';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const maxDuration = 60;

/** GET ?track=<slug> or ?course=<id> - returns the curriculum as a branded PDF. */
export async function GET(req: NextRequest) {
  const session = getSessionUser();
  if (!session) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const learner = await getLearner(session.uid).catch(() => null);
  const preparedFor = learner?.name || session.name || undefined;
  const sp = req.nextUrl.searchParams;
  const trackSlug = sp.get('track');
  const courseId = sp.get('course');

  let doc = null;
  if (trackSlug) {
    doc = buildTrackCurriculum(trackSlug, preparedFor);
  } else if (courseId) {
    const course = await getTeacherCourse(courseId);
    if (course) {
      const isTeacher = course.authorId === session.uid || course.instructorId === session.uid;
      if (course.published || isTeacher) doc = buildTeacherCourseCurriculum(course, preparedFor);
    }
  }
  if (!doc) return NextResponse.json({ error: 'not_found' }, { status: 404 });

  try {
    const buffer = await renderToBuffer(CurriculumPdf({ doc }));
    const file =
      doc.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60) || 'course';
    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${file}-curriculum.pdf"`,
        'Cache-Control': 'private, no-store',
      },
    });
  } catch (err) {
    console.error('curriculum pdf:', err);
    return NextResponse.json({ error: 'pdf_failed' }, { status: 500 });
  }
}
