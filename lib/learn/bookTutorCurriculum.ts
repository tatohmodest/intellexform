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
    for (const piece of splitSectionText(text)) {
      out.push({
        chapterId: chapter.id,
        chapterTitle: chapter.title,
        title: sectionTitle(piece, chapter.title),
        text: piece,
        role,
      });
    }
  }
  return out;
}

function splitSectionText(text: string, max = 6000): string[] {
  const trimmed = text.trim();
  if (trimmed.length <= max) return [trimmed];
  const out: string[] = [];
  let remaining = trimmed;
  while (remaining.length > 80) {
    if (remaining.length <= max) {
      out.push(remaining);
      break;
    }
    let cut = remaining.lastIndexOf('\n\n', max);
    if (cut < max * 0.4) cut = remaining.lastIndexOf('. ', max);
    if (cut < max * 0.4) cut = max;
    out.push(remaining.slice(0, cut + 1).trim());
    remaining = remaining.slice(cut + 1).trim();
  }
  return out.filter((s) => s.length >= 80);
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
  const paras = explodeDashedHeadings(section.text)
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter((p) => p.length > 40 && !looksLikeHeadingCatalog(p) && !isExerciseDump(p));
  const bodies =
    paras.length <= 4 || section.text.length < 2500
      ? [explanation]
      : Array.from({ length: Math.ceil(paras.length / 3) }, (_, i) =>
          stripTutorMetaSpeak(paras.slice(i * 3, i * 3 + 3).join('\n\n')).slice(0, 2800),
        ).filter((body) => body.length >= 80);
  const groups = bodies.length ? bodies : [explanation];
  groups.forEach((body, gi) => {
    steps.push(
      makeLesson({
        chapterId: section.chapterId,
        chapterTitle: section.chapterTitle,
        index: startIndex + steps.length,
        title: groups.length > 1 ? `${section.title} · ${gi + 1}` : section.title,
        stepType: gi === 0 && code ? 'example' : 'explanation',
        explanation: body,
        example: gi === 0 ? code : '',
        text: section.text,
      }),
    );
  });
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
      !isExerciseDump(c.markdown) &&
      !/^(?:#{1,3}\s+)?(?:contents(?: in detail)?|table of contents)\b/i.test(c.title.replace(/^#+\s*/, '').trim()),
  );
}

