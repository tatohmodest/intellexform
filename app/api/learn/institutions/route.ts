import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth/getUser';
import {
  listPublicInstitutions,
  myInstitutionSlugs,
  searchInstitutions,
} from '@/lib/learn/ecosystem';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const user = getSessionUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const q = req.nextUrl.searchParams.get('q') ?? '';
  const [institutions, mine] = await Promise.all([
    q.trim() ? searchInstitutions(q, 24) : listPublicInstitutions(),
    myInstitutionSlugs(user.uid),
  ]);
  return NextResponse.json({
    institutions,
    memberOf: Array.from(mine),
    query: q.trim() || null,
  });
}

/**
 * POST /api/learn/institutions - institutions are not self-created.
 * Direct partners to the Platform Team contact path.
 */
export async function POST() {
  const user = getSessionUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  return NextResponse.json(
    {
      error: 'institutions_not_self_serve',
      message:
        'Institutions are onboarded by the InTelleX Platform Team. Contact intellexplatform@gmail.com or WhatsApp +237 650 318 856.',
      contact: {
        email: 'intellexplatform@gmail.com',
        whatsapp: '+237 650 318 856',
        page: '/contact?type=institution',
      },
    },
    { status: 403 },
  );
}
