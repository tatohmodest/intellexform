import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth/getUser';
import { isLLMConfigured } from '@/lib/learn/tutor';

/**
 * Instructor AI - helps draft exam / assignment questions.
 */
export async function POST(req: NextRequest) {
  const session = getSessionUser();
  if (!session) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const topic = String(body.topic || '').trim();
  const kind = body.kind === 'assignment' ? 'assignment' : 'exam';
  const count = Math.min(Math.max(Number(body.count) || 5, 1), 12);
  if (!topic) return NextResponse.json({ error: 'topic_required' }, { status: 400 });

  const prompt =
    kind === 'exam'
      ? `Create ${count} exam questions on: "${topic}".
Return ONLY a JSON array of objects with keys:
type ("mcq"|"structural"), prompt, options (4 strings for mcq), correctIndex (0-3 for mcq), points, hint.
Mix MCQ and structural. Rigorous and fair.`
      : `Draft ${count} assignment tasks on: "${topic}".
Return ONLY a JSON array of objects with keys:
type ("structural"), prompt, points, hint (tip about submitting via Google Drive/Docs link).`;

  function scaffold() {
    return Array.from({ length: count }).map((_, i) =>
      kind === 'exam' && i % 2 === 0
        ? {
            type: 'mcq',
            prompt: `${topic}: which statement is most accurate? (Q${i + 1})`,
            options: [
              'Option A - incomplete',
              'Option B - best answer',
              'Option C - unrelated',
              'Option D - partially true',
            ],
            correctIndex: 1,
            points: 2,
            hint: 'Edit this scaffold to match your curriculum.',
          }
        : {
            type: 'structural',
            prompt: `Explain ${topic} in your own words and give one worked example. (Q${i + 1})`,
            points: 5,
            hint: 'Students should paste a Drive/Docs link with their write-up.',
          },
    );
  }

  if (!isLLMConfigured()) {
    return NextResponse.json({
      questions: scaffold(),
      source: 'scaffold',
      note: 'OpenAI key not configured - scaffold returned. Edit before publishing.',
    });
  }

  try {
    const res = await fetch(
      `${process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1'}/chat/completions`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
          temperature: 0.4,
          messages: [
            {
              role: 'system',
              content: 'You help InTelleX instructors write assessments. Output JSON only.',
            },
            { role: 'user', content: prompt },
          ],
        }),
      },
    );
    if (!res.ok) throw new Error(`openai_${res.status}`);
    const data = await res.json();
    const text = data.choices?.[0]?.message?.content || '';
    const start = text.indexOf('[');
    const end = text.lastIndexOf(']');
    const json = start >= 0 && end > start ? text.slice(start, end + 1) : text;
    const questions = JSON.parse(json);
    if (!Array.isArray(questions)) throw new Error('invalid_ai_shape');
    return NextResponse.json({ questions, source: 'ai' });
  } catch (err) {
    console.error('assessment AI assist', err);
    return NextResponse.json({
      questions: scaffold(),
      source: 'scaffold',
      note: 'AI failed - scaffold returned. Edit before publishing.',
    });
  }
}
