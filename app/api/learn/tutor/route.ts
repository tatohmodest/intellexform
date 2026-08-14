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
  let messages: ChatMessage[] = Array.isArray(body.messages)
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

  const context = body.context as
    | { courseTitle?: string; lessonTitle?: string; courseKey?: string; lessonKey?: string }
    | undefined;
  if (context?.courseTitle || context?.lessonTitle) {
    const ctxLine = `[In-course context: course "${context.courseTitle || ''}" · lesson "${context.lessonTitle || ''}"${context.courseKey ? ` · key ${context.courseKey}` : ''}${context.lessonKey ? ` · lessonKey ${context.lessonKey}` : ''}. Stay focused on this lesson unless the learner asks to broaden.]`;
    messages = [
      { role: 'system', content: ctxLine },
      ...messages.filter((m) => m.role !== 'system'),
    ];
  }

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

  const questionWithContext = context?.lessonTitle
    ? `${lastUser.content}\n\n(Context: studying ${context.courseTitle || 'course'} / ${context.lessonTitle})`
    : lastUser.content;
  const catalogueHits = await findRelevantCatalogueCourses(questionWithContext, 4);
  const answer = interactiveTutorAnswer(
    context?.lessonTitle
      ? [...messages.filter((m) => m.role !== 'system'), { role: 'user', content: questionWithContext }]
      : messages,
    catalogueHits,
  );
  return new Response(answer, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'X-Tutor-Engine': 'interactive',
    },
  });
}
