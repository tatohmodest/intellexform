import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth/getUser';
import { getPortfolioSnapshot, updateCareerProfile } from '@/lib/learn/portfolio';

export const dynamic = 'force-dynamic';

export async function GET() {
  const session = getSessionUser();
  if (!session) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const portfolio = await getPortfolioSnapshot(session.uid);
  return NextResponse.json({ portfolio });
}

export async function POST(req: NextRequest) {
  const session = getSessionUser();
  if (!session) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const body = await req.json().catch(() => ({}));
  try {
    await updateCareerProfile(session.uid, {
      bio: typeof body.bio === 'string' ? body.bio : undefined,
      skills: Array.isArray(body.skills) ? body.skills.map(String) : undefined,
      goals: Array.isArray(body.goals) ? body.goals.map(String) : undefined,
      portfolioPublic:
        typeof body.portfolioPublic === 'boolean' ? body.portfolioPublic : undefined,
      portfolioSlug: typeof body.portfolioSlug === 'string' ? body.portfolioSlug : undefined,
    });
    const portfolio = await getPortfolioSnapshot(session.uid);
    return NextResponse.json({ ok: true, portfolio });
  } catch (err) {
    if (err instanceof Error && err.message === 'slug_taken') {
      return NextResponse.json({ error: 'slug_taken' }, { status: 409 });
    }
    console.error('portfolio update failed', err);
    return NextResponse.json({ error: 'db_unavailable' }, { status: 503 });
  }
}