async function analyzeBook(
  chapters: ParsedChapter[],
): Promise<{ keep: Set<number>; intro: Set<number>; skip: Set<number> } | null> {
  const packed = chapters
    .map((c, i) => {
      const preview = JSON.stringify(c.markdown.replace(/\s+/g, ' ').slice(0, i < 240 ? 240 : 80));
      return `${i + 1}. title=${JSON.stringify(c.title)}\npreview=${preview}`;
    })
    .join('\n');
  const raw = await openaiJsonCompletion({
    temperature: 0.1,
    system: BOOK_ANALYZER_SYSTEM,
    user: `Classify every chapter listed. Do not omit later chapters. Instructional chapters stay keep=true.\n\n${packed}`,
  });
  const parsed = parseJsonObject<{
    chapters?: Array<{ index?: number; role?: string; keep?: boolean }>;
  }>(raw);
  const rows = Array.isArray(parsed?.chapters) ? parsed!.chapters : [];
  if (!rows.length) return null;
  const keep = new Set<number>();
  const intro = new Set<number>();
  const skip = new Set<number>();
  for (const row of rows) {
    const idx = Number(row.index) - 1;
    if (idx < 0 || idx >= chapters.length) continue;
    const role = String(row.role || '');
    const shouldKeep = row.keep !== false && (role === 'chapter' || role === 'introduction');
    if (!shouldKeep || looksLikeHeadingCatalog(chapters[idx].markdown)) {
      skip.add(idx);
      continue;
    }
    keep.add(idx);
    if (role === 'introduction') intro.add(idx);
  }
  return { keep, intro, skip };
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

async function llmStepsForSections(
  chapter: ParsedChapter,
  sections: SourceSection[],
  role: 'introduction' | 'chapter',
  startIndex: number,
): Promise<BuiltLesson[] | null> {
  const excerpt = sections.map((s) => `## ${s.title}\n${s.text}`).join('\n\n').slice(0, 9000);
  if (excerpt.length < 120 || looksLikeHeadingCatalog(excerpt)) return [];
  const unitHint = sections.map((s) => `- ${s.title}`).join('\n');
  const raw = await openaiJsonCompletion({
    temperature: 0.4,
    system: BOOK_TUTOR_STEP_SYSTEM,
    user: `CHAPTER: ${chapter.title}
ROLE: ${role}
CURRICULUM UNITS (cover each):
${unitHint}

EXCERPT (teach only this — do not skip later units):
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
    out.push(lesson);
  }
  return out.length ? out : null;
}

function packSections(sections: SourceSection[], maxChars = 7000, maxItems = 4): SourceSection[][] {
  const batches: SourceSection[][] = [];
  let cur: SourceSection[] = [];
  let size = 0;
  for (const section of sections) {
    if (cur.length && (size + section.text.length > maxChars || cur.length >= maxItems)) {
      batches.push(cur);
      cur = [];
      size = 0;
    }
    cur.push(section);
    size += section.text.length;
  }
  if (cur.length) batches.push(cur);
  return batches;
}

function unitCovered(unit: CurriculumUnitPlan, lessons: BuiltLesson[]): boolean {
  const blob = lessons.map((l) => `${l.title}\n${l.explanation}\n${l.practiceTask}`).join('\n').toLowerCase();
  const words = tokenize(unit.title).slice(0, 5);
  if (!words.length) return lessons.length > 0;
  const hits = words.filter((w) => blob.includes(w)).length;
  return hits >= Math.min(2, words.length);
}

export type CurriculumUnitPlan = { title: string; hasExercise: boolean; hasExample: boolean };

export type CurriculumChapterPlan = {
  id: string;
  title: string;
  role: 'introduction' | 'chapter';
  units: CurriculumUnitPlan[];
  status: 'pending' | 'complete' | 'incomplete';
  covered: number;
};

export async function planBookCurriculum(
  chapters: ParsedChapter[],
  opts?: { skipLlm?: boolean },
): Promise<{ chapters: ParsedChapter[]; plan: CurriculumChapterPlan[] }> {
  const pool = instructionalChapters(chapters);
  if (!pool.length) return { chapters: [], plan: [] };
  let keepIdx: number[] = pool.map((_, i) => i);
  const introIdx = new Set<number>();
  if (!opts?.skipLlm && isLLMConfigured()) {
    try {
      const analyzed = await analyzeBook(pool);
      if (analyzed) {
        keepIdx = pool.map((_, i) => i).filter((i) => !analyzed.skip.has(i));
        if (!keepIdx.length) keepIdx = pool.map((_, i) => i);
        analyzed.intro.forEach((i) => introIdx.add(i));
      }
    } catch (err) {
      console.error('book analyzer failed:', err);
    }
  }
  const selected = keepIdx.map((i) => pool[i]).filter(Boolean);
  const teach = selected.length ? selected : pool;
  const plan: CurriculumChapterPlan[] = teach.map((chapter) => {
    const origIdx = pool.indexOf(chapter);
    const role: 'introduction' | 'chapter' =
      introIdx.has(origIdx) || looksLikeWelcome(chapter.title, chapter.markdown) ? 'introduction' : 'chapter';
    const sections = sectionsFromChapter(chapter, role);
    const units = (sections.length ? sections : [{ title: chapter.title, text: chapter.markdown, chapterId: chapter.id, chapterTitle: chapter.title, role }]).map(
      (s) => ({
        title: s.title,
        hasExercise: isRealTryIt(s.text),
        hasExample: Boolean(extractCodeish(s.text)),
      }),
    );
    return { id: chapter.id, title: chapter.title, role, units, status: 'pending' as const, covered: 0 };
  });
  return { chapters: teach, plan };
}

export async function generateChapterSteps(opts: {
  chapter: ParsedChapter;
  plan: CurriculumChapterPlan;
  startIndex: number;
  skipLlm?: boolean;
}): Promise<{ lessons: BuiltLesson[]; plan: CurriculumChapterPlan; engine: 'llm' | 'heuristic' | 'mixed' }> {
  const role = opts.plan.role;
  const sections = sectionsFromChapter(opts.chapter, role);
  const usable = sections.length
    ? sections
    : [{ title: opts.chapter.title, text: opts.chapter.markdown, chapterId: opts.chapter.id, chapterTitle: opts.chapter.title, role }];
  const lessons: BuiltLesson[] = [];
  let llm = 0;
  let heuristic = 0;
  const useLlm = !opts.skipLlm && isLLMConfigured();
  for (const batch of packSections(usable)) {
    let made: BuiltLesson[] | null = null;
    if (useLlm) {
      try {
        made = await llmStepsForSections(opts.chapter, batch, role, opts.startIndex + lessons.length);
        if (made?.length) llm += 1;
      } catch (err) {
        console.error('book tutor chapter steps failed:', err);
      }
    }
    if (!made?.length) {
      made = batch.flatMap((section) => heuristicStepsForSection(section, opts.startIndex + lessons.length));
      if (made.length) heuristic += 1;
    }
    for (const lesson of made || []) {
      if (looksLikeHeadingCatalog(lesson.explanation)) continue;
      lesson.sortOrder = opts.startIndex + lessons.length;
      lesson.id = `${lesson.chapterId}_${opts.startIndex + lessons.length + 1}`;
      lessons.push(lesson);
    }
  }
  const missing = opts.plan.units.filter((u) => !unitCovered(u, lessons));
  for (const unit of missing) {
    const section = usable.find((s) => s.title === unit.title) || usable.find((s) => tokenize(unit.title).some((w) => s.title.toLowerCase().includes(w)));
    if (!section) continue;
    if (lessons.some((l) => l.title === section.title)) continue;
    const extra = heuristicStepsForSection(section, opts.startIndex + lessons.length);
    for (const lesson of extra) {
      lesson.sortOrder = opts.startIndex + lessons.length;
      lesson.id = `${lesson.chapterId}_${opts.startIndex + lessons.length + 1}`;
      lessons.push(lesson);
    }
    heuristic += extra.length ? 1 : 0;
  }
  const covered = opts.plan.units.filter((u) => unitCovered(u, lessons)).length;
  const plan: CurriculumChapterPlan = {
    ...opts.plan,
    covered,
    status:
      lessons.length && (opts.plan.units.length === 0 || covered >= opts.plan.units.length)
        ? 'complete'
        : lessons.length
          ? 'incomplete'
          : 'incomplete',
  };
  if (lessons.length && !opts.plan.units.length) plan.status = 'complete';
  const engine = llm && heuristic ? 'mixed' : llm ? 'llm' : 'heuristic';
  return { lessons, plan, engine };
}

export async function buildCurriculum(
  chapters: ParsedChapter[],
  opts?: { deadlineMs?: number; skipLlm?: boolean },
): Promise<{
  lessons: BuiltLesson[];
  engine: 'llm' | 'heuristic' | 'mixed';
  plan: CurriculumChapterPlan[];
}> {
  const { chapters: teach, plan } = await planBookCurriculum(chapters, { skipLlm: opts?.skipLlm });
  if (!teach.length) return { lessons: [], engine: 'heuristic', plan: [] };
  const lessons: BuiltLesson[] = [];
  let llm = 0;
  let heuristic = 0;
  const updated: CurriculumChapterPlan[] = [];
  for (let i = 0; i < teach.length; i++) {
    const chapter = teach[i];
    const { lessons: made, plan: next, engine } = await generateChapterSteps({
      chapter,
      plan: plan[i],
      startIndex: lessons.length,
      skipLlm: opts?.skipLlm,
    });
    if (engine === 'llm') llm += 1;
    else if (engine === 'heuristic') heuristic += 1;
    else {
      llm += 1;
      heuristic += 1;
    }
    lessons.push(...made);
    updated.push(next);
  }
  const engine = llm && heuristic ? 'mixed' : llm ? 'llm' : 'heuristic';
  return { lessons, engine, plan: updated };
}
