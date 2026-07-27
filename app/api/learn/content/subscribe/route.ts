import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth/getUser';
import {
  getContentAccess,
  priceForScope,
  recordContentPurchase,
  type LessonLevel,
} from '@/lib/contentAccess';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const session = getSessionUser();
  if (!session) return NextResponse.json({ error: 'Login required' }, { status: 401 });

  try {
    const body = await req.json();
    const kind = body.kind === 'course' ? 'course' : 'tutorial';
    const slug = String(body.slug || '');
    const scope = body.scope as 'full' | LessonLevel;
    if (!slug) return NextResponse.json({ error: 'slug required' }, { status: 400 });
    if (!['full', 'beginner', 'intermediate', 'advanced'].includes(scope)) {
      return NextResponse.json({ error: 'Invalid scope' }, { status: 400 });
    }

    const config = await getContentAccess(kind, slug);
    if (config.mode === 'free') {
      return NextResponse.json({ ok: true, alreadyFree: true });
    }

    if (config.mode === 'one_time' && scope !== 'full') {
      return NextResponse.json({ error: 'This track only offers full unlock' }, { status: 400 });
    }

    const priceXAF = priceForScope(config, scope);
    await recordContentPurchase({
      userId: session.uid,
      kind,
      slug,
      scope,
      priceXAF,
    });

    return NextResponse.json({ ok: true, scope, priceXAF });
  } catch (error) {
    console.error('content subscribe', error);
    return NextResponse.json({ error: 'Subscribe failed' }, { status: 500 });
  }
}
