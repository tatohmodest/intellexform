import { NextRequest, NextResponse } from 'next/server';
import { assertAdmin } from '@/lib/adminAuth';
import { TUTORIALS } from '@/lib/tutorials';
import {
  defaultAccessConfig,
  listContentAccess,
  upsertContentAccess,
  type ContentAccessConfig,
  type PricingMode,
} from '@/lib/contentAccess';
import { getAllCoursesAdmin } from '@/lib/repo';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  if (!assertAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const saved = await listContentAccess();
    const byKey = new Map(saved.map((c) => [`${c.kind}:${c.slug}`, c]));

    const tutorials = TUTORIALS.map((t) => {
      const key = `tutorial:${t.slug}`;
      return byKey.get(key) ?? defaultAccessConfig('tutorial', t.slug, t.title);
    });

    let courses: ContentAccessConfig[] = [];
    try {
      const mongoCourses = await getAllCoursesAdmin();
      courses = mongoCourses.map((c) => {
        const slug = String(c.slug || c.id);
        const key = `course:${slug}`;
        const existing = byKey.get(key);
        if (existing) return existing;
        const base = defaultAccessConfig('course', slug, c.name);
        // Seed from catalogue price when unset
        if ((c.currentPrice ?? 0) > 0) {
          return {
            ...base,
            mode: 'one_time' as PricingMode,
            oneTimePriceXAF: c.currentPrice,
            certificateGuarantee: Boolean(c.certificateOfCompletion),
          };
        }
        return base;
      });
    } catch {
      courses = [];
    }

    return NextResponse.json({ tutorials, courses });
  } catch (error) {
    console.error('Admin content GET', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  if (!assertAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const body = await req.json();
    const mode = body.mode as PricingMode;
    if (!['free', 'one_time', 'per_level'].includes(mode)) {
      return NextResponse.json({ error: 'Invalid mode' }, { status: 400 });
    }
    if (!body.slug || !body.kind) {
      return NextResponse.json({ error: 'kind and slug required' }, { status: 400 });
    }

    const saved = await upsertContentAccess({
      kind: body.kind,
      slug: String(body.slug),
      title: String(body.title || body.slug),
      mode,
      oneTimePriceXAF: Number(body.oneTimePriceXAF) || 0,
      levelPrices: {
        beginner: Number(body.levelPrices?.beginner) || 0,
        intermediate: Number(body.levelPrices?.intermediate) || 0,
        advanced: Number(body.levelPrices?.advanced) || 0,
      },
      pricingNote: body.pricingNote ? String(body.pricingNote) : undefined,
      certificateGuarantee: Boolean(body.certificateGuarantee),
      updatedBy: 'admin',
    });

    return NextResponse.json(saved);
  } catch (error) {
    console.error('Admin content PUT', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
