/**
 * Turn parsed chapters into a varied tutor path.
 * Batches LLM calls so a whole book is not stuck at six identical "main idea" steps.
 */

import { isLLMConfigured } from '@/lib/learn/tutor';
import { openaiJsonCompletion, parseJsonObject } from '@/lib/learn/openaiJson';
import type { ParsedChapter } from '@/lib/learn/bookParse';

export type LessonKind = 'teach' | 'practice';

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
};

const PRACTICE_RE =
  /\b(try (this|it|the)|your turn|exercise\b|download\b|install\b|run (this|the|it)|open (the|your)|paste |type this|click |go to https?:\/\/|visit https?:\/\/|do the following|homework|practice:|challenge:|lab\b|experiment:)\b/i;

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
  const target = clamp(Math.max(chapters.length, Math.round(chars / 1400) || 12), 8, 72);
  let size = 1400;
  let raw = collect(size);
  while (raw.length < Math.min(target, 18) && size > 420) {
    size -= 200;
    raw = collect(size);
  }
  if (!raw.length) return [];
  if (raw.length <= 72) return raw;
  const group = Math.ceil(raw.length / 72);
  const merged: SourceUnit[] = [];
  for (let i = 0; i < raw.length; i += group) {
    const slice = raw.slice(i, i + group);
    merged.push({
      chapterId: slice[0].chapterId,
      chapterTitle: slice[0].chapterTitle,
      kind: slice.some((s) => s.kind === 'practice') ? 'practice' : 'teach',
      text: slice
        .map((s) => s.text)
        .join('\n\n')
        .slice(0, 2200),
    });
  }
  return merged.slice(0, 72);
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
    `## Why this matters`,
    `In **${unit.chapterTitle}**, the move is **${topic}** — not a slogan. The book’s claim, in one line: ${lead}`,
    `## How it works`,
    rest || `Keep **${topic}** distinct from **${other}**. If you mix them, the rest of this stretch stops making sense.`,
    code,
    `## Tutor take`,
    `If you can use **${topic}** on a tiny case without looking back, you understood this page. **${other}** is the thing sitting beside it — name both.`,
  ]
    .filter(Boolean)
    .join('\n\n');
}

function ensureStyledExplanation(text: string, title: string): string {
  const trimmed = text.trim();
  if (/^##\s/m.test(trimmed)) return trimmed;
  const parts = trimmed.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);
  if (parts.length >= 2) {
    return `## Why this matters\n\n${parts[0]}\n\n## How it works\n\n${parts.slice(1).join('\n\n')}`;
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
  return {
    id: `${unit.chapterId}_${index + 1}`,
    chapterId: unit.chapterId,
    chapterTitle: unit.chapterTitle,
    sortOrder: index,
    title,
    kind: unit.kind,
    explanation: tutorExplanation(unit, kws),
    example: inventedExample(unit.text, kws, index, unit.chapterTitle),
    keypoints: keypointsFrom(unit.text, kws),
    practiceTask: unit.kind === 'practice' ? practiceTaskFrom(unit.text) : '',
    note: noteFrom(unit, kws),
    watchOut: watchOutFrom(unit.text, kws),
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
    system: `You are an InTelleX book tutor standing next to the learner. You teach THIS stretch as if you wrote a tutorial page for it.
Return JSON only: {"lessons":[...]}.
One lesson object per UNIT, same order, keys:
unit (number), title, kind ("teach"|"practice"), explanation, example, keypoints (3 short strings), practiceTask, question, criteria, keywords (3-8), note, watchOut.

Hard rules:
- You ARE the tutor. Teach in your own words. Do not dump the unit.
- explanation: markdown with ## Why this matters and ## How it works. Short paragraphs, a bullet list, and a fenced code block ONLY if the book is showing a command or snippet.
- example: invent a concrete worked illustration (named person, number, file, scene, or tiny snippet) from the ideas — even if the book gave none. Never say "hold onto these keywords". Never list keywords as the sample.
- note: one tutor aside (1-2 sentences).
- watchOut: the mix-up a beginner will make (1-2 sentences).
- question: unique to THIS unit and must mention a specific term from it. NEVER ask "what is the main idea of this section/chapter". Mix types: why it matters, invent an example, contrast two terms, apply it tomorrow, catch a mistake, teach-back.
- kind=practice ONLY when the book actually told the reader to try, download, install, run, open, or do a lab. Then practiceTask is numbered steps they must really do, and question asks them to paste the result/output/what they saw.
- If the book did not ask them to do a task, kind must be teach and practiceTask "".`,
    user: `Write one tutor lesson per unit. Each question in this batch must be different.\n\n${packed}`,
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
    out.push({
      id: `${unit.chapterId}_${startIndex + i + 1}`,
      chapterId: unit.chapterId,
      chapterTitle: unit.chapterTitle,
      sortOrder: startIndex + i,
      title: String(item.title || lessonTitle(unit, kws)).slice(0, 120),
      kind,
      explanation: ensureStyledExplanation(explanation, String(item.title || unit.chapterTitle)).slice(0, 3200),
      example: (looksLikeKeywordDump(exampleRaw) ? fallback.example : exampleRaw || fallback.example).slice(0, 1600),
      keypoints: Array.isArray(item.keypoints)
        ? item.keypoints.map(String).filter(Boolean).slice(0, 5)
        : fallback.keypoints,
      practiceTask: kind === 'practice' ? String(item.practiceTask || practiceTaskFrom(unit.text)).slice(0, 1200) : '',
      note: String(item.note || fallback.note).slice(0, 400),
      watchOut: String(item.watchOut || fallback.watchOut).slice(0, 400),
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
  return {
    ...lesson,
    sortOrder: index,
    question,
    example,
    explanation: ensureStyledExplanation(lesson.explanation, lesson.title),
    keypoints: lesson.keypoints.filter(Boolean).length ? lesson.keypoints : fallback.keypoints,
    note: lesson.note || fallback.note,
    watchOut: lesson.watchOut || fallback.watchOut,
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

export async function buildCurriculum(chapters: ParsedChapter[]): Promise<{
  lessons: BuiltLesson[];
  engine: 'llm' | 'heuristic' | 'mixed';
}> {
  const units = unitsFromChapters(chapters);
  if (!units.length) return { lessons: [], engine: 'heuristic' };

  const lessons: BuiltLesson[] = [];
  let llmBatches = 0;
  let heuristicCount = 0;
  const batchSize = 5;
  const llmBatchBudget = isLLMConfigured() ? 12 : 0;

  for (let i = 0; i < units.length; i += batchSize) {
    const batch = units.slice(i, i + batchSize);
    let made: BuiltLesson[] | null = null;
    if (llmBatches < llmBatchBudget) {
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

  const unique = dedupeQuestions(lessons).slice(0, 72);
  const engine = llmBatches && heuristicCount ? 'mixed' : llmBatches ? 'llm' : 'heuristic';
  return { lessons: unique, engine };
}
