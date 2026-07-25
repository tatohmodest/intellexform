import { NextResponse } from 'next/server';
import { getAllCourses } from '@/lib/repo';
import { getTutorialSearchIndex } from '@/lib/tutorials/searchIndex';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const [allCourses, tutorials] = await Promise.all([
      getAllCourses(),
      Promise.resolve(getTutorialSearchIndex()),
    ]);

    const courses = allCourses.map((c) => ({
      slug: c.slug,
      name: c.name,
      type: c.type,
      shortDescription: c.shortDescription,
    }));

    return NextResponse.json(
      { courses, tutorials },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        },
      },
    );
  } catch (error) {
    console.error('Search index error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
