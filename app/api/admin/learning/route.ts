import { NextRequest, NextResponse } from 'next/server';
import { assertAdmin } from '@/lib/adminAuth';
import { getAdminLearningOverview } from '@/lib/learn/ecosystem';

export const dynamic = 'force-dynamic';

/**
 * GET /api/admin/learning — platform-wide learning overview for admins:
 * every collection with live counts, plus recent learners, enrollments,
 * mentorship bookings, published books and institutions.
 */
export async function GET(req: NextRequest) {
  if (!assertAdmin(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const overview = await getAdminLearningOverview();
    return NextResponse.json(overview);
  } catch (error) {
    console.error('Admin learning overview error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
