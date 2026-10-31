import { NextRequest, NextResponse } from 'next/server';
import { isLocale, LOCALE_COOKIE, type Locale } from '@/lib/i18n/locale';
import {
  fallbackOrientationAnswer,
  orientationStream,
  type OrientationMessage,
} from '@/lib/orientation';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

/** Best-effort per-IP limit so the public endpoint can't be used as a free LLM proxy. */
const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 30;
const hits = new Map<string, { count: number; reset: number }>();

function limited(ip: string) {
  const now = Date.now();
  const entry = hits.get(ip);
  if (!entry || entry.reset < now) {
    hits.set(ip, { count: 1, reset: now + WINDOW_MS });
    if (hits.size > 5000) hits.clear();
    return false;
  }
  entry.count += 1;
  return entry.count > MAX_REQUESTS;
}

/**
 * POST /api/orientation  { messages: [{role, content}, ...] }
 * Public (no login) orientation advisor. Streams the reply as plain text.
 */
export async function POST(req: NextRequest) {
  const ip = req.headers.get('cf-connecting-ip') || req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'anon';
  if (limited(ip)) {
    const fr = req.cookies.get(LOCALE_COOKIE)?.value === 'fr';
    return NextResponse.json(
      {
        error: fr
          ? 'Trop de messages. Veuillez réessayer dans quelques minutes.'
          : 'Too many messages. Please try again in a few minutes.',
      },
      { status: 429 },
    );
  }

  const body = await req.json().catch(() => ({}));
  const messages: OrientationMessage[] = Array.isArray(body.messages)
    ? body.messages
        .filter(
          (m: OrientationMessage) =>
            (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string' && m.content.trim(),
        )
        .slice(-12)
        .map((m: OrientationMessage) => ({ role: m.role, content: m.content.slice(0, 2000) }))
    : [];
  if (!messages.some((m) => m.role === 'user')) {
    return NextResponse.json({ error: 'empty' }, { status: 400 });
  }
  const cookieLocale = req.cookies.get(LOCALE_COOKIE)?.value;
  const locale: Locale = isLocale(body.locale) ? body.locale : isLocale(cookieLocale) ? cookieLocale : 'en';

  if (process.env.OPENAI_API_KEY) {
    try {
      const stream = await orientationStream(messages, locale);
      return new Response(stream, {
        headers: { 'Content-Type': 'text/plain; charset=utf-8', 'X-Orientation-Engine': 'llm' },
      });
    } catch (err) {
      console.error('Orientation LLM failed, using fallback:', err);
    }
  }

  return new Response(fallbackOrientationAnswer(messages, locale), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8', 'X-Orientation-Engine': 'fallback' },
  });
}
