/**
 * Book → structure → curriculum → typed tutor steps.
 * Heuristic fallback uses the book's own sentences. It does not invent
 * characters, stock analogies, or fake try-its from a table of contents.
 */

import { isLLMConfigured } from '@/lib/learn/tutor';
import { openaiJsonCompletion, parseJsonObject } from '@/lib/learn/openaiJson';
import {
  explodeDashedHeadings,
  isFrontMatter,
  looksLikeHeadingCatalog,
  type ParsedChapter,
} from '@/lib/learn/bookParse';
import {
  BOOK_ANALYZER_SYSTEM,
  BOOK_ARCHITECT_SYSTEM,
  BOOK_TUTOR_STEP_SYSTEM,
} from '@/lib/learn/bookTutorPrompt';

export type LessonKind = 'orient' | 'teach' | 'practice';
export type LessonStepType =
  | 'introduction'
  | 'explanation'
  | 'example'
  | 'guided_practice'
  | 'assessment'
  | 'transition';
export type LessonUiType = 'text_input' | 'code_editor' | 'multiple_choice';
export type LessonExampleType = 'code_snippet' | 'mathematical_formula' | 'real_world_scenario';

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
  stepType: LessonStepType;
  interactionRequired: boolean;
  objective: string;
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

const TRY_IT_RE = /\b(try it yourself|try it|your turn|exercise\s+\d+[-\.]\d+)\b/i;
const STOP = new Set(
  'a an and are as at be but by for from has have how i in is it its of on or that the this to was what when where which who why will with you your me my can do does chapter section page book'.split(
    ' ',
  ),
);

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

function sentencesOf(text: string): string[] {
  return text
    .replace(/\s+/g, ' ')
    .replace(/^#+\s*/gm, '')
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 28 && s.length < 280 && !looksLikeHeadingCatalog(s));
}

function proseScore(text: string): number {
  return sentencesOf(text).length;
}

