import { NextResponse } from 'next/server';
import { getAllCourses } from '@/lib/repo';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const courses = await getAllCourses();
    return NextResponse.json(courses);
  } catch (error) {
    console.error('Courses fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
