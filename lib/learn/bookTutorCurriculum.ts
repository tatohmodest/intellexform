/**
 * Turn parsed chapters into a varied tutor path.
 * Batches LLM calls so a whole book is not stuck at six identical "main idea" steps.
 */

import { isLLMConfigured } from '@/lib/learn/tutor';
import { openaiJsonCompletion, parseJsonObject } from '@/lib/learn/openaiJson';
import { isFrontMatter, type ParsedChapter } from '@/lib/learn/bookParse';
import { BOOK_TUTOR_CURRICULUM_SYSTEM } from '@/lib/learn/bookTutorPrompt';

export type LessonKind = 'teach' | 'practice';
export type LessonUiType = 'text_input' | 'code_editor' | 'multiple_choice';
export type LessonExampleType = 'code_snippet' | 'mathematical_formula' | 'real_world_scenario';

export type LessonKind = 'teach' | 'practice';

export type TutorCheck = {
  id: string;
  prompt: string;
  placement: 'mid' | 'end';
  expected: boolean;
  hint: string;
};

export type BuiltLesson = {
  id: string;
  chapterId: string;
  chapterTitle: string;
  sortOrder: number;
  title: string;
  explanation: string;
  example: string;
  question: string;
  criteria: string;
  keywords: string[];
  kind: LessonKind;
  keypoints: string[];
  practiceTask: string;
  note: string;
  watchOut: string;
  analogy: string;
  checks: TutorCheck[];
  uiType: LessonUiType;
  exampleType: LessonExampleType;
  language: string;
  choices: string[];
  correctChoice: number | null;
};

const PRACTICE_RE =
  /\b(try (this|it|the)|your turn|exercise\b|download\b|install\b|run (this|the|it)|open (the|your)|paste |type this|click |go to https?:\/\/|visit https?:\/\/|do the following|homework|practice:|challenge:|lab\b|experiment:)\b/i;

const THANKS_SKIP =
  /\b(thank(?:s| you)(?: to)?(?: my)? (?:wife|husband|spouse|partner|children|family|parents?|editor)|dedicated to my)\b/i;

const STOP = new Set(
  'a an and are as at be but by for from has have how i in is it its of on or that the this to was what when where which who why will with you your me my can do does stay stays remain remains close just over more less very much such only even still than then also into from with need needs using used use about after before because while chapter section page book'.split(
    ' ',
  ),
);

const NAMES = ['Maya', 'Ken', 'Amina', 'Leo', 'Priya', 'Omar', 'Nina', 'Jo'];

type SourceUnit = {
  chapterId: string;
  chapterTitle: string;
  text: string;
  kind: LessonKind;
};

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s'-]/g, ' ')
    .split(/\s+/)
    .filter((t) => t.length > 2 && !STOP.has(t));
}

function keywordsFrom(text: string, limit = 8): string[] {
  const counts = new Map<string, number>();
  for (const t of tokenize(text)) counts.set(t, (counts.get(t) || 0) + 1);
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([w]) => w);
}

function firstSentence(text: string): string {
  const clean = text.replace(/\s+/g, ' ').replace(/^#+\s*/, '').trim();
  const m = clean.match(/^.{12,160}?[.!?]/);
  return (m?.[0] || clean.slice(0, 120)).trim();
}

function sentencesOf(text: string): string[] {
  return text
    .replace(/\s+/g, ' ')
    .replace(/^#+\s*/gm, '')
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 24 && s.length < 220);
}

function splitOversized(text: string, size: number): string[] {
  const clean = text.replace(/\s+/g, ' ').trim();
  if (clean.length <= size) return [text.trim()];
  const out: string[] = [];
  let remaining = clean;
  while (remaining.length > size) {
    let cut = remaining.lastIndexOf('. ', size);
    if (cut < size * 0.45) cut = remaining.lastIndexOf(' ', size);
    if (cut < size * 0.45) cut = size;
    out.push(remaining.slice(0, cut + 1).trim());
    remaining = remaining.slice(cut + 1).trim();
  }
  if (remaining.length > 60) out.push(remaining);
  return out;
}

function chunkMarkdown(markdown: string, size: number): string[] {
  const paras = markdown.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);
  const out: string[] = [];
  let buf = '';
  const flush = () => {
    if (buf.trim().length > 60) out.push(...splitOversized(buf.trim(), size));
    buf = '';
  };
  for (const p of paras) {
    if (p.length > size) {
      flush();
      out.push(...splitOversized(p, size));
      continue;
    }
    if ((buf + '\n\n' + p).length > size && buf.length > 220) {
      flush();
      buf = p;
    } else {
      buf = buf ? `${buf}\n\n${p}` : p;
    }
  }
  flush();
  return out;
}

