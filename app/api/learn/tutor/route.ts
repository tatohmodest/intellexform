import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth/getUser';
import {
  findRelevantCatalogueCourses,
  interactiveTutorAnswer,
  isLLMConfigured,
  llmTutorStream,
  type ChatMessage,
} from '@/lib/learn/tutor';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

/**
 * POST /api/learn/tutor  { messages: [{role, content}, ...] }
 * Streams InTelleX AI's reply as plain text.
 */
export async function POST(req: NextRequest) {
  const user = getSessionUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const messages: ChatMessage[] = Array.isArray(body.messages)
    ? body.messages
        .filter(
          (m: ChatMessage) =>
            (m.role === 'user' || m.role === 'assistant') &&
            typeof m.content === 'string',
        )
        .map((m: ChatMessage) => ({ role: m.role, content: m.content.slice(0, 8000) }))
    : [];
  const lastUser = [...messages].reverse().find((m) => m.role === 'user');
  if (!lastUser) return NextResponse.json({ error: 'empty' }, { status: 400 });

  if (isLLMConfigured()) {
    try {
      const stream = await llmTutorStream(messages);
      return new Response(stream, {
        headers: { 'Content-Type': 'text/plain; charset=utf-8', 'X-Tutor-Engine': 'llm' },
      });
    } catch (err) {
      console.error('LLM tutor failed, falling back to interactive InTelleX AI:', err);
    }
  }

  const catalogueHits = await findRelevantCatalogueCourses(lastUser.content, 4);
  const answer = interactiveTutorAnswer(messages, catalogueHits);
  return new Response(answer, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'X-Tutor-Engine': 'interactive',
    },
  });
}
