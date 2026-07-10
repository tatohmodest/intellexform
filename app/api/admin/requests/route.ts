import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/repo';
import { verifySessionToken, COOKIE_NAME } from '@/lib/adminAuth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (!token || !verifySessionToken(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const db = await getDb();
    const requests = await db
      .collection('requests')
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    const data = requests.map((r) => ({ ...r, _id: r._id.toString() }));
    return NextResponse.json(data);
  } catch (error) {
    console.error('Admin requests fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
