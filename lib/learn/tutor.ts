import { TUTORIALS, getTutorialLessons } from '@/lib/tutorials';
import type { ContentBlock, TutorialLesson } from '@/lib/tutorials/types';
import { getAllCourses } from '@/lib/repo';
import type { Course } from '@/lib/types';
import { GOLDEN_RULE } from '@/lib/eduos/governance';

/**
 * InTelleX AI Tutor engine.
 *
 * Grounded in:
 * 1) Free tutorial curriculum (lib/tutorials)
 * 2) Monetized Mongo course catalogue (home /courses)
 * 3) Platform / EduOS knowledge (federated network, governance)
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
  'a an and are as at be but by for from has have how i in is it its of on or that the the this to was what when where which who why will with you your me my can do does'.split(' '),
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
    const courseTerms = tokenize(`${course.title} ${course.shortTitle} ${course.slug} ${course.description}`);
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

function scoreCourse(question: string, course: Course): number {
  const terms = tokenize(question);
  if (!terms.length) return 0;
  const hay = tokenize(
    [
      course.name,
      course.slug,
      course.type,
      course.shortDescription,
      course.courseDetails,
      ...(course.whatYouWillLearn || []),
      course.instructor || '',
    ]
      .filter(Boolean)
      .join(' '),
  );
  let score = 0;
  for (const t of terms) {
    if (hay.includes(t)) score += 3;
    if (course.slug.toLowerCase().includes(t)) score += 2;
  }
  return score;
}

export async function findRelevantCatalogueCourses(question: string, limit = 4): Promise<Course[]> {
  try {
    const all = await getAllCourses();
    return all
      .map((c) => ({ c, score: scoreCourse(question, c) }))
      .filter((x) => x.score > 2)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map((x) => x.c);
  } catch {
    return [];
  }
}

/** Compact catalogue summary for system context (Mongo home courses). */
export async function buildCatalogueDigest(limit = 40): Promise<string> {
  try {
    const all = await getAllCourses();
    const featured = all.filter((c) => c.featured || c.bestSeller).slice(0, limit);
    const pool = featured.length ? featured : all.slice(0, limit);
    return pool
      .map(
        (c) =>
          `- ${c.name} (${c.type || 'Course'}${c.selfPaced ? ', self-paced' : ''}) → /courses/${c.slug}`,
      )
      .join('\n');
  } catch {
    return '(catalogue temporarily unavailable)';
  }
}

const PLATFORM_KNOWLEDGE = `
You are the official InTelleX AI Tutor on the InTelleX Education Operating System (built by Looping Binary in Douala, Cameroon).

About InTelleX:
- InTelleX is an Education Cloud / federated education network — not just an LMS.
- Layer 1 (Core): identity, institution registry, verification, applications, API gateway, marketplace, AI routing.
- Layer 2 (Institutions): each campus owns its academic data (courses, grades, students). Schools connect to the network; they do not dump all records into one mega-database.
- Golden rule: ${GOLDEN_RULE}
- Institutions are not self-created — applicants submit an application; Platform Owner/Admin reviews and provisions.
- Mentors and instructors apply and are approved — privileges are earned.
- Learners have one global InTelleX identity across campuses.
- Ways to learn: self-paced courses (Mongo catalogue + certificates), live mentorship, free tutorials (/tutorials), and this AI Tutor.
- Ecosystem: certifications, internships (Looping Binary), Junior Dev tournaments, books, free resources, learning environment, federated institution network (/network).
- Pricing (self-paced access): Monthly ~1,999 XAF, Yearly ~22,560 XAF, or single courses from ~4,999 XAF. MTN MoMo and Orange Money supported.
- Free tutorials cover tracks like HTML, CSS, JavaScript, Next.js, Python, Go, C++, Java, Rust, Rails, Docker, Kubernetes, Linux, Bash, Arduino, Flutter, Django, Flask, NestJS, Node/Express, PostgreSQL, MongoDB, Data Analysis, Digital Marketing, Pygame, Computer Architecture.

When learners ask "what is InTelleX", "how do institutions work", "how do I become a mentor", or "what courses do you have", answer from this knowledge and cite catalogue / tutorial links.
`.trim();

