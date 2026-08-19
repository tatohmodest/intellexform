import { TUTORIALS, getTutorialLessons } from '@/lib/tutorials';
import type { ContentBlock, TutorialLesson } from '@/lib/tutorials/types';
import { getAllCourses } from '@/lib/repo';
import type { Course } from '@/lib/types';
import { GOLDEN_RULE } from '@/lib/eduos/governance';
import { ECOSYSTEM, LOOPING_BINARY } from '@/lib/ecosystem';
import { geminiApiKey, geminiTextCompletion, textToTokenStream } from '@/lib/learn/gemini';

/**
 * InTelleX AI - interactive teaching engine.
 *
 * Grounded in the InTelleX curriculum + catalogue, but designed to converse:
 * quiz, plan learning paths, explain, debug, and follow up - not just dump links.
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

interface QuizItem {
  question: string;
  answer: string;
  keywords: string[];
  hint: string;
  lessonHref: string;
  lessonTitle: string;
}

interface QuizState {
  topic: string;
  index: number;
  score: number;
  total: number;
  items: QuizItem[];
}

const QUIZ_MARKER = '<!--intellex-quiz:';
const PLAN_MARKER = '<!--intellex-plan:';

const STOPWORDS = new Set(
  'a an and are as at be but by for from has have how i in is it its of on or that the the this to was what when where which who why will with you your me my can do does please help just like want need'.split(
    ' ',
  ),
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

function keypointsOf(lesson: TutorialLesson): string[] {
  const points: string[] = [];
  for (const b of lesson.content) {
    if (b.type === 'keypoints' || b.type === 'ul' || b.type === 'ol') {
      points.push(...b.items);
    }
  }
  return points;
}

/** Rank curriculum lessons against the learner's question. */
export function findRelevantLessons(question: string, limit = 3): ScoredLesson[] {
  const terms = tokenize(question);
  if (terms.length === 0) return [];
  const results: ScoredLesson[] = [];
  for (const course of TUTORIALS) {
    const lessons = getTutorialLessons(course.slug);
    const courseTerms = tokenize(
      `${course.title} ${course.shortTitle} ${course.slug} ${course.description}`,
    );
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
        results.push({
          courseSlug: course.slug,
          courseTitle: course.title,
          lesson,
          score,
        });
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

export async function findRelevantCatalogueCourses(
  question: string,
  limit = 4,
): Promise<Course[]> {
  try {
    const all = await getAllCourses();
    return all
      .map((c) => ({ c, score: scoreCourse(question, c) }))
      .filter((x) => x.score > 1)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map((x) => x.c);
  } catch {
    return [];
  }
}

function buildEcosystemDigest(): string {
  const items = ECOSYSTEM.map(
    (e) =>
      `- ${e.tab}: ${e.short} → ${e.href}${e.primaryCta.external ? ` (also ${e.primaryCta.href})` : ''}`,
  ).join('\n');
  return `InTelleX ecosystem paths:
${items}
Looping Binary: ${LOOPING_BINARY.home}
Internships: ${LOOPING_BINARY.intern}
Junior Dev: ${LOOPING_BINARY.juniorDev}
Network: /network · Ecosystem hub: /ecosystem · Mentors: /dashboard/mentor (apply) or directory via /dashboard`;
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
You are **InTelleX AI** - the interactive tutor inside the InTelleX Education Operating System.
You teach like a great human mentor: warm, clear, curious, and hands-on. You are NOT a search box that only pastes lesson text.

Personality:
- Name yourself InTelleX AI when introducing yourself.
- Sound like Claude or ChatGPT used for learning - conversational, encouraging, never robotic.
- Prefer dialogue: ask questions, run quizzes, build plans, react to the learner's answers.
- Use short paragraphs. Use fenced code with a language tag when showing examples.
- Celebrate progress. When they struggle, re-explain simpler - never shame.

FOUNDER & COMPANY (facts - never invent alternatives):
- Founder of InTelleX: Tatoh Modest Wilton.
- InTelleX was founded on October 21, 2023.
- Tatoh Modest Wilton is the CEO of Looping Binary.
- Personal / founder site: https://tatohmodest.vercel.app
- Looping Binary website: https://loopingbinary.com
- Looping Binary is the parent company / builder behind InTelleX - Douala, Cameroon.
- Related products: Internships (${LOOPING_BINARY.intern}), Junior Dev (${LOOPING_BINARY.juniorDev}), Looping Binary Auth (auth.loopingbinary.com).

About InTelleX:
- Education Cloud / federated education network - not just an LMS. Built by Looping Binary in Douala, Cameroon.
- Golden rule: ${GOLDEN_RULE}
- Ways to learn: self-paced courses, live mentorship, tutorials, and you (InTelleX AI).
- Ecosystem hub: /ecosystem
- Pricing (self-paced): Monthly ~1,999 XAF, Yearly ~22,560 XAF, or single courses from ~4,999 XAF. MTN MoMo and Orange Money supported.
`.trim();

function aboutFounderOrCompany(q: string): boolean {
  return /founder|who (founded|built|created|owns)|tatoh|modest|wilton|looping\s*binary|when (was|is) (intellex|it) found|founded|ceo|company behind|who made intellex|who started/.test(
    q,
  );
}

function wantsQuiz(q: string): boolean {
  return /\b(quiz|test me|exam|practice questions?|flash ?cards?|drill me|check my knowledge|ask me questions?)\b/i.test(
    q,
  );
}

function wantsPlan(q: string): boolean {
  return /\b(plan|roadmap|study plan|learning path|what should i (learn|study)|curriculum for|schedule|how do i become|path to)\b/i.test(
    q,
  );
}

function wantsExplain(q: string): boolean {
  return /\b(explain|teach|what is|how (does|do|to)|help me understand|break down|eli5|like i.?m)\b/i.test(
    q,
  );
}

function encodeQuizState(state: QuizState): string {
  // Keep payload compact - full items are rebuildable from topic+index via rebuild, but we store essentials.
  const compact = {
    topic: state.topic,
    index: state.index,
    score: state.score,
    total: state.total,
    items: state.items.map((it) => ({
      q: it.question,
      a: it.answer,
      k: it.keywords,
      h: it.hint,
      href: it.lessonHref,
      t: it.lessonTitle,
    })),
  };
  return `${QUIZ_MARKER}${JSON.stringify(compact)}-->`;
}

function parseQuizState(text: string): QuizState | null {
  const idx = text.lastIndexOf(QUIZ_MARKER);
  if (idx === -1) return null;
  const start = idx + QUIZ_MARKER.length;
  const end = text.indexOf('-->', start);
  if (end === -1) return null;
  try {
    const raw = JSON.parse(text.slice(start, end)) as {
      topic: string;
      index: number;
      score: number;
      total: number;
      items: Array<{ q: string; a: string; k: string[]; h: string; href: string; t: string }>;
    };
    return {
      topic: raw.topic,
      index: raw.index,
      score: raw.score,
      total: raw.total,
      items: (raw.items || []).map((it) => ({
        question: it.q,
        answer: it.a,
        keywords: it.k || [],
        hint: it.h || '',
        lessonHref: it.href,
        lessonTitle: it.t,
      })),
    };
  } catch {
    return null;
  }
}

function findActiveQuiz(messages: ChatMessage[]): QuizState | null {
  for (let i = messages.length - 1; i >= 0; i--) {
    const m = messages[i];
    if (m.role !== 'assistant') continue;
    const state = parseQuizState(m.content);
    if (state) return state;
  }
  return null;
}

function gradeAnswer(userText: string, item: QuizItem): boolean {
  const u = userText.toLowerCase().trim();
  if (!u) return false;
  if (u === item.answer.toLowerCase()) return true;
  const hits = item.keywords.filter((k) => u.includes(k.toLowerCase().replace(/\.$/, '')));
  if (hits.length >= 1) return true;
  // soft credit for close paraphrases of the answer string
  const answerTokens = tokenize(item.answer);
  const userTokens = new Set(tokenize(u));
  const overlap = answerTokens.filter((t) => userTokens.has(t)).length;
  return answerTokens.length > 0 && overlap / answerTokens.length >= 0.35;
}

function extractTopic(question: string): string {
  const cleaned = question
    .replace(
      /\b(quiz|test|me|on|about|please|a|an|the|make|create|give|plan|for|learning|path|roadmap|study|to|become|how|do|i|explain|teach|eli5)\b/gi,
      ' ',
    )
    .replace(/\s+/g, ' ')
    .trim();
  return cleaned || question.trim();
}

function buildQuizItems(topic: string, count = 5): QuizItem[] {
  const matches = findRelevantLessons(topic, 8);
  const pool: QuizItem[] = [];

  for (const m of matches) {
    const href = `/dashboard/courses/${m.courseSlug}/${m.lesson.slug}`;
    const points = keypointsOf(m.lesson);
    for (const point of points.slice(0, 3)) {
      const keywords = tokenize(point).slice(0, 6);
      if (keywords.length < 2) continue;
      pool.push({
        question: `In **${m.lesson.title}**, explain this idea in your own words:\n"${point.slice(0, 140)}${point.length > 140 ? '...' : ''}"`,
        answer: point,
        keywords,
        hint: `Revisit **${m.lesson.title}** in ${m.courseTitle}.`,
        lessonHref: href,
        lessonTitle: m.lesson.title,
      });
    }
    // Title-based conceptual question
    pool.push({
      question: `In one or two sentences, what does **${m.lesson.title}** teach you?`,
      answer: m.lesson.description || m.lesson.title,
      keywords: tokenize(`${m.lesson.title} ${m.lesson.description}`).slice(0, 8),
      hint: `Open ${href} if you want a refresher.`,
      lessonHref: href,
      lessonTitle: m.lesson.title,
    });
  }

  // Deduplicate by question text and take requested count
  const seen = new Set<string>();
  const unique: QuizItem[] = [];
  for (const item of pool) {
    const key = item.question.slice(0, 80);
    if (seen.has(key)) continue;
    seen.add(key);
    unique.push(item);
    if (unique.length >= count) break;
  }

  // Generic fallback quiz if curriculum miss
  if (!unique.length) {
    const generic: QuizItem[] = [
      {
        question:
          'What is the difference between a **variable** and a **constant** in programming?',
        answer: 'A variable can change; a constant stays fixed after you set it.',
        keywords: ['change', 'fixed', 'constant', 'variable'],
        hint: 'Think about whether the value is allowed to change later.',
        lessonHref: '/tutorials',
        lessonTitle: 'Programming basics',
      },
      {
        question: 'What does **API** stand for, and why do developers use APIs?',
        answer:
          'Application Programming Interface - a way for programs to talk to each other.',
        keywords: ['application', 'programming', 'interface', 'talk', 'communicate'],
        hint: 'It is how software systems exchange data.',
        lessonHref: '/tutorials',
        lessonTitle: 'APIs',
      },
      {
        question: 'Name one benefit of writing **small functions** instead of one giant function.',
        answer: 'Easier to test, reuse, and understand.',
        keywords: ['test', 'reuse', 'understand', 'read', 'maintain'],
        hint: 'Think about debugging and teamwork.',
        lessonHref: '/tutorials',
        lessonTitle: 'Clean code',
      },
      {
        question: 'What is **version control** (like Git) used for?',
        answer: 'Tracking changes to code over time and collaborating safely.',
        keywords: ['track', 'changes', 'collaborate', 'history', 'git'],
        hint: 'It is your project time machine.',
        lessonHref: '/tutorials',
        lessonTitle: 'Git',
      },
      {
        question: 'What should you do first when your code throws an error?',
        answer: 'Read the error message carefully, then reproduce and isolate the problem.',
        keywords: ['read', 'error', 'reproduce', 'isolate', 'message'],
        hint: 'The stack trace is trying to help you.',
        lessonHref: '/tutorials',
        lessonTitle: 'Debugging',
      },
    ];
    return generic.slice(0, count);
  }

  return unique;
}

function formatQuizQuestion(state: QuizState): string {
  const item = state.items[state.index];
  if (!item) return 'Quiz complete.';
  const n = state.index + 1;
  return [
    `**InTelleX AI quiz · ${state.topic}**`,
    `Question ${n} of ${state.total} · score so far ${state.score}/${n - 1 || 0}`,
    '',
    item.question,
    '',
    '_Reply with your answer. Say **hint** if you want a nudge, or **skip** to move on._',
    '',
    encodeQuizState(state),
  ].join('\n');
}

function startQuiz(topicRaw: string): string {
  const topic = extractTopic(topicRaw) || 'general programming';
  const items = buildQuizItems(topic, 5);
  const state: QuizState = {
    topic,
    index: 0,
    score: 0,
    total: items.length,
    items,
  };
  return [
    `Let's go - I'm **InTelleX AI**, and I'll quiz you on **${topic}**.`,
    '',
    `I pulled ideas from the InTelleX curriculum where I could. Answer in your own words - I will grade you as we go.`,
    '',
    formatQuizQuestion(state),
  ].join('\n');
}

function continueQuiz(state: QuizState, userText: string): string {
  const q = userText.trim().toLowerCase();
  const item = state.items[state.index];
  if (!item) {
    return `That quiz is finished. Score: **${state.score}/${state.total}**. Want another round? Say **quiz me on ...**`;
  }

  if (/^(hint|help|nudge)\b/.test(q)) {
    return [
      `Hint: ${item.hint}`,
      '',
      `Still on question ${state.index + 1}: ${item.question}`,
      '',
      encodeQuizState(state),
    ].join('\n');
  }

  if (/^(skip|next|pass)\b/.test(q)) {
    const next: QuizState = { ...state, index: state.index + 1 };
    if (next.index >= next.total) {
      return finishQuiz(state);
    }
    return [
      `Skipped. The idea was: **${item.answer}**`,
      `Lesson: ${item.lessonHref}`,
      '',
      formatQuizQuestion(next),
    ].join('\n');
  }

  if (/^(stop|end|quit|cancel)( quiz)?\b/.test(q)) {
    return [
      `Quiz paused. You scored **${state.score}** so far out of ${state.index} answered.`,
      'Say **quiz me on ...** anytime to start again - or ask me to explain a topic.',
    ].join('\n');
  }

  const correct = gradeAnswer(userText, item);
  const scored: QuizState = {
    ...state,
    score: state.score + (correct ? 1 : 0),
    index: state.index + 1,
  };

  const feedback = correct
    ? `Yes - nailed it. ${item.keywords.slice(0, 3).join(', ') || 'Good reasoning'}.`
    : `Not quite. A solid answer: **${item.answer}**\n(Review: ${item.lessonHref})`;

  if (scored.index >= scored.total) {
    return [`${feedback}`, '', finishQuiz(scored)].join('\n');
  }

  return [`${feedback}`, '', formatQuizQuestion(scored)].join('\n');
}

function finishQuiz(state: QuizState): string {
  const pct = Math.round((state.score / Math.max(state.total, 1)) * 100);
  let vibe = 'Solid effort - keep going.';
  if (pct >= 80) vibe = 'Outstanding. You are ready for the next level.';
  else if (pct >= 50) vibe = 'Good progress. A quick lesson review will push you over the top.';
  else vibe = 'No stress - this is how mastery starts. Want me to teach the weak spots?';

  return [
    `**Quiz complete · ${state.topic}**`,
    `Score: **${state.score}/${state.total}** (${pct}%)`,
    vibe,
    '',
    'What next?',
    '- Say **explain ...** and I will teach the sticky parts',
    '- Say **quiz me on ...** for another round',
    '- Say **make a plan for ...** and I will build your learning path',
  ].join('\n');
}

function buildLearningPlan(topicRaw: string, catalogueHits: Course[]): string {
  const topic = extractTopic(topicRaw) || 'web development';
  const lessons = findRelevantLessons(topic, 9);
  const weeks: string[] = [];

  if (lessons.length) {
    const chunk = Math.max(1, Math.ceil(lessons.length / 3));
    for (let w = 0; w < 3; w++) {
      const slice = lessons.slice(w * chunk, (w + 1) * chunk);
      if (!slice.length) break;
      const lines = slice.map(
        (m) =>
          `  - Day focus: **${m.lesson.title}** (${m.courseTitle}) → /dashboard/courses/${m.courseSlug}/${m.lesson.slug}`,
      );
      weeks.push(`**Week ${w + 1}**\n${lines.join('\n')}\n  - End-of-week: ask me **quiz me on ${topic}**`);
    }
  } else {
    weeks.push(
      `**Week 1 - Foundations**\n  - Browse /tutorials and pick a beginner track near "${topic}"\n  - 45 minutes/day · take notes · ask me to explain anything sticky`,
    );
    weeks.push(
      `**Week 2 - Build**\n  - Ship a tiny project (one page, one API, or one script)\n  - Bring bugs to me - say **debug this:** and paste the error`,
    );
    weeks.push(
      `**Week 3 - Prove it**\n  - Polish the project README\n  - Ask me **quiz me on ${topic}** then share the project with a mentor (/dashboard/mentorship)`,
    );
  }

  const catalogueBlock = catalogueHits.length
    ? [
        '',
        '**Catalogue boosters on InTelleX:**',
        ...catalogueHits
          .slice(0, 3)
          .map((c) => `- **${c.name}** → /courses/${c.slug}`),
      ].join('\n')
    : '';

  return [
    `I'm **InTelleX AI** - here is a practical plan for **${topic}**.`,
    '',
    ...weeks,
    catalogueBlock,
    '',
    'Ecosystem next steps when you are ready: /ecosystem · Internships · Junior Dev · Mentorship.',
    '',
    'Reply with **start week 1** and I will teach the first lesson interactively - or **quiz me** to baseline yourself now.',
    '',
    `${PLAN_MARKER}{"topic":${JSON.stringify(topic)}}-->`,
  ]
    .filter(Boolean)
    .join('\n');
}

function teachTopic(question: string, catalogueHits: Course[]): string {
  const matches = findRelevantLessons(question, 2);
  const parts: string[] = [];

  parts.push(`I'm **InTelleX AI** - let's learn this together.`);
  parts.push('');

  if (matches[0]) {
    const top = matches[0];
    const excerpt = lessonExcerpt(top.lesson, 900);
    const points = keypointsOf(top.lesson).slice(0, 3);

    parts.push(`### ${top.lesson.title}`);
    parts.push(`*(${top.courseTitle} · ${top.lesson.level})*`);
    parts.push('');
    parts.push(excerpt.trim() || top.lesson.description);
    if (points.length) {
      parts.push('');
      parts.push('**Remember:**');
      for (const p of points) parts.push(`- ${p}`);
    }
    parts.push('');
    parts.push(`Full lesson: /dashboard/courses/${top.courseSlug}/${top.lesson.slug}`);
    if (matches[1]) {
      parts.push(
        `Go deeper next: **${matches[1].lesson.title}** → /dashboard/courses/${matches[1].courseSlug}/${matches[1].lesson.slug}`,
      );
    }
  } else {
    parts.push(
      "I don't have a single perfect lesson match yet, so let's reason it through - then I'll point you to the closest InTelleX track.",
    );
    parts.push('');
    parts.push(
      'Tell me your level (**beginner** / **intermediate**) and whether you want an **explanation**, a **quiz**, or a **study plan**.',
    );
  }

  if (catalogueHits.length) {
    parts.push('');
    parts.push('**Related catalogue courses:**');
    for (const c of catalogueHits.slice(0, 3)) {
      parts.push(`- **${c.name}** → /courses/${c.slug}`);
    }
  }

  // Interactive closer - always
  const checkSeed =
    matches[0]?.lesson.title || extractTopic(question) || 'this topic';
  parts.push('');
  parts.push('---');
  parts.push(
    `**Quick check:** In your own words, what is the most important idea in **${checkSeed}**?`,
  );
  parts.push(
    '_Answer me - I will react. Or say **quiz me**, **make a plan**, or **give an example**. _',
  );

  return parts.join('\n');
}

function platformAnswer(question: string): string | null {
  const q = question.toLowerCase();
  if (aboutFounderOrCompany(q)) {
    return [
      "I'm **InTelleX AI** - happy to share the story.",
      '',
      '**InTelleX** was founded on **October 21, 2023** by **Tatoh Modest Wilton**.',
      'Tatoh is the **CEO of Looping Binary** - the Douala, Cameroon company that builds InTelleX.',
      '',
      `Official links: ${LOOPING_BINARY.home} · https://tatohmodest.vercel.app · /ecosystem · /courses`,
      '',
      'Want a learning plan, a quiz, or help picking your first course?',
    ].join('\n');
  }

  if (
    /intellex|institution|campus|federat|mentor apply|become a mentor|platform|ecosystem|network|eduos|governance|how does (this|intellex) work|junior\s*dev|certificat/.test(
      q,
    )
  ) {
    return [
      "I'm **InTelleX AI**. Here's the short version of how the platform works:",
      '',
      '- **You** get one identity, courses, mentors, tutorials, and me.',
      '- **Institutions** apply; after approval they run their own campus data.',
      '- **Mentors / instructors** apply and are reviewed.',
      `- **Looping Binary** (${LOOPING_BINARY.home}) builds InTelleX.`,
      '',
      `Golden rule: ${GOLDEN_RULE}`,
      '',
      'Explore: /courses · /tutorials · /ecosystem · /network',
      '',
      'What do you want to do next - **learn a skill**, **take a quiz**, or **build a study plan**?',
    ].join('\n');
  }

  return null;
}

/**
 * Interactive multi-turn tutor used when no LLM key is configured,
 * and as a safety fallback if the LLM call fails.
 */
export function interactiveTutorAnswer(
  messages: ChatMessage[],
  catalogueHits: Course[] = [],
): string {
  const lastUser = [...messages].reverse().find((m) => m.role === 'user');
  if (!lastUser) {
    return "Hey - I'm **InTelleX AI**. Ask me to explain something, quiz you, or build a learning plan.";
  }

  const activeQuiz = findActiveQuiz(messages);
  // If a quiz is in progress and the user didn't explicitly switch modes, continue it.
  if (
    activeQuiz &&
    activeQuiz.index < activeQuiz.total &&
    !wantsPlan(lastUser.content) &&
    !/^new quiz\b/i.test(lastUser.content) &&
    !(wantsQuiz(lastUser.content) && extractTopic(lastUser.content).length > 2)
  ) {
    // Allow "quiz me on X" mid-quiz to restart only when a new topic is clear
    if (wantsQuiz(lastUser.content) && extractTopic(lastUser.content).length > 2) {
      return startQuiz(lastUser.content);
    }
    return continueQuiz(activeQuiz, lastUser.content);
  }

  if (wantsQuiz(lastUser.content)) {
    return startQuiz(lastUser.content);
  }

  if (wantsPlan(lastUser.content)) {
    return buildLearningPlan(lastUser.content, catalogueHits);
  }

  const platform = platformAnswer(lastUser.content);
  if (platform) return platform;

  // Follow-up after a plan marker
  const lastAssistant = [...messages].reverse().find((m) => m.role === 'assistant');
  if (
    lastAssistant?.content.includes(PLAN_MARKER) &&
    /\b(start|begin|week\s*1|let'?s go|teach)\b/i.test(lastUser.content)
  ) {
    const topicMatch = lastAssistant.content.match(/"topic":"([^"]+)"/);
    const topic = topicMatch?.[1] || 'your plan';
    return teachTopic(`explain ${topic} fundamentals`, catalogueHits);
  }

  // If previous turn asked a quick check, treat this as an answer and coach
  if (
    lastAssistant &&
    /\*\*Quick check:\*\*/i.test(lastAssistant.content) &&
    !wantsExplain(lastUser.content)
  ) {
    return [
      lastUser.content.trim().length < 12
        ? "Give me a bit more - even one clear sentence shows me what clicked."
        : "Nice - that shows you're thinking. Here's how I'd sharpen it: keep the core idea, drop extra jargon, and add one concrete example from your own words.",
      '',
      'Want to lock it in? Say **quiz me** on this topic, or **give an example** and I will show code.',
    ].join('\n');
  }

  if (wantsExplain(lastUser.content) || findRelevantLessons(lastUser.content, 1).length) {
    return teachTopic(lastUser.content, catalogueHits);
  }

  // Open conversational default - never a dead-end link dump
  return [
    "I'm **InTelleX AI** - I can teach, quiz you, debug with you, or build a study plan.",
    '',
    'Try one of these:',
    '- **Explain** React hooks like I am new',
    '- **Quiz me** on JavaScript',
    '- **Make a plan** to become a backend developer',
    '- **Who founded InTelleX?**',
    '',
    `Or browse: /courses · /tutorials · /ecosystem · ${LOOPING_BINARY.home}`,
  ].join('\n');
}

/** @deprecated use interactiveTutorAnswer - kept for any external imports */
export function curriculumTutorAnswer(
  question: string,
  catalogueHits: Course[] = [],
): string {
  return interactiveTutorAnswer([{ role: 'user', content: question }], catalogueHits);
}

export function isLLMConfigured(): boolean {
  return Boolean(
    process.env.GEMINI_API_KEY ||
      process.env.GOOGLE_GENERATIVE_AI_API_KEY ||
      process.env.OPENAI_API_KEY,
  );
}

export async function buildSystemPrompt(): Promise<string> {
  const digest = await buildCatalogueDigest(48);
  const tutorialList = TUTORIALS.map((t) => `${t.shortTitle} (/tutorials/${t.slug})`).join(', ');
  const ecosystem = buildEcosystemDigest();
  return `${PLATFORM_KNOWLEDGE}

## How you teach (critical)
1. **Interact** - do not only retrieve. Have a conversation. Ask follow-ups. Run quizzes one question at a time. Wait for the learner's answer before revealing the next question or the full answer key.
2. **Quiz mode** - when they say quiz/test me: ask ONE question, wait, grade briefly (correct/incorrect + why), keep a running score, then ask the next. After 5 questions, summarize and suggest what to study.
3. **Plan mode** - when they want a plan/roadmap: give a 2-4 week plan with concrete InTelleX lesson links and a weekly quiz checkpoint.
4. **Teach mode** - explain in your own words first (short), then optionally cite 1-3 InTelleX lessons. End with a quick check question.
5. **Debug mode** - reason step by step, ask for the error/output if missing, propose a fix, then a tiny exercise.
6. Never dump raw curriculum excerpts as the whole reply. Synthesize. Be lively.
7. Keep answers focused unless they ask for depth. Use fenced code with language tags.
8. For founder / Looping Binary questions: use the FOUNDER facts exactly.
9. Never invent grades, private institutional data, or another campus's records.
10. You may cite InTelleX links (/dashboard/courses/..., /courses/..., /ecosystem) as optional next steps - never as a substitute for teaching.

${ecosystem}

Free tutorial tracks: ${tutorialList}

Live catalogue sample (Mongo) - use when recommending courses:
${digest}`;
}

export async function llmTutorStream(
  messages: ChatMessage[],
): Promise<ReadableStream<Uint8Array>> {
  const lastUser = [...messages].reverse().find((m) => m.role === 'user');
  const lessonContext = lastUser
    ? findRelevantLessons(lastUser.content, 3)
        .map(
          (m) =>
            `Lesson "${m.lesson.title}" (link: /dashboard/courses/${m.courseSlug}/${m.lesson.slug}):\n${lessonExcerpt(m.lesson, 700)}`,
        )
        .join('\n\n---\n\n')
    : '';
  const catalogueHits = lastUser
    ? await findRelevantCatalogueCourses(lastUser.content, 4)
    : [];
  const catalogueContext = catalogueHits
    .map(
      (c) =>
        `Catalogue course "${c.name}" (${c.type || 'Course'}) link:/courses/${c.slug}\n${(c.shortDescription || c.courseDetails || '').slice(0, 280)}`,
    )
    .join('\n\n');

  const system = await buildSystemPrompt();
  const aboutOrg = lastUser ? aboutFounderOrCompany(lastUser.content.toLowerCase()) : false;
  const quizMode = lastUser ? wantsQuiz(lastUser.content) : false;
  const planMode = lastUser ? wantsPlan(lastUser.content) : false;

  const modeNudge = aboutOrg
    ? 'The learner is asking about the founder or Looping Binary. Answer with exact facts, warmly, then offer a quiz or learning plan.'
    : quizMode
      ? 'QUIZ MODE: Ask exactly ONE question now. Do not give the answer yet. Wait for the learner. Keep score across turns.'
      : planMode
        ? 'PLAN MODE: Build a concrete multi-week InTelleX learning plan with lesson links and a quiz checkpoint each week. End by asking which week to start.'
        : 'Teach interactively. End with a short check question or an offer to quiz / plan. Do not only paste lesson text.';

  const body = {
    model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
    stream: true,
    temperature: 0.7,
    messages: [
      { role: 'system', content: system },
      ...(lessonContext
        ? [
            {
              role: 'system' as const,
              content: `Optional curriculum context (synthesize - do not dump verbatim):\n\n${lessonContext}`,
            },
          ]
        : []),
      ...(catalogueContext
        ? [
            {
              role: 'system' as const,
              content: `Optional catalogue matches (cite only if useful):\n\n${catalogueContext}`,
            },
          ]
        : []),
      { role: 'system' as const, content: modeNudge },
      ...messages.filter((m) => m.role !== 'system').slice(-20),
    ],
  };

  if (geminiApiKey()) {
    const history = messages
      .filter((m) => m.role !== 'system')
      .slice(-20)
      .map((m) => `${m.role === 'assistant' ? 'Tutor' : 'Student'}: ${m.content}`)
      .join('\n\n');
    const extra = [
      lessonContext && `Curriculum context:\n${lessonContext}`,
      catalogueContext && `Catalogue:\n${catalogueContext}`,
    ]
      .filter(Boolean)
      .join('\n\n');
    const text = await geminiTextCompletion({
      system: `${system}\n\n${modeNudge}${extra ? `\n\n${extra}` : ''}`,
      user: `${history}\n\nReply as the tutor now.`,
      temperature: 0.7,
    });
    if (!text) throw new Error('Gemini returned an empty reply.');
    return textToTokenStream(text);
  }

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
