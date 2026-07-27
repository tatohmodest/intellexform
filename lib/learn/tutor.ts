import { TUTORIALS, getTutorialLessons } from '@/lib/tutorials';
import type { ContentBlock, TutorialLesson } from '@/lib/tutorials/types';

/**
 * Intellex AI Tutor engine.
 *
 * With OPENAI_API_KEY set it proxies an OpenAI-compatible chat API, grounded
 * with the most relevant lessons from the Intellex curriculum (lightweight
 * retrieval). Without a key it falls back to a curriculum tutor that answers
 * directly from the platform's own lesson library.
 */

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface ScoredLesson {
  courseSlug: string;
  courseTitle: string;
  lesson: TutorialLesson;
  score: number;
}

const STOPWORDS = new Set(
  'a an and are as at be but by for from has have how i in is it its of on or that the this to was what when where which who why will with you your me my can do does'.split(' '),
);

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s.-]/g, ' ')
    .split(/\s+/)
    .filter((t) => t.length > 1 && !STOPWORDS.has(t));
}

function blockText(b: ContentBlock): string {
  switch (b.type) {
    case 'p':
    case 'h2':
    case 'h3':
    case 'note':
    case 'tip':
    case 'warning':
    case 'try':
      return b.text;
    case 'ul':
    case 'ol':
    case 'keypoints':
      return b.items.join(' ');
    case 'code':
      return b.title ?? '';
    case 'table':
      return b.headers.join(' ');
    default:
      return '';
  }
}

/** Rank curriculum lessons against the learner's question. */
export function findRelevantLessons(question: string, limit = 3): ScoredLesson[] {
  const terms = tokenize(question);
  if (terms.length === 0) return [];
  const results: ScoredLesson[] = [];
  for (const course of TUTORIALS) {
    const lessons = getTutorialLessons(course.slug);
    const courseTerms = tokenize(`${course.title} ${course.shortTitle} ${course.slug}`);
    const courseHit = terms.some((t) => courseTerms.includes(t));
    for (const lesson of lessons) {
      const titleTokens = tokenize(`${lesson.title} ${lesson.description}`);
      let score = 0;
      for (const t of terms) {
        if (titleTokens.includes(t)) score += 5;
        if (lesson.slug.includes(t)) score += 3;
      }
      if (courseHit) score += 1;
      if (score > 2) {
        // Body match as a tie-breaker (only scan when the lesson is a candidate).
        const body = lesson.content.map(blockText).join(' ').toLowerCase();
        for (const t of terms) if (body.includes(t)) score += 1;
        results.push({ courseSlug: course.slug, courseTitle: course.title, lesson, score });
      }
    }
  }
  return results.sort((a, b) => b.score - a.score).slice(0, limit);
}

function lessonExcerpt(lesson: TutorialLesson, maxChars = 1400): string {
  let out = '';
  for (const b of lesson.content) {
    if (b.type === 'code') {
      out += `\n\`\`\`${b.language ?? ''}\n${b.code}\n\`\`\`\n`;
    } else {
      const t = blockText(b);
      if (t) out += `${t}\n`;
    }
    if (out.length > maxChars) break;
  }
  return out.slice(0, maxChars);
}

// ── Fallback curriculum tutor (no API key required) ───────────────────────────

export function curriculumTutorAnswer(question: string): string {
  const matches = findRelevantLessons(question, 2);
  if (matches.length === 0) {
    return [
      "I couldn't find that topic in the Intellex curriculum yet, but let's work through it together. Try asking me about:",
      '',
      '- **Frontend** — HTML, CSS, JavaScript, Next.js',
      '- **Backend** — Node.js & Express, NestJS, Django, Flask, Go',
      '- **Databases** — PostgreSQL, MongoDB',
      '- **Data & more** — Python, Data Analysis, Docker, Flutter, Digital Marketing, Pygame',
      '',
      'Or rephrase your question with the technology name in it (e.g. "How do CSS grid columns work?").',
    ].join('\n');
  }

  const parts: string[] = [];
  const top = matches[0];
  parts.push(
    `Great question — this is covered in **${top.lesson.title}** (${top.courseTitle}, ${top.lesson.level}). Here's the core of it:\n`,
  );
  parts.push(lessonExcerpt(top.lesson));
  parts.push(
    `\n📖 Want the full walkthrough? Open the lesson: /dashboard/courses/${top.courseSlug}/${top.lesson.slug}`,
  );
  if (matches[1]) {
    const alt = matches[1];
    parts.push(
      `\nAlso related: **${alt.lesson.title}** — /dashboard/courses/${alt.courseSlug}/${alt.lesson.slug}`,
    );
  }
  parts.push(
    '\nAsk me a follow-up — "explain it simpler", "show me another example", or "quiz me on this".',
  );
  return parts.join('\n');
}

// ── OpenAI-backed tutor (streams when configured) ─────────────────────────────

export function isLLMConfigured(): boolean {
  return Boolean(process.env.OPENAI_API_KEY);
}

const SYSTEM_PROMPT = `You are the Intellex AI Tutor — a warm, world-class programming and tech mentor on the Intellex learning platform (built by LoopingBinary in Cameroon).

Rules:
- Teach step by step, one level at a time. Check understanding with a short question at the end.
- Prefer small runnable code examples with brief explanations.
- If the learner seems stuck, simplify; if they seem confident, go deeper.
- Keep answers focused (under ~350 words unless asked for more).
- When relevant curriculum lessons are provided as context, cite them with their /dashboard/courses/... link so the learner can study further.`;

export async function llmTutorStream(
  messages: ChatMessage[],
): Promise<ReadableStream<Uint8Array>> {
  const lastUser = [...messages].reverse().find((m) => m.role === 'user');
  const context = lastUser
    ? findRelevantLessons(lastUser.content, 2)
        .map(
          (m) =>
            `Lesson "${m.lesson.title}" (link: /dashboard/courses/${m.courseSlug}/${m.lesson.slug}):\n${lessonExcerpt(m.lesson, 900)}`,
        )
        .join('\n\n---\n\n')
    : '';

  const body = {
    model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
    stream: true,
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      ...(context
        ? [{ role: 'system' as const, content: `Relevant Intellex curriculum context:\n\n${context}` }]
        : []),
      ...messages.filter((m) => m.role !== 'system').slice(-12),
    ],
  };

  const res = await fetch(
    `${process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1'}/chat/completions`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify(body),
    },
  );
  if (!res.ok || !res.body) {
    const err = await res.text().catch(() => '');
    throw new Error(`LLM request failed (${res.status}): ${err.slice(0, 300)}`);
  }

  // Re-emit OpenAI SSE as a plain text token stream.
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();
  const reader = res.body.getReader();
  let buffer = '';
  return new ReadableStream<Uint8Array>({
    async pull(controller) {
      const { done, value } = await reader.read();
      if (done) {
        controller.close();
        return;
      }
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() ?? '';
      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed.startsWith('data:')) continue;
        const data = trimmed.slice(5).trim();
        if (data === '[DONE]') continue;
        try {
          const json = JSON.parse(data);
          const token = json.choices?.[0]?.delta?.content;
          if (token) controller.enqueue(encoder.encode(token));
        } catch {
          // Ignore malformed keep-alive chunks.
        }
      }
    },
    cancel() {
      reader.cancel().catch(() => {});
    },
  });
}