function isExerciseDump(text: string): boolean {
  const titles = (text.match(/\bexercise\s+\d+[-\.]\d+/gi) || []).length;
  return titles >= 3 && proseScore(text) < 3;
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

function extractCodeish(text: string): string {
  const fence = text.match(/```[\s\S]{6,800}?```/);
  if (fence) return fence[0];
  const lines = text.split('\n').map((l) => l.trim());
  const start = lines.findIndex((l) =>
    /^(>>> |def |print\(|name = |message = |print |import |from |function |const |let )/.test(l),
  );
  if (start < 0) return '';
  const block = lines.slice(start, start + 8).filter(Boolean);
  if (!block.length) return '';
  const lang = inferLanguage(block.join('\n')) || 'python';
  return `\`\`\`${lang === 'other' ? '' : lang}\n${block.join('\n')}\n\`\`\``;
}

const META_SPEAK =
  /i (am|'m|will be|’ll be) teaching you|as the author of this book|i will not copy and paste|not by recopying the page|the way the writer meant|impersonate the writer|as your (ai )?tutor|in this lesson i will|hold this:|maya’?s 40-second|labelled drawer|go do the thing this stretch asked for/i;

export function stripTutorMetaSpeak(text: string): string {
  const cleaned = text
    .split(/\n{2,}/)
    .map((p) =>
      p
        .replace(/\bI am teaching [^.!?\n]{0,160}(?:—|-)?\s*not by recopying the page\.?\s*/gi, '')
        .replace(/\bI will be teaching you[^.!?\n]{0,220}\.?\s*/gi, '')
        .replace(/\bAs the author of this book[^.!?\n]{0,200}\.?\s*/gi, '')
        .replace(/\bI will not copy and paste[^.!?\n]{0,160}\.?\s*/gi, '')
        .trim(),
    )
    .filter((p) => p && !META_SPEAK.test(p) && !looksLikeHeadingCatalog(p));
  return cleaned.join('\n\n').trim();
}

export function looksLikeWelcome(title: string, text: string): boolean {
  const blob = `${title}\n${text.slice(0, 1800)}`.toLowerCase();
  if (looksLikeCode(text) || isExerciseDump(text)) return false;
  return /\b(welcome to (this|the) book|this book (is about|will (teach|show|help))|who this book is for|who should read|no (prior|previous) experience|you (don'?t|do not) need to (be|know|have)|how to (use|read) this book)\b/.test(
    blob,
  );
}

function looksLikeMainIdea(q: string): boolean {
  return /main idea of|what is this (section|chapter|part) about|summarize this (section|chapter)|what (have you|did you) learn(ed)? from (this|the) (chapter|section|book|lesson)|copy and paste|write exactly/i.test(
    q,
  );
}

export function lessonNeedsCheck(lesson: {
  kind?: string;
  stepType?: string;
  interactionRequired?: boolean;
  question?: string;
  chapterTitle?: string;
  title?: string;
  explanation?: string;
}): boolean {
  if (looksLikeHeadingCatalog(String(lesson.explanation || ''))) return false;
  if (lesson.interactionRequired === false) return false;
  if (lesson.interactionRequired === true) return Boolean(String(lesson.question || '').trim());
  if (lesson.stepType === 'guided_practice' || lesson.stepType === 'assessment') return true;
  if (
    lesson.stepType === 'introduction' ||
    lesson.stepType === 'explanation' ||
    lesson.stepType === 'example' ||
    lesson.stepType === 'transition'
  ) {
    return false;
  }
  if (lesson.kind === 'practice') return true;
  if (lesson.kind === 'orient') return false;
  const q = String(lesson.question || '').trim();
  if (!q || looksLikeMainIdea(q)) return false;
  if (looksLikeWelcome(lesson.chapterTitle || lesson.title || '', lesson.explanation || '')) return false;
  return true;
}

function kindFromStep(stepType: LessonStepType, _interaction: boolean): LessonKind {
  if (stepType === 'introduction') return 'orient';
  if (stepType === 'guided_practice') return 'practice';
  return 'teach';
}

function normalizeStepType(raw: unknown, fallback: LessonStepType): LessonStepType {
  const v = String(raw || '').trim();
  if (
    v === 'introduction' ||
    v === 'explanation' ||
    v === 'example' ||
    v === 'guided_practice' ||
    v === 'assessment' ||
    v === 'transition'
  ) {
    return v;
  }
  return fallback;
}

function sectionTitle(text: string, fallback: string): string {
  const heading = text.match(/^#{1,3}\s+(.+)$/m)?.[1] || text.split('\n').map((l) => l.replace(/^#+\s*/, '').trim()).find((l) => l.length > 3 && l.length < 90);
  if (heading && !looksLikeHeadingCatalog(heading)) return heading.slice(0, 110);
  return fallback.slice(0, 110);
}

type SourceSection = {
  chapterId: string;
  chapterTitle: string;
  title: string;
  text: string;
  role: 'introduction' | 'chapter';
};

function sectionsFromChapter(chapter: ParsedChapter, role: 'introduction' | 'chapter'): SourceSection[] {
  const md = explodeDashedHeadings(chapter.markdown).trim();
  if (md.length < 120 || looksLikeHeadingCatalog(md) || isFrontMatter(chapter.title, md) || isExerciseDump(md)) {
    return [];
  }
  const parts = md
    .split(/(?=^(?:#{1,3}\s+.+|exercise\s+\d+[-\.]\d+[^\n]*|try it yourself)\s*$)/gim)
    .map((s) => s.trim())
    .filter((s) => s.length > 100 && !looksLikeHeadingCatalog(s) && !isExerciseDump(s) && proseScore(s) >= 1);
  const chunks = parts.length ? parts : [md];
  const out: SourceSection[] = [];
  for (const text of chunks) {
    if (text.length < 100) continue;
    out.push({
      chapterId: chapter.id,
      chapterTitle: chapter.title,
      title: sectionTitle(text, chapter.title),
      text: text.slice(0, 8000),
      role,
    });
  }
  return out;
}

function groundedExplanation(text: string): string {
  const paras = explodeDashedHeadings(text)
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter((p) => p.length > 40 && !looksLikeHeadingCatalog(p) && !isExerciseDump(p));
  const body = paras.slice(0, 4).join('\n\n') || sentencesOf(text).slice(0, 5).join(' ');
  return stripTutorMetaSpeak(body).slice(0, 2800);
}

function isRealTryIt(text: string): boolean {
  if (isExerciseDump(text) || looksLikeHeadingCatalog(text)) return false;
  if (!TRY_IT_RE.test(text)) return false;
  return proseScore(text) >= 2 || /\b(write|type|create|print|run|assign)\b/i.test(text);
}

function makeLesson(opts: {
  chapterId: string;
  chapterTitle: string;
  index: number;
  title: string;
  stepType: LessonStepType;
  explanation: string;
  example?: string;
  question?: string;
  criteria?: string;
  practiceTask?: string;
  text: string;
}): BuiltLesson {
  const interaction =
    opts.stepType === 'guided_practice' || opts.stepType === 'assessment'
      ? Boolean(String(opts.question || '').trim())
      : false;
  const language = inferLanguage(`${opts.text}\n${opts.example || ''}`);
  const example = String(opts.example || '').trim();
  return {
    id: `${opts.chapterId}_${opts.index + 1}`,
    chapterId: opts.chapterId,
    chapterTitle: opts.chapterTitle,
    sortOrder: opts.index,
    title: stripTutorMetaSpeak(opts.title).slice(0, 110) || opts.title.slice(0, 110),
    explanation: stripTutorMetaSpeak(opts.explanation).slice(0, 3200),
    example: looksLikeHeadingCatalog(example) ? '' : example.slice(0, 1600),
    question: interaction ? String(opts.question || '').slice(0, 500) : '',
    criteria: interaction ? String(opts.criteria || '').slice(0, 700) : '',
    keywords: keywordsFrom(opts.text),
    kind: kindFromStep(opts.stepType, interaction),
    stepType: opts.stepType,
    interactionRequired: interaction,
    objective: '',
    keypoints: [],
    practiceTask: opts.stepType === 'guided_practice' ? String(opts.practiceTask || '').slice(0, 1200) : '',
    note: '',
    watchOut: '',
    analogy: '',
    checks: [],
    uiType: interaction && language ? 'code_editor' : 'text_input',
    exampleType: looksLikeCode(example || opts.text) ? 'code_snippet' : 'real_world_scenario',
    language,
    choices: [],
    correctChoice: null,
  };
}

function heuristicStepsForSection(section: SourceSection, startIndex: number): BuiltLesson[] {
  const explanation = groundedExplanation(section.text);
  if (explanation.length < 80) return [];
  const code = extractCodeish(section.text);
  const intro = section.role === 'introduction' || looksLikeWelcome(section.title, section.text);
  const steps: BuiltLesson[] = [];
  if (intro) {
    steps.push(
      makeLesson({
        chapterId: section.chapterId,
        chapterTitle: section.chapterTitle,
        index: startIndex,
        title: section.title,
        stepType: 'introduction',
        explanation,
        example: code,
        text: section.text,
      }),
    );
    return steps;
  }
  steps.push(
    makeLesson({
      chapterId: section.chapterId,
      chapterTitle: section.chapterTitle,
      index: startIndex,
      title: section.title,
      stepType: 'explanation',
      explanation,
      example: code,
      text: section.text,
    }),
  );
  if (isRealTryIt(section.text)) {
    const exerciseLine =
      section.text
        .split('\n')
        .map((l) => l.trim())
        .find((l) => /exercise\s+\d+[-\.]\d+/i.test(l) && l.length < 160) || section.title;
    steps.push(
      makeLesson({
        chapterId: section.chapterId,
        chapterTitle: section.chapterTitle,
        index: startIndex + steps.length,
        title: exerciseLine.slice(0, 110),
        stepType: 'guided_practice',
        explanation: sentencesOf(section.text).slice(0, 3).join(' ') || explanation.slice(0, 600),
        practiceTask: exerciseLine,
        question: `Do ${exerciseLine.replace(/^#+\s*/, '')}. Paste the code you wrote or the output you got.`,
        criteria: 'A passing answer shows they attempted this exercise and reports code or a concrete result.',
        text: section.text,
      }),
    );
  }
  return steps;
}

function instructionalChapters(chapters: ParsedChapter[]): ParsedChapter[] {
  return chapters.filter(
    (c) =>
      c.markdown.trim().length >= 120 &&
      !looksLikeHeadingCatalog(c.markdown) &&
      !isFrontMatter(c.title, c.markdown) &&
      !isExerciseDump(c.markdown),
  );
}

async function analyzeBook(
  chapters: ParsedChapter[],
): Promise<{ keep: Set<number>; intro: Set<number> } | null> {
  const packed = chapters
    .slice(0, 80)
    .map(
      (c, i) =>
        `${i + 1}. title=${JSON.stringify(c.title)}\npreview=${JSON.stringify(c.markdown.replace(/\s+/g, ' ').slice(0, 280))}`,
    )
    .join('\n');
  const raw = await openaiJsonCompletion({
    temperature: 0.1,
    system: BOOK_ANALYZER_SYSTEM,
    user: packed,
  });
  const parsed = parseJsonObject<{
    chapters?: Array<{ index?: number; role?: string; keep?: boolean }>;
  }>(raw);
  const rows = Array.isArray(parsed?.chapters) ? parsed!.chapters : [];
  if (!rows.length) return null;
  const keep = new Set<number>();
  const intro = new Set<number>();
  for (const row of rows) {
    const idx = Number(row.index) - 1;
    if (idx < 0 || idx >= chapters.length) continue;
    const role = String(row.role || '');
    const shouldKeep = row.keep !== false && (role === 'chapter' || role === 'introduction');
    if (!shouldKeep) continue;
    if (looksLikeHeadingCatalog(chapters[idx].markdown)) continue;
    keep.add(idx);
    if (role === 'introduction') intro.add(idx);
  }
  return keep.size ? { keep, intro } : null;
}

type LlmStep = {
  title?: string;
  step_type?: string;
  stepType?: string;
  explanation?: string;
  example?: string;
  question?: string;
  criteria?: string;
  ui_type?: string;
  language?: string;
  choices?: string[];
  correct_choice?: number | null;
  practice_task?: string;
  keypoints?: string[];
};

async function llmStepsForChapter(
  chapter: ParsedChapter,
  role: 'introduction' | 'chapter',
  startIndex: number,
): Promise<BuiltLesson[] | null> {
  const excerpt = explodeDashedHeadings(chapter.markdown).slice(0, 9000);
  if (looksLikeHeadingCatalog(excerpt) || excerpt.length < 120) return [];
  const architect = await openaiJsonCompletion({
    temperature: 0.2,
    system: BOOK_ARCHITECT_SYSTEM,
    user: `CHAPTER: ${chapter.title}\nROLE: ${role}\n\n${excerpt.slice(0, 6000)}`,
  });
  const plan = parseJsonObject<{ units?: Array<{ title?: string; objective?: string; has_exercise?: boolean }> }>(
    architect,
  );
  const unitHint = Array.isArray(plan?.units)
    ? plan!.units
        .map((u) => `- ${u.title}: ${u.objective || ''}${u.has_exercise ? ' (has exercise now)' : ''}`)
        .join('\n')
    : '(derive units from the excerpt)';
  const raw = await openaiJsonCompletion({
    temperature: 0.4,
    system: BOOK_TUTOR_STEP_SYSTEM,
    user: `CHAPTER: ${chapter.title}
ROLE: ${role}
CURRICULUM UNITS:
${unitHint}

EXCERPT (teach only this):
${excerpt}`,
  });
  const parsed = parseJsonObject<{ steps?: LlmStep[] }>(raw);
  const items = Array.isArray(parsed?.steps) ? parsed!.steps : [];
  if (!items.length) return null;
  const out: BuiltLesson[] = [];
  for (const item of items) {
    const stepType = normalizeStepType(item.step_type || item.stepType, role === 'introduction' ? 'introduction' : 'explanation');
    const explanation = stripTutorMetaSpeak(String(item.explanation || '')).trim();
    if (explanation.length < 50 || looksLikeHeadingCatalog(explanation)) continue;
    const question = String(item.question || '').trim();
    if (looksLikeMainIdea(question) && stepType !== 'guided_practice') continue;
    const interaction = stepType === 'guided_practice' || stepType === 'assessment';
    if (interaction && (question.length < 8 || isExerciseDump(question))) continue;
    const example = stripTutorMetaSpeak(String(item.example || ''));
    const ui = String(item.ui_type || '') === 'code_editor' || String(item.ui_type || '') === 'multiple_choice' ? (item.ui_type as LessonUiType) : undefined;
    const lesson = makeLesson({
      chapterId: chapter.id,
      chapterTitle: chapter.title,
      index: startIndex + out.length,
      title: String(item.title || sectionTitle(explanation, chapter.title)),
      stepType,
      explanation,
      example: looksLikeHeadingCatalog(example) ? '' : example,
      question: interaction ? question : '',
      criteria: String(item.criteria || ''),
      practiceTask: String(item.practice_task || ''),
      text: excerpt,
    });
    if (ui) lesson.uiType = ui;
    if (Array.isArray(item.choices) && ui === 'multiple_choice') {
      lesson.choices = item.choices.map(String).filter(Boolean).slice(0, 6);
      const idx = Number(item.correct_choice);
      lesson.correctChoice = Number.isFinite(idx) ? Math.max(0, Math.min(lesson.choices.length - 1, idx)) : 0;
    }
    if (Array.isArray(item.keypoints)) {
      lesson.keypoints = item.keypoints
        .map(String)
        .filter((k) => k.length > 20 && !looksLikeHeadingCatalog(k) && !/\s-\s/.test(k))
        .slice(0, 4);
    }
    lesson.objective = '';
    out.push(lesson);
  }
  return out.length ? out : null;
}

const MAX_STEPS = 80;

export async function buildCurriculum(
  chapters: ParsedChapter[],
  opts?: { deadlineMs?: number; skipLlm?: boolean },
): Promise<{
  lessons: BuiltLesson[];
  engine: 'llm' | 'heuristic' | 'mixed';
}> {
  const pool = instructionalChapters(chapters);
  if (!pool.length) return { lessons: [], engine: 'heuristic' };

  let keepIdx: number[] = pool.map((_, i) => i);
  const introIdx = new Set<number>();
  const useLlm = !opts?.skipLlm && isLLMConfigured();
  const deadline = opts?.deadlineMs || Date.now() + 150_000;

  if (useLlm && Date.now() < deadline - 12_000) {
    try {
      const analyzed = await analyzeBook(pool);
      if (analyzed) {
        keepIdx = [...analyzed.keep].sort((a, b) => a - b);
        analyzed.intro.forEach((i) => introIdx.add(i));
      }
    } catch (err) {
      console.error('book analyzer failed:', err);
    }
  }

  const selected = keepIdx.map((i) => pool[i]).filter(Boolean);
  const chaptersToTeach = selected.length ? selected : pool;
  const lessons: BuiltLesson[] = [];
  let llmChapters = 0;
  let heuristicChapters = 0;

  for (let i = 0; i < chaptersToTeach.length && lessons.length < MAX_STEPS; i++) {
    const chapter = chaptersToTeach[i];
    const origIdx = pool.indexOf(chapter);
    const role: 'introduction' | 'chapter' =
      introIdx.has(origIdx) || looksLikeWelcome(chapter.title, chapter.markdown) ? 'introduction' : 'chapter';
    const timeLeft = deadline - Date.now();
    let made: BuiltLesson[] | null = null;
    if (useLlm && timeLeft > 14_000 && llmChapters < 18) {
      try {
        made = await llmStepsForChapter(chapter, role, lessons.length);
        if (made?.length) llmChapters += 1;
      } catch (err) {
        console.error('book tutor chapter steps failed:', err);
      }
    }
    if (!made?.length) {
      const sections = sectionsFromChapter(chapter, role);
      made = sections.flatMap((section) => heuristicStepsForSection(section, lessons.length));
      if (made.length) heuristicChapters += 1;
    }
    for (const lesson of made || []) {
      if (lessons.length >= MAX_STEPS) break;
      if (looksLikeHeadingCatalog(lesson.explanation)) continue;
      lesson.sortOrder = lessons.length;
      lesson.id = `${lesson.chapterId}_${lessons.length + 1}`;
      lessons.push(lesson);
    }
  }

  const engine = llmChapters && heuristicChapters ? 'mixed' : llmChapters ? 'llm' : 'heuristic';
  return { lessons, engine };
}