export function curriculumTutorAnswer(
  question: string,
  catalogueHits: Course[] = [],
): string {
  const q = question.toLowerCase();
  const aboutPlatform =
    /intellex|institution|campus|federat|mentor apply|become a mentor|platform|ecosystem|network|eduos|governance|how does (this|intellex) work/.test(
      q,
    );

  if (aboutPlatform) {
    return [
      '**InTelleX** is an Education Operating System — a federated network for schools, academies, and learners.',
      '',
      '- **You** get one global identity, self-paced courses, live mentors, free tutorials, and this AI Tutor.',
      '- **Institutions** apply to join; after approval InTelleX provisions their campus. They own their academic data.',
      '- **Mentors / instructors** apply and are reviewed — teaching is a privilege, not a toggle.',
      '',
      `Golden rule: ${GOLDEN_RULE}`,
      '',
      'Explore:',
      '- Catalogue: /courses',
      '- Free tutorials: /tutorials',
      '- Federated network: /network',
      '- Ecosystem hub: /ecosystem',
      '- Apply for a campus: /dashboard/institutions',
      '',
      'Ask me about a skill (e.g. "explain Docker volumes") or a catalogue course by name.',
    ].join('\n');
  }

  const matches = findRelevantLessons(question, 2);
  const parts: string[] = [];

  if (matches.length === 0 && catalogueHits.length === 0) {
    return [
      "I couldn't pin that to a specific InTelleX lesson yet — but I know our catalogue and tutorials. Try:",
      '',
      '- A technology name ("How do CSS grid columns work?")',
      '- A catalogue course ("What is in the fullstack program?")',
      '- Platform questions ("How do institutions join InTelleX?")',
      '',
      'Browse: /courses · Free paths: /tutorials · Network: /network',
    ].join('\n');
  }

  if (matches[0]) {
    const top = matches[0];
    parts.push(
      `From our free curriculum — **${top.lesson.title}** (${top.courseTitle}, ${top.lesson.level}):\n`,
    );
    parts.push(lessonExcerpt(top.lesson));
    parts.push(
      `\n📖 Full lesson: /dashboard/courses/${top.courseSlug}/${top.lesson.slug}`,
    );
  }

  if (catalogueHits.length) {
    parts.push('\n**Related catalogue courses** (from the InTelleX Mongo catalogue):');
    for (const c of catalogueHits.slice(0, 3)) {
      parts.push(`- **${c.name}** (${c.type || 'Course'}) → /courses/${c.slug}`);
    }
  }

  parts.push(
    '\nAsk a follow-up — "explain it simpler", "show an example", or "what should I take next?".',
  );
  return parts.join('\n');
}

export function isLLMConfigured(): boolean {
  return Boolean(process.env.OPENAI_API_KEY);
}

export async function buildSystemPrompt(): Promise<string> {
  const digest = await buildCatalogueDigest(36);
  const tutorialList = TUTORIALS.map((t) => `${t.shortTitle} (/tutorials/${t.slug})`).join(', ');
  return `${PLATFORM_KNOWLEDGE}

Rules:
- Teach step by step. End with a short check-understanding question when tutoring skills.
- Prefer small runnable examples.
- Keep answers focused (under ~350 words unless asked for more).
- Cite free tutorial lessons with /dashboard/courses/... links and catalogue courses with /courses/... links.
- Never invent grades, private institutional data, or access another campus's records. Respect permissions.
- You know InTelleX deeply — institutions, governance, ecosystem, pricing, tutorials, and the live catalogue below.

Free tutorial tracks: ${tutorialList}

Live catalogue sample (Mongo):
${digest}`;
}

export async function llmTutorStream(
  messages: ChatMessage[],
): Promise<ReadableStream<Uint8Array>> {
  const lastUser = [...messages].reverse().find((m) => m.role === 'user');
  const lessonContext = lastUser
    ? findRelevantLessons(lastUser.content, 2)
        .map(
          (m) =>
            `Lesson "${m.lesson.title}" (link: /dashboard/courses/${m.courseSlug}/${m.lesson.slug}):\n${lessonExcerpt(m.lesson, 900)}`,
        )
        .join('\n\n---\n\n')
    : '';
  const catalogueHits = lastUser ? await findRelevantCatalogueCourses(lastUser.content, 4) : [];
  const catalogueContext = catalogueHits
    .map(
      (c) =>
        `Catalogue course "${c.name}" (${c.type || 'Course'}) link:/courses/${c.slug}\n${(c.shortDescription || c.courseDetails || '').slice(0, 280)}`,
    )
    .join('\n\n');

  const system = await buildSystemPrompt();

  const body = {
    model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
    stream: true,
    messages: [
      { role: 'system', content: system },
      ...(lessonContext
        ? [{ role: 'system' as const, content: `Relevant free-curriculum context:\n\n${lessonContext}` }]
        : []),
      ...(catalogueContext
        ? [{ role: 'system' as const, content: `Relevant catalogue courses:\n\n${catalogueContext}` }]
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
          // ignore keep-alives
        }
      }
    },
    cancel() {
      reader.cancel().catch(() => {});
    },
  });
}
