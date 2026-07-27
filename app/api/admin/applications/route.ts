import { NextRequest, NextResponse } from 'next/server';
import { verifySessionToken, COOKIE_NAME } from '@/lib/adminAuth';
import { getDb } from '@/lib/repo';

export const dynamic = 'force-dynamic';

/**
 * GET /api/admin/applications — pending institution & mentor applications.
 * Platform review queue for the governance workflow.
 */
export async function GET(req: NextRequest) {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (!token || !verifySessionToken(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const db = await getDb();
    const [institutions, mentors] = await Promise.all([
      db
        .collection('institution_applications')
        .find({})
        .sort({ createdAt: -1 })
        .limit(100)
        .toArray(),
      db
        .collection('mentor_applications')
        .find({})
        .sort({ createdAt: -1 })
        .limit(100)
        .toArray(),
    ]);

    return NextResponse.json({
      institutions: institutions.map((d) => {
        const { _id, ...rest } = d;
        return { id: _id.toString(), ...rest };
      }),
      mentors: mentors.map((d) => {
        const { _id, ...rest } = d;
        return { id: _id.toString(), ...rest };
      }),
    });
  } catch (err) {
    console.error('admin applications failed:', err);
    return NextResponse.json({ error: 'db_unavailable' }, { status: 503 });
  }
}
