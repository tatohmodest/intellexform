import { NextRequest, NextResponse } from 'next/server';
import { getAllCoursesAdmin, createCourseDoc, getCourseBySlug } from '@/lib/repo';
import { verifySessionToken, COOKIE_NAME } from '@/lib/adminAuth';
import { normalizeCoursePayload, slugify } from '@/lib/courseForm';
import { Course } from '@/lib/types';

export const dynamic = 'force-dynamic';

function authed(req: NextRequest) {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  return Boolean(token && verifySessionToken(token));
}

export async function GET(req: NextRequest) {
  if (!authed(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const courses = await getAllCoursesAdmin();
    return NextResponse.json(courses);
  } catch (error) {
    console.error('Admin courses list error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!authed(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const body = await req.json();
    const patch = normalizeCoursePayload(body);
    if (!patch.name) return NextResponse.json({ error: 'Name is required' }, { status: 400 });

    const slug = body.slug ? slugify(String(body.slug)) : slugify(patch.name);
    if (await getCourseBySlug(slug)) {
      return NextResponse.json({ error: 'A course with this slug already exists' }, { status: 409 });
    }

    const course = {
      id: `custom-${Date.now()}`,
      slug,
      instructor: '',
      courseDetails: '',
      prerequisites: '',
      whatYouWillLearn: [],
      type: 'Development',
      originalPrice: 0,
      currentPrice: 0,
      aboutInstructor: '',
      courseRating: 0,
      courseNumberOfVotes: 0,
      courseOrigin: 'Intellex',
      courseDuration: '',
      language: 'English',
      bestSeller: false,
      shortDescription: '',
      courseImage: '',
      certificateOfCompletion: true,
      accessOnMobileAndTV: true,
      downloadable: true,
      articleType: 'Video',
      instructorRating: null,
      courseLink: null,
      featured: false,
      createdAt: new Date().toISOString(),
      ...patch,
    } as Course;

    const id = await createCourseDoc(course);
    return NextResponse.json({ success: true, id, slug }, { status: 201 });
  } catch (error) {
    console.error('Admin course create error:', error);
    return NextResponse.json({ error: 'Could not create course' }, { status: 500 });
  }
}
