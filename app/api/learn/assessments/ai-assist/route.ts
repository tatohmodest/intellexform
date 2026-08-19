import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth/getUser';
import { isLLMConfigured } from '@/lib/learn/tutor';
import { openaiJsonCompletion, parseJsonObject } from '@/lib/learn/openaiJson';

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
      note: 'OPENAI_API_KEY not configured - scaffold returned. Edit before publishing.',
    });
  }

  try {
    const raw = await openaiJsonCompletion({
      temperature: 0.4,
      system: 'You help InTelleX instructors write assessments. JSON only: {"questions":[...]}.',
      user: prompt,
    });
    const parsed = parseJsonObject<{ questions?: unknown[] }>(raw);
    const questions = Array.isArray(parsed?.questions) ? parsed!.questions : null;
    if (!questions) throw new Error('invalid_ai_shape');
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