function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n));
}

function unitsFromChapters(chapters: ParsedChapter[]): SourceUnit[] {
  const collect = (size: number) => {
    const raw: SourceUnit[] = [];
    for (const chapter of chapters) {
      const chunks = chunkMarkdown(chapter.markdown, size);
      const parts = chunks.length ? chunks : [chapter.markdown.slice(0, size)];
      for (const text of parts) {
        if (text.trim().length < 70) continue;
        const chunkTitle =
          text
            .split('\n')
            .map((l) => l.replace(/^#+\s*/, '').trim())
            .find((l) => l.length > 3 && l.length < 120) || chapter.title;
        if (isFrontMatter(chapter.title, text) || isFrontMatter(chunkTitle, text)) continue;
        if (THANKS_SKIP.test(text) || /^SKIP$/i.test(chunkTitle)) continue;
        raw.push({
          chapterId: chapter.id,
          chapterTitle: chapter.title,
          text,
          kind: PRACTICE_RE.test(text) ? 'practice' : 'teach',
        });
      }
    }
    return raw;
  };

  const chars = chapters.reduce((n, c) => n + c.markdown.length, 0);
  const target = clamp(Math.max(chapters.length, Math.round(chars / 1800) || 12), 8, 96);
  let size = 1600;
  let raw = collect(size);
  while (raw.length < Math.min(target, 18) && size > 420) {
    size -= 200;
    raw = collect(size);
  }
  if (!raw.length) return [];
  if (raw.length <= 96) return raw;
  const sampled: SourceUnit[] = [];
  const seen = new Set<number>();
  for (let i = 0; i < 96; i++) {
    const idx = Math.round((i * (raw.length - 1)) / 95);
    if (seen.has(idx)) continue;
    seen.add(idx);
    sampled.push(raw[idx]);
  }
  return sampled;
}

function pickConcrete(text: string): { snippet: string; number: string | null } {
  const num = text.match(
    /\b\d[\d,]*(?:\.\d+)?(?:\s?(?:%|ms|px|MB|GB|KB|seconds?|minutes?|pages?|users?|items?|rows?))?\b/,
  );
  const quoted = text.match(/[“"']([^“"']{10,80})[”"']/);
  const clause = sentencesOf(text)[0] || firstSentence(text);
  return { snippet: quoted?.[1] || clause, number: num?.[0] || null };
}

function extractCodeish(text: string): string {
  const fence = text.match(/```[\s\S]{6,400}?```/);
  if (fence) return `\n\n${fence[0]}\n`;
  const cmd = text
    .split('\n')
    .map((l) => l.trim())
    .find((l) =>
      /^(npm |npx |pip |python |node |git |curl |SELECT |def |function |const |let |import |FROM |cd )/i.test(l),
    );
  return cmd ? `\n\n\`\`\`\n${cmd}\n\`\`\`\n` : '';
}

export function looksLikeCode(text: string): boolean {
  if (/```[\s\S]{4,}?```/.test(text)) return true;
  const hits =
    text.match(
      /\b(def |function |const |let |var |import |class |print\(|console\.|SELECT |FROM |public static|#include |elif |=> |fn |\.py\b|\.js\b|npm |pip install|<!DOCTYPE|<html)\b/gi,
    ) || [];
  return hits.length >= 2;
}

export function inferLanguage(text: string): string {
  const t = text.slice(0, 4000);
  if (/```(?:python|py)\b|\bdef |\belif |\bprint\(|\bimport os\b|\.py\b/i.test(t)) return 'python';
  if (/```(?:ts|typescript)\b|\binterface |\btype \w+ =/i.test(t)) return 'typescript';
  if (/```(?:js|javascript)\b|\bconst |\blet |\bconsole\.|\bfunction /i.test(t)) return 'javascript';
  if (/```sql\b|\bSELECT |\bFROM |\bWHERE |\bJOIN /i.test(t)) return 'sql';
  if (/```(?:html)?\b|<!DOCTYPE|<html/i.test(t)) return 'html';
  if (/```css\b|\b[.#][\w-]+\s*\{/i.test(t)) return 'css';
  if (/```(?:java)\b|\bpublic class |\bSystem\.out/i.test(t)) return 'java';
  if (/```(?:bash|sh)\b|^\s*(npm |pip |curl |cd )/m.test(t)) return 'bash';
  return looksLikeCode(t) ? 'other' : '';
}

function inferUiType(unit: SourceUnit, question: string): LessonUiType {
  const blob = `${unit.text}\n${question}`;
  if (looksLikeCode(blob) || inferLanguage(blob)) return 'code_editor';
  return 'text_input';
}

function inferExampleType(text: string, uiType: LessonUiType): LessonExampleType {
  if (uiType === 'code_editor' || looksLikeCode(text)) return 'code_snippet';
  if (/[=≈≤≥∑∫√]|\$\$|\\\(|\\frac/.test(text)) return 'mathematical_formula';
  return 'real_world_scenario';
}

function fenceIfCode(example: string, exampleType: LessonExampleType, language: string): string {
  const trimmed = example.trim();
  if (!trimmed) return trimmed;
  if (exampleType !== 'code_snippet' && !looksLikeCode(trimmed)) return trimmed;
  if (/```/.test(trimmed)) return trimmed;
  const lang = language && language !== 'other' ? language : '';
  return `\`\`\`${lang}\n${trimmed}\n\`\`\``;
}

function normalizeUiType(raw: unknown, fallback: LessonUiType): LessonUiType {
  const v = String(raw || '').trim();
  if (v === 'code_editor' || v === 'multiple_choice' || v === 'text_input') return v;
  return fallback;
}

function lessonTitle(unit: SourceUnit, kws: string[]): string {
  const heading = unit.text.match(/^#{1,3}\s+(.+)$/m);
  if (heading?.[1]) return heading[1].replace(/\s+/g, ' ').trim().slice(0, 110);
  const topic = kws[0];
  if (topic) {
    const pretty = topic.charAt(0).toUpperCase() + topic.slice(1);
    return `${pretty} in “${unit.chapterTitle}”`.slice(0, 110);
  }
  return firstSentence(unit.text).slice(0, 110);
}

function keypointsFrom(text: string, kws: string[]): string[] {
  const sentences = sentencesOf(text);
  const pts: string[] = [];
  for (const kw of kws.slice(0, 5)) {
    const hit = sentences.find(
      (s) => s.toLowerCase().includes(kw) && !pts.some((p) => p.toLowerCase().includes(s.slice(0, 40).toLowerCase())),
    );
    if (hit) pts.push(hit.replace(/^[-*]\s*/, ''));
  }
  if (pts.length >= 2) return pts.slice(0, 4);
  return sentences.slice(0, 3);
}

function inventedExample(text: string, kws: string[], index: number, chapterTitle: string): string {
  const a = kws[0] || 'this idea';
  const b = kws[1] || 'the next step';
  const who = NAMES[index % NAMES.length];
  const { snippet, number } = pickConcrete(text);
  const tiny = number ? ` using ${number}` : ' on one tiny case (one list, one file, one person)';
  const scenes = [
    `**${who}’s 40-second version.** They take “${snippet}” from **${chapterTitle}** and try **${a}**${tiny}. Then they point: where does **${b}** show up in that same case? If they can say it out loud, they got it.`,
    `**Worked picture.** ${who} explains **${a}** to a classmate who has not read this book. Slogan version fails. Concrete version: “${snippet}” Then they show **${b}** in that same situation.`,
    `**Before / after.** ${who} skips **${a}** and the thing in “${chapterTitle}” falls apart. They redo it${tiny}, this time naming **${b}** at the exact moment it matters. That redo is the example.`,
  ];
  return scenes[index % scenes.length];
}

function looksLikeKeywordDump(example: string): boolean {
  return /hold onto these|these (ideas|keywords|words)|keyword dump/i.test(example);
}

function looksLikeMainIdea(q: string): boolean {
  return /main idea of|what is this (section|chapter|part) about|summarize this (section|chapter)|in your own words,? what (is|was) this/i.test(
    q,
  );
}

function tutorExplanation(unit: SourceUnit, kws: string[]): string {
  const topic = kws[0] || 'this idea';
  const other = kws[1] || 'the idea next to it';
  const lead = firstSentence(unit.text);
  const rest = sentencesOf(unit.text)
    .slice(1, 4)
    .map((s) => `- ${s}`)
    .join('\n');
  const code = extractCodeish(unit.text);
  return [
    `## What I need you to see`,
    `I am teaching **${unit.chapterTitle}** the way the writer meant it — not by recopying the page. Hold this: ${lead}`,
    `## How it works`,
    rest || `Keep **${topic}** distinct from **${other}**. If you mix them, the rest of this stretch stops making sense.`,
    code,
  ]
    .filter(Boolean)
    .join('\n\n');
}

function inventedAnalogy(kws: string[], index: number, chapterTitle: string): string {
  const a = kws[0] || 'this idea';
  const b = kws[1] || 'the next piece';
  const bank = [
    `**${a}** is like a labelled drawer: you do not search the whole room; you open the right drawer. **${b}** is what belongs in that drawer. That is the shape of “${chapterTitle}”.`,
    `Think of a kitchen recipe. **${a}** is the step you cannot skip; **${b}** is the ingredient that step uses. Same move as this stretch of the book.`,
    `A lock and a key: **${a}** is the key turning; **${b}** is the bolt moving. One without the other looks busy and does nothing. That is “${chapterTitle}”.`,
  ];
  return bank[index % bank.length];
}

function makeChecks(unit: SourceUnit, kws: string[], index: number): TutorCheck[] {
  const topic = kws[0] || 'this idea';
  return [
    {
      id: `${unit.chapterId}_mid_${index + 1}`,
      placement: 'mid',
      prompt: `Still with me on **${topic}** in “${unit.chapterTitle}”?`,
      expected: true,
      hint: `Yes means this stretch is making sense. If not, say what is fuzzy — we will clear it, then ask again.`,
    },
    {
      id: `${unit.chapterId}_end_${index + 1}`,
      placement: 'end',
      prompt: `Ready to try the written check on **${topic}**?`,
      expected: true,
      hint: `Yes means you can use **${topic}** on a tiny case. If something is still muddy, say what.`,
    },
  ];
}

function normalizeChecks(
  raw: LlmLesson['checks'],
  fallback: TutorCheck[],
  unit: SourceUnit,
  index: number,
): TutorCheck[] {
  const items = Array.isArray(raw) ? raw : [];
  const parsed = items
    .map((c, i) => {
      const prompt = String(c.prompt || '').trim();
      if (prompt.length < 8) return null;
      const placement: 'mid' | 'end' = c.placement === 'end' || i === 1 ? 'end' : 'mid';
      return {
        id: String(c.id || `${unit.chapterId}_${placement}_${index + 1}`).slice(0, 80),
        prompt: prompt.slice(0, 280),
        placement,
        expected: true as boolean,
        hint: String(c.hint || fallback[i]?.hint || 'Look back at the last paragraph.').slice(0, 400),
      } satisfies TutorCheck;
    })
    .filter((c): c is TutorCheck => Boolean(c));
  const mid = parsed.find((c) => c.placement === 'mid') || fallback[0];
  const end = parsed.find((c) => c.placement === 'end') || parsed.find((c) => c.placement !== 'mid') || fallback[1];
  return [mid, end];
}

function ensureStyledExplanation(text: string, title: string): string {
  const trimmed = text.trim();
  if (/^##\s/m.test(trimmed)) return trimmed;
  const parts = trimmed.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);
  if (parts.length >= 2) {
    return `## What I need you to see\n\n${parts[0]}\n\n## How it works\n\n${parts.slice(1).join('\n\n')}`;
  }
  return `## ${title}\n\n${trimmed}`;
}

function practiceTaskFrom(text: string): string {
  const lines = text
    .split('\n')
    .map((l) => l.replace(/^#+\s*/, '').replace(/^[-*\d.)]+\s*/, '').trim())
    .filter((l) => l.length > 18);
  const hits: string[] = [];
  for (let i = 0; i < lines.length; i++) {
    if (!PRACTICE_RE.test(lines[i])) continue;
    hits.push(lines[i]);
    if (lines[i + 1] && lines[i + 1].length < 180) hits.push(lines[i + 1]);
    if (hits.length >= 5) break;
  }
  const unique = [...new Set(hits)].slice(0, 4);
  if (unique.length) {
    return unique.map((l, i) => `${i + 1}. ${l}`).join('\n');
  }
  return [
    '1. Do the try-it / download / run / open step this section actually describes.',
    '2. Watch what happens (output, screen, error, number).',
    '3. Come back and paste that result below.',
  ].join('\n');
}

function watchOutFrom(text: string, kws: string[]): string {
  const warn = sentencesOf(text).find((s) =>
    /\b(don't|do not|never|avoid|mistake|wrong|common error|careful|watch out|instead of)\b/i.test(s),
  );
  if (warn) return warn;
  const a = kws[0] || 'this idea';
  const b = kws[1] || 'the neighbouring idea';
  return `Beginners mash **${a}** and **${b}** into one slogan. Keep them separate — the check will ask you to.`;
}

function noteFrom(unit: SourceUnit, kws: string[]): string {
  const topic = kws[0] || 'this idea';
  if (unit.kind === 'practice') {
    return `This page is not a reading check. Go do the thing the book asked for, then paste what you got.`;
  }
  return `You do not need to memorise the page. You need to be able to use **${topic}** on a case you invent.`;
}

function variedQuestion(unit: SourceUnit, kws: string[], index: number): { question: string; criteria: string } {
  const topic = kws[0] || firstSentence(unit.text).slice(0, 40);
  const other = kws[1] || 'the surrounding idea';
  if (unit.kind === 'practice') {
    const practiceQ = [
      `Do the action “${unit.chapterTitle}” asked for (download, run, open, try). Paste the output, number, or what you saw.`,
      `Complete the try-it in “${unit.chapterTitle}”. What result did you get, and did it match what the book said should happen?`,
      `After you do the download/run/open step from “${unit.chapterTitle}”, paste one concrete artifact: a line of output, an error, or a short description of the screen.`,
      `Run the “${unit.chapterTitle}” task once. Paste what you got. If it failed, paste the error.`,
    ];
    return {
      question: practiceQ[index % practiceQ.length],
      criteria:
        'A passing answer shows they attempted the task and reports a concrete result, not a restatement of the chapter title.',
    };
  }
  const bank = [
    {
      question: `Why does **${topic}** matter in “${unit.chapterTitle}”? What goes wrong if you skip it?`,
      criteria: `Mentions ${topic} and at least one consequence or use.`,
    },
    {
      question: `Invent a tiny example of **${topic}** from “${unit.chapterTitle}” (not copied from the page). Who is doing what, and where does **${other}** show up?`,
      criteria: `A specific invented situation that correctly uses ${topic}.`,
    },
    {
      question: `In “${unit.chapterTitle}”, a beginner mixes up **${topic}** and **${other}**. What is the difference, in one tight paragraph?`,
      criteria: `Contrasts ${topic} with ${other} instead of repeating a slogan.`,
    },
    {
      question: `If you applied **${topic}** from “${unit.chapterTitle}” tomorrow, what would you do first, and how would you know it worked?`,
      criteria: `A concrete first action plus a check tied to ${topic}.`,
    },
    {
      question: `What mistake around **${topic}** does “${unit.chapterTitle}” warn against? How would you catch it?`,
      criteria: `Names a failure mode related to ${topic}.`,
    },
    {
      question: `Teach **${topic}** from “${unit.chapterTitle}” to someone who has not read this book. Use one analogy, then one precise sentence.`,
      criteria: `Analogy plus an accurate claim about ${topic}.`,
    },
  ];
  return bank[index % bank.length];
}

function heuristicLesson(unit: SourceUnit, index: number): BuiltLesson {
  const kws = keywordsFrom(unit.text);
  const q = variedQuestion(unit, kws, index);
  const title = lessonTitle(unit, kws);
  const uiType = inferUiType(unit, q.question);
  const language = inferLanguage(unit.text);
  const exampleType = inferExampleType(unit.text, uiType);
  const example = fenceIfCode(inventedExample(unit.text, kws, index, unit.chapterTitle), exampleType, language);
  return {
    id: `${unit.chapterId}_${index + 1}`,
    chapterId: unit.chapterId,
    chapterTitle: unit.chapterTitle,
    sortOrder: index,
    title,
    kind: unit.kind,
    explanation: tutorExplanation(unit, kws),
    example,
    exampleType,
    language,
    uiType,
    choices: [],
    correctChoice: null,
    keypoints: keypointsFrom(unit.text, kws),
    practiceTask: unit.kind === 'practice' ? practiceTaskFrom(unit.text) : '',
    note: noteFrom(unit, kws),
    watchOut: watchOutFrom(unit.text, kws),
    analogy: inventedAnalogy(kws, index, unit.chapterTitle),
    checks: makeChecks(unit, kws, index),
    question: q.question,
    criteria: q.criteria,
    keywords: kws,
  };
}

type LlmLesson = {
  unit?: number;
  title?: string;
  kind?: string;
  explanation?: string;
  example?: string;
  keypoints?: string[];
  practiceTask?: string;
  question?: string;
  criteria?: string;
  keywords?: string[];
  note?: string;
  watchOut?: string;
  analogy?: string;
  uiType?: string;
  exampleType?: string;
  language?: string;
  choices?: string[];
  correctChoice?: number | null;
  checks?: Array<{
    id?: string;
    prompt?: string;
    placement?: string;
    expected?: boolean;
    hint?: string;
  }>;
};

function ensurePracticeQuestion(question: string, chapterTitle: string): string {
  if (/paste|what (did you|you) (get|see|observe)|output|result|error|artifact/i.test(question)) {
    return question;
  }
  return `After you do the “${chapterTitle}” try-it, paste the output, number, or result you got.`;
}

async function llmLessonsForBatch(units: SourceUnit[], startIndex: number): Promise<BuiltLesson[] | null> {
  const packed = units
    .map(
      (u, i) =>
        `UNIT ${i + 1} [${u.kind}] chapter="${u.chapterTitle}"\n${u.text.slice(0, 1800)}`,
    )
    .join('\n\n----\n\n');
  const raw = await openaiJsonCompletion({
    temperature: 0.65,
    system: BOOK_TUTOR_CURRICULUM_SYSTEM,
    user: `Write one author-voiced tutor lesson per unit. Each written question in this batch must be different. Skip junk. If a unit is code, use uiType code_editor and a fenced snippet.\n\n${packed}`,
  });
  const parsed = parseJsonObject<{ lessons?: LlmLesson[] }>(raw);
  const items = Array.isArray(parsed?.lessons) ? parsed!.lessons : [];
  if (!items.length) return null;
  const out: BuiltLesson[] = [];
  for (let i = 0; i < units.length; i++) {
    const unit = units[i];
    const item = items.find((x) => Number(x.unit) === i + 1) || items[i];
    if (!item) {
      out.push(heuristicLesson(unit, startIndex + i));
      continue;
    }
    const explanation = String(item.explanation || '').trim();
    const question = String(item.question || '').trim();
    const title = String(item.title || lessonTitle(unit, keywordsFrom(unit.text))).slice(0, 120);
    if (/^SKIP$/i.test(title) || THANKS_SKIP.test(`${title}\n${explanation}`)) {
      continue;
    }
    const kind: LessonKind = item.kind === 'practice' || unit.kind === 'practice' ? 'practice' : 'teach';
    if (explanation.length < 50 || question.length < 12) {
      out.push(heuristicLesson(unit, startIndex + i));
      continue;
    }
    const kws = Array.isArray(item.keywords)
      ? item.keywords.map(String).filter(Boolean).slice(0, 10)
      : keywordsFrom(unit.text);
    const fallback = heuristicLesson(unit, startIndex + i);
    const exampleRaw = String(item.example || '').trim();
    const qFinal = looksLikeMainIdea(question)
      ? fallback.question
      : kind === 'practice'
        ? ensurePracticeQuestion(question, unit.chapterTitle)
        : question;
    const uiType = normalizeUiType(item.uiType, fallback.uiType);
    const choices = Array.isArray(item.choices) ? item.choices.map(String).filter(Boolean).slice(0, 6) : [];
    const safeUi: LessonUiType = uiType === 'multiple_choice' && choices.length < 2 ? fallback.uiType : uiType;
    const language = String(item.language || fallback.language || inferLanguage(unit.text)).slice(0, 24);
    const exampleType = (['code_snippet', 'mathematical_formula', 'real_world_scenario'].includes(String(item.exampleType))
      ? String(item.exampleType)
      : fallback.exampleType) as LessonExampleType;
    const correctChoice =
      safeUi === 'multiple_choice' && Number.isFinite(Number(item.correctChoice))
        ? Math.max(0, Math.min(choices.length - 1, Number(item.correctChoice)))
        : null;
    out.push({
      id: `${unit.chapterId}_${startIndex + i + 1}`,
      chapterId: unit.chapterId,
      chapterTitle: unit.chapterTitle,
      sortOrder: startIndex + i,
      title,
      kind,
      explanation: ensureStyledExplanation(explanation, title).slice(0, 3200),
      example: fenceIfCode(
        looksLikeKeywordDump(exampleRaw) ? fallback.example : exampleRaw || fallback.example,
        exampleType,
        language,
      ).slice(0, 1600),
      exampleType,
      language,
      uiType: safeUi,
      choices: safeUi === 'multiple_choice' ? choices : [],
      correctChoice,
      keypoints: Array.isArray(item.keypoints)
        ? item.keypoints.map(String).filter(Boolean).slice(0, 5)
        : fallback.keypoints,
      practiceTask: kind === 'practice' ? String(item.practiceTask || practiceTaskFrom(unit.text)).slice(0, 1200) : '',
      note: String(item.note || fallback.note).slice(0, 400),
      watchOut: String(item.watchOut || fallback.watchOut).slice(0, 400),
      analogy: String(item.analogy || fallback.analogy).slice(0, 900),
      checks: normalizeChecks(item.checks, fallback.checks, unit, startIndex + i),
      question: qFinal.slice(0, 500),
      criteria: String(item.criteria || fallback.criteria).slice(0, 700),
      keywords: kws,
    });
  }
  return out;
}

function polishLesson(lesson: BuiltLesson, index: number): BuiltLesson {
  const unit: SourceUnit = {
    chapterId: lesson.chapterId,
    chapterTitle: lesson.chapterTitle,
    text: `${lesson.explanation}\n${lesson.example}\n${lesson.question}`,
    kind: lesson.kind === 'practice' ? 'practice' : 'teach',
  };
  const fallback = heuristicLesson(unit, index + 3);
  let question = lesson.question;
  if (looksLikeMainIdea(question) || !question.trim()) question = fallback.question;
  if (lesson.kind === 'practice') question = ensurePracticeQuestion(question, lesson.chapterTitle);
  const example = looksLikeKeywordDump(lesson.example) || !lesson.example.trim() ? fallback.example : lesson.example;
  const uiType = lesson.uiType || fallback.uiType;
  const exampleType = lesson.exampleType || fallback.exampleType;
  const language = lesson.language || fallback.language;
  return {
    ...lesson,
    sortOrder: index,
    question,
    example: fenceIfCode(example, exampleType, language),
    explanation: ensureStyledExplanation(lesson.explanation, lesson.title),
    keypoints: lesson.keypoints.filter(Boolean).length ? lesson.keypoints : fallback.keypoints,
    note: lesson.note || fallback.note,
    watchOut: lesson.watchOut || fallback.watchOut,
    analogy: lesson.analogy || fallback.analogy,
    checks: lesson.checks?.length >= 2 ? lesson.checks.slice(0, 2) : fallback.checks,
    uiType,
    exampleType,
    language,
    choices: uiType === 'multiple_choice' ? lesson.choices || [] : [],
    correctChoice: uiType === 'multiple_choice' ? lesson.correctChoice : null,
  };
}

function dedupeQuestions(lessons: BuiltLesson[]): BuiltLesson[] {
  const seen: string[] = [];
  return lessons.map((lesson, i) => {
    const polished = polishLesson(lesson, i);
    let q = polished.question;
    const key = tokenize(q).slice(0, 8).join(' ');
    if (seen.includes(key) || looksLikeMainIdea(q)) {
      const fallback = heuristicLesson(
        {
          chapterId: lesson.chapterId,
          chapterTitle: lesson.chapterTitle,
          text: `${lesson.explanation}\n${lesson.example}`,
          kind: lesson.kind === 'practice' ? 'practice' : 'teach',
        },
        i + 5,
      );
      q = fallback.question;
    }
    seen.push(tokenize(q).slice(0, 8).join(' '));
    return { ...polished, question: q };
  });
}

export async function buildCurriculum(
  chapters: ParsedChapter[],
  opts?: { deadlineMs?: number; skipLlm?: boolean },
): Promise<{
  lessons: BuiltLesson[];
  engine: 'llm' | 'heuristic' | 'mixed';
}> {
  const units = unitsFromChapters(chapters);
  if (!units.length) return { lessons: [], engine: 'heuristic' };

  const lessons: BuiltLesson[] = [];
  let llmBatches = 0;
  let heuristicCount = 0;
  const batchSize = 5;
  const huge = units.length > 40 || chapters.reduce((n, c) => n + c.markdown.length, 0) > 220_000;
  const llmBatchBudget =
    opts?.skipLlm || !isLLMConfigured() ? 0 : huge ? 2 : 8;

  for (let i = 0; i < units.length; i += batchSize) {
    const batch = units.slice(i, i + batchSize);
    let made: BuiltLesson[] | null = null;
    const timeLeft = opts?.deadlineMs ? opts.deadlineMs - Date.now() : 120_000;
    if (llmBatches < llmBatchBudget && timeLeft > 12_000) {
      try {
        made = await llmLessonsForBatch(batch, lessons.length);
        if (made?.length) llmBatches += 1;
      } catch (err) {
        console.error('book tutor LLM batch failed:', err);
      }
    }
    if (!made?.length) {
      made = batch.map((u, j) => heuristicLesson(u, lessons.length + j));
      heuristicCount += 1;
    }
    lessons.push(...made);
  }

  const unique = dedupeQuestions(lessons)
    .filter(
      (lesson) =>
        !isFrontMatter(lesson.chapterTitle, lesson.explanation) &&
        !THANKS_SKIP.test(`${lesson.title}\n${lesson.explanation}`) &&
        !/^SKIP$/i.test(lesson.title) &&
        !/\b(acknowledg?e?ments?|table of contents|^contents$|copyright|dedication)\b/i.test(lesson.title),
    )
    .slice(0, 96);
  const engine = llmBatches && heuristicCount ? 'mixed' : llmBatches ? 'llm' : 'heuristic';
  return { lessons: unique, engine };
}
