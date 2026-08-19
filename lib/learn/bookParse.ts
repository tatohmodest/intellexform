/**
 * Local book ingestion. PDF/EPUB/DOCX/Markdown become chapter markdown
 * without calling an LLM — parsing is free of token cost.
 */

export type ParsedChapter = { id: string; title: string; markdown: string };

export type ParsedBook = {
  title: string;
  chapters: ParsedChapter[];
  charCount: number;
  pageHint?: number;
};

/** Original file is held in RAM only, then discarded. 80 MB covers most 4,000-page text PDFs. */
export const BOOK_TUTOR_MAX_BYTES = 80 * 1024 * 1024;
export const BOOK_TUTOR_MAX_PAGES = 4000;
export const BOOK_TUTOR_MAX_CHAPTERS = 800;
/** Split oversized chapters instead of dropping the tail. */
export const BOOK_TUTOR_CHAPTER_CHARS = 24_000;

const CHAPTER_HEADING =
  /^(?:#{1,2}\s+|(?:chapter|part|unit|section|lesson|module)\s+(?:\d+|[ivxlcdm]+)[.:)\s-]+|\d+\.\s+[A-Z])/i;

function decodeEntities(html: string): string {
  return html
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)));
}

export function htmlToMarkdown(html: string): string {
  const withHeads = html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<h1[^>]*>([\s\S]*?)<\/h1>/gi, '\n\n# $1\n\n')
    .replace(/<h2[^>]*>([\s\S]*?)<\/h2>/gi, '\n\n## $1\n\n')
    .replace(/<h3[^>]*>([\s\S]*?)<\/h3>/gi, '\n\n### $1\n\n')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<\/div>/gi, '\n')
    .replace(/<\/li>/gi, '\n')
    .replace(/<li[^>]*>/gi, '- ');
  const text = decodeEntities(withHeads.replace(/<[^>]+>/g, ' '));
  return text
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[ \t]{2,}/g, ' ')
    .trim();
}

function firstTitle(text: string, fallback: string): string {
  const line = text
    .split('\n')
    .map((l) => l.replace(/^#+\s*/, '').trim())
    .find((l) => l.length > 3 && l.length < 120);
  return (line || fallback).slice(0, 120);
}

function slugChapter(i: number): string {
  return `ch_${i + 1}`;
}

function splitLongChapter(title: string, body: string, startIndex: number): ParsedChapter[] {
  const text = body.trim();
  if (!text) return [];
  if (text.length <= BOOK_TUTOR_CHAPTER_CHARS) {
    return [{ id: slugChapter(startIndex), title: title.slice(0, 120), markdown: text }];
  }
  const out: ParsedChapter[] = [];
  let remaining = text;
  let part = 0;
  while (remaining.length > 80) {
    if (remaining.length <= BOOK_TUTOR_CHAPTER_CHARS) {
      out.push({
        id: slugChapter(startIndex + out.length),
        title: (part ? `${title} · ${part + 1}` : title).slice(0, 120),
        markdown: remaining,
      });
      break;
    }
    let cut = remaining.lastIndexOf('\n\n', BOOK_TUTOR_CHAPTER_CHARS);
    if (cut < BOOK_TUTOR_CHAPTER_CHARS * 0.45) cut = remaining.lastIndexOf('. ', BOOK_TUTOR_CHAPTER_CHARS);
    if (cut < BOOK_TUTOR_CHAPTER_CHARS * 0.45) cut = BOOK_TUTOR_CHAPTER_CHARS;
    out.push({
      id: slugChapter(startIndex + out.length),
      title: (part ? `${title} · ${part + 1}` : title).slice(0, 120),
      markdown: remaining.slice(0, cut + 1).trim(),
    });
    remaining = remaining.slice(cut + 1).trim();
    part += 1;
  }
  return out;
}

export function splitIntoChapters(raw: string, fallbackTitle = 'Book'): ParsedChapter[] {
  const text = raw.replace(/\r\n/g, '\n').trim();
  if (!text) return [];

  const lines = text.split('\n');
  const starts: number[] = [];
  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trim();
    if (!trimmed) continue;
    if (CHAPTER_HEADING.test(trimmed) && trimmed.length < 160) starts.push(i);
  }

  const useHeads = starts.length >= 2 && starts[0] < lines.length * 0.4;
  if (useHeads) {
    const chapters: ParsedChapter[] = [];
    starts.forEach((start, idx) => {
      const end = starts[idx + 1] ?? lines.length;
      const body = lines.slice(start, end).join('\n').trim();
      if (body.length < 40) return;
      const titleLine = lines[start].replace(/^#+\s*/, '').trim() || `Chapter ${chapters.length + 1}`;
      chapters.push(...splitLongChapter(titleLine.slice(0, 120), body, chapters.length));
    });
    if (chapters.length) return dropFrontMatter(mergeChapters(chapters, BOOK_TUTOR_MAX_CHAPTERS));
  }

  const chunks: ParsedChapter[] = [];
  const paras = text.split(/\n{2,}/);
  let buf = '';
  let n = 0;
  const flush = () => {
    const markdown = buf.trim();
    if (markdown.length < 60) {
      buf = '';
      return;
    }
    chunks.push(...splitLongChapter(firstTitle(markdown, `${fallbackTitle} · part ${n + 1}`), markdown, chunks.length));
    n = chunks.length;
    buf = '';
  };
  for (const p of paras) {
    if ((buf + '\n\n' + p).length > 2200 && buf.length > 400) flush();
    buf = buf ? `${buf}\n\n${p}` : p;
  }
  flush();
  if (!chunks.length) {
    return dropFrontMatter(splitLongChapter(fallbackTitle, text, 0));
  }
  return dropFrontMatter(mergeChapters(chunks, BOOK_TUTOR_MAX_CHAPTERS));
}

const FRONT_TITLE =
  /^(contents|table of contents|contents in detail|acknowledgments?|acknowledgements?|dedication|copyright|also by|about the author|about the authors|praise for|praise|list of (figures|tables|illustrations|maps)|credits|permissions|colophon|index|half[- ]title|title page|copyright page|published by|other (books|titles) by|by the same author|abstract|abstracts|version( history)?|revision history|changelog|what'?s new|errata)$/i;

const CORE_START =
  /^(?:#{1,3}\s+)?(?:chapter\s+(?:0*1|one|i)\b|part\s+(?:0*1|one|i)\b|lesson\s+0*1\b|unit\s+0*1\b|module\s+0*1\b|getting started\b|1\.\s+[A-Z])/i;

const BACK_TITLE =
  /^(?:#{1,3}\s+)?(?:index|bibliography|works cited|references|glossary|notes|colophon|about the (?:author|type|cover)|appendix(?:es)?(?:\s+[a-z0-9]+)?)\b/i;

const THANKS_BODY =
  /\b(thank(?:s| you)(?: to)?(?: my)? (?:wife|husband|spouse|partner|children|kids|son|daughter|parents?|family|mother|father|mom|dad|editor|agent|publisher|mentor)|dedicated to my|this book (?:is|would (?:not|never) have been) possible without|i (?:would like to |want to )?thank my)\b/i;

function letterCount(text: string): number {
  return (text.match(/[A-Za-zÀ-ÿ]/g) || []).length;
}

/** Image TOC / thanks pages often extract as almost no selectable text. */
function looksLikeSparseExtract(text: string): boolean {
  return letterCount(text) < 90 && text.length < 800;
}

function looksLikeContentsList(text: string): boolean {
  const head = text.slice(0, 400).toLowerCase();
  const lines = text
    .split('\n')
    .map((l) => l.replace(/^#+\s*/, '').trim())
    .filter((l) => l.length > 2);
  const numbered = lines.filter((l) => /\.{2,}\s*\d+\s*$/.test(l) || /\s+\d{1,3}$/.test(l)).length;
  if (/\btable of contents\b|^contents\b/im.test(head) && (text.length < 2800 || numbered >= 4)) return true;
  if (lines.length < 6) return false;
  return numbered >= Math.max(6, Math.floor(lines.length * 0.4));
}

const FRONT_TOKEN =
  /\b(praise for|title page|copyright|dedication|about the author|preface|acknowledgments?|acknowledgements?|contents in detail|table of contents|isbn|published by|half[- ]title)\b/i;

function proseSentenceCount(text: string): number {
  return (text.match(/[A-Za-z][^.!?\n]{40,}[.!?]/g) || []).filter(
    (s) => !FRONT_TOKEN.test(s) && !/^\s*exercise\s+\d/i.test(s),
  ).length;
}

/** TOC / outline dumps: "Praise - Title Page - Copyright - Chapter 3 - Exercise 2-11…" */
export function looksLikeHeadingCatalog(text: string): boolean {
  const compact = text.replace(/\s+/g, ' ').trim();
  if (!compact) return true;
  const dashParts = compact
    .split(/\s*[-–—]{1,3}\s*/)
    .map((s) => s.trim())
    .filter((s) => s.length > 1 && s.length < 90);
  const frontHits = (compact.match(new RegExp(FRONT_TOKEN.source, 'gi')) || []).length;
  const structHits = (compact.match(/\b(chapter\s+\d+|exercise\s+\d+[-\.]\d+|part\s+[ivx\d]+)\b/gi) || []).length;
  const prose = proseSentenceCount(text);
  if (dashParts.length >= 6 && frontHits + structHits >= 4 && prose < 2) return true;
  if (frontHits >= 3 && structHits >= 2 && compact.length < 2800 && prose < 3) return true;
  if (structHits >= 6 && prose < 3) return true;
  const lines = text
    .split(/\n+/)
    .map((l) => l.replace(/^#+\s*/, '').replace(/\.{2,}\s*\d+\s*$/, '').trim())
    .filter((l) => l.length > 2);
  if (lines.length >= 8) {
    const headingish = lines.filter(
      (l) =>
        l.length < 80 &&
        (FRONT_TOKEN.test(l) || /^(chapter|exercise|part|summary|introduction|who is this book)\b/i.test(l)),
    ).length;
    if (headingish / lines.length >= 0.45 && prose < 4) return true;
  }
  return false;
}

/** Turn "Title Page - Copyright - Chapter 1" blobs into lines so catalog detection can drop them. */
export function explodeDashedHeadings(text: string): string {
  return text
    .split(/\n{2,}/)
    .map((para) => {
      const parts = para.split(/\s+-\s+/).map((s) => s.trim()).filter(Boolean);
      const short = parts.filter((p) => p.length < 80);
      if (parts.length >= 6 && short.length >= 5) return parts.join('\n');
      return para;
    })
    .join('\n\n');
}

function looksLikeOrientKeep(title: string, text: string): boolean {
  const t = title.replace(/^#+\s*/, '').replace(/\s+/g, ' ').trim();
  if (
    /^(welcome|introduction|intro|about this book|who this book is for|how to (use|read) this book|getting started|preface|foreword|prologue|to the reader|author'?s note)$/i.test(
      t,
    )
  ) {
    return !looksLikeThanks(t, text) && !looksLikeContentsList(text) && !looksLikeHeadingCatalog(text);
  }
  const head = text.slice(0, 1800).toLowerCase();
  return (
    /\b(welcome to (this|the) book|this book (is about|will (teach|show|help))|who this book is for|you (don'?t|do not) need to (be|know|have)|how to (use|read) this book)\b/.test(
      head,
    ) && !looksLikeThanks(t, text)
  );
}

function looksLikeThanks(title: string, text: string): boolean {
  const t = title.toLowerCase();
  const head = text.slice(0, 1400);
  return (
    /acknowledgments?|acknowledgements?|thank(s| you) to (my|the)|gratitude to|^dedication$/.test(t) ||
    THANKS_BODY.test(head) ||
    (/^\s*(acknowledgments?|acknowledgements?|thanks to my|i (would like to )?thank my)/i.test(head) && text.length < 8000)
  );
}

function looksLikeCoreStart(title: string): boolean {
  const t = title.replace(/^#+\s*/, '').replace(/\s+/g, ' ').trim();
  return CORE_START.test(t);
}

function looksLikeBackMatter(title: string): boolean {
  const t = title.replace(/^#+\s*/, '').replace(/\s+/g, ' ').trim();
  return BACK_TITLE.test(t) || /^index$/i.test(t);
}

function stripJunkParagraphs(markdown: string): string {
  const exploded = explodeDashedHeadings(markdown);
  const paras = exploded.split(/\n{2,}/);
  const kept = paras.filter((p) => {
    const t = p.replace(/^#+\s*/, '').trim();
    if (!t) return false;
    if (looksLikeHeadingCatalog(p)) return false;
    if (THANKS_BODY.test(p) && p.length < 3500) return false;
    if (FRONT_TITLE.test(firstTitle(p, '')) && p.length < 3500) return false;
    return true;
  });
  return kept.join('\n\n').trim();
}

/** Skip TOC, thanks, copyright, image openings, and other pages that are not the book teaching. */
export function isFrontMatter(title: string, text: string): boolean {
  const t = title.replace(/^#+\s*/, '').replace(/\s+/g, ' ').trim();
  if (!text.trim()) return true;
  if (looksLikeSparseExtract(text) && /contents|acknowledg|copyright|dedication|praise|title/i.test(t || text.slice(0, 200))) {
    return true;
  }
  if (FRONT_TITLE.test(t) || BACK_TITLE.test(t)) return true;
  if (
    /^(table of contents|contents in detail|acknowledg?e?ments?|copyright page|about the authors?)\b/i.test(t) ||
    /\blist of (figures|tables|illustrations)\b/i.test(t)
  ) {
    return true;
  }
  if (/^contents\b/i.test(t) && t.length < 64) return true;
  if (looksLikeThanks(t, text)) return true;
  if (looksLikeContentsList(text) || looksLikeHeadingCatalog(text)) return true;
  if (looksLikeOrientKeep(t, text)) return false;
  const head = text.slice(0, 500).toLowerCase();
  if (/\b(isbn|copyright ©|all rights reserved|printed in the|library of congress)\b/.test(head) && text.length < 3200) {
    return true;
  }
  return false;
}

/** Keep welcome/how-to-use stretches, then Chapter 1 onward. Drop TOC / thanks / copyright / version junk. */
export function keepInstructionalCore(chapters: ParsedChapter[]): ParsedChapter[] {
  if (!chapters.length) return chapters;
  const startIdx = chapters.findIndex((c) => looksLikeCoreStart(c.title) && !isFrontMatter(c.title, c.markdown));
  const before =
    startIdx > 0
      ? chapters
          .slice(0, startIdx)
          .filter((c) => !isFrontMatter(c.title, c.markdown) && !looksLikeBackMatter(c.title))
      : [];
  let slice = startIdx >= 0 ? [...before, ...chapters.slice(startIdx)] : chapters;
  if (startIdx < 0) {
    const firstReal = slice.findIndex((c) => !isFrontMatter(c.title, c.markdown) && !looksLikeBackMatter(c.title));
    if (firstReal > 0) slice = slice.slice(firstReal);
  }
  const backIdx = slice.findIndex((c, i) => i > 0 && looksLikeBackMatter(c.title));
  if (backIdx > 0) slice = slice.slice(0, backIdx);
  const kept = slice
    .map((c) => {
      const markdown = stripJunkParagraphs(c.markdown);
      return { ...c, title: markdown ? firstTitle(markdown, c.title) : c.title, markdown };
    })
    .filter((c) => c.markdown.trim().length >= 120 && !isFrontMatter(c.title, c.markdown) && !looksLikeBackMatter(c.title) && !looksLikeHeadingCatalog(c.markdown));
  if (!kept.length) {
    const fallback = chapters.filter(
      (c) =>
        c.markdown.trim().length >= 120 &&
        !looksLikeThanks(c.title, c.markdown) &&
        !looksLikeContentsList(c.markdown) &&
        !looksLikeHeadingCatalog(c.markdown) &&
        !FRONT_TITLE.test(c.title.replace(/^#+\s*/, '').replace(/\s+/g, ' ').trim()) &&
        !looksLikeBackMatter(c.title),
    );
    return fallback;
  }
  return kept;
}

/** Cut TOC / thanks / copyright blocks glued onto the start of chapter 1. */
function stripOpeningBlocks(markdown: string): string {
  let text = markdown.trim();
  for (let i = 0; i < 10; i++) {
    const next = text.search(
      /\n(?:#{1,3}\s+|(?:chapter|part|unit)\s+(?:\d+|[ivxlcdm]+)\b)/i,
    );
    const firstBlock = next > 80 ? text.slice(0, next) : text;
    const title = firstTitle(firstBlock, '');
    const skip =
      isFrontMatter(title, firstBlock) ||
      looksLikeContentsList(firstBlock) ||
      looksLikeSparseExtract(firstBlock);
    if (!skip) break;
    if (next < 80) {
      return isFrontMatter(title, text) || looksLikeContentsList(text) ? '' : text;
    }
    text = text.slice(next).trim();
  }
  return text;
}

function dropFrontMatter(chapters: ParsedChapter[]): ParsedChapter[] {
  const cleaned = chapters.map((c, i) => {
    const markdown = i < 12 ? stripJunkParagraphs(stripOpeningBlocks(c.markdown)) : stripJunkParagraphs(c.markdown);
    const title = markdown ? firstTitle(markdown, c.title) : c.title;
    return { ...c, title, markdown };
  });
  const core = keepInstructionalCore(cleaned);
  return core.filter((c) => c.markdown.trim().length >= 120 && !looksLikeHeadingCatalog(c.markdown));
}

function stripRunningHeaders(pages: string[]): string[] {
  const firstLines = pages
    .map((p) => (p.split('\n').find((l) => l.trim()) || '').trim())
    .filter((l) => l.length > 2 && l.length < 80);
  const counts = new Map<string, number>();
  for (const line of firstLines) counts.set(line.toLowerCase(), (counts.get(line.toLowerCase()) || 0) + 1);
  const repeated = new Set(
    [...counts.entries()]
      .filter(([, n]) => n >= Math.max(4, Math.floor(pages.length * 0.12)))
      .map(([line]) => line),
  );
  return pages.map((page) =>
    page
      .split('\n')
      .filter((line, i) => {
        const t = line.trim();
        if (i < 3 && /^\d+$/.test(t)) return false;
        if (i < 3 && repeated.has(t.toLowerCase())) return false;
        return true;
      })
      .join('\n')
      .trim(),
  );
}

const STRUCT_SPLIT =
  /(?=^(?:#{1,3}\s+)?(?:part\s+(?:\d+|[ivxlcdm]+)|chapter\s+\d+|introduction|getting started)\b)/gim;

function splitStructural(text: string, fallbackTitle: string): ParsedChapter[] {
  const prepared = explodeDashedHeadings(text).replace(/\r\n/g, '\n').trim();
  if (!prepared) return [];
  const parts = prepared
    .split(STRUCT_SPLIT)
    .map((s) => s.trim())
    .filter((s) => s.length > 80);
  if (parts.length < 2) return [];
  const chapters: ParsedChapter[] = [];
  for (const body of parts) {
    if (looksLikeHeadingCatalog(body) || looksLikeContentsList(body)) continue;
    const titleLine = body.split('\n').map((l) => l.replace(/^#+\s*/, '').trim()).find((l) => l.length > 3 && l.length < 120) || fallbackTitle;
    chapters.push(...splitLongChapter(titleLine.slice(0, 120), body, chapters.length));
  }
  return chapters;
}

export function bookTitleFrom(chapters: ParsedChapter[], fallback: string): string {
  const skip = /praise|copyright|dedication|title page|contents|acknowledg|about the author/i;
  for (const chapter of chapters) {
    const t = chapter.title.replace(/^#+\s*/, '').trim();
    if (t && !skip.test(t) && t.length > 4 && t.length < 90) return t.slice(0, 120);
  }
  return fallback.slice(0, 120);
}

function mergeChapters(chapters: ParsedChapter[], max: number): ParsedChapter[] {
  if (chapters.length <= max) {
    return chapters.map((c, i) => ({ ...c, id: slugChapter(i) }));
  }
  const per = Math.ceil(chapters.length / max);
  const out: ParsedChapter[] = [];
  for (let i = 0; i < chapters.length; i += per) {
    const group = chapters.slice(i, i + per);
    out.push(...splitLongChapter(group[0].title, group.map((g) => g.markdown).join('\n\n'), out.length));
  }
  return out.map((c, i) => ({ ...c, id: slugChapter(i) }));
}

function flushSized(buf: string, title: string, fallbackTitle: string, n: number): { chapter: ParsedChapter | null; rest: string } {
  const markdown = buf.trim();
  if (markdown.length < 80) return { chapter: null, rest: '' };
  if (markdown.length <= BOOK_TUTOR_CHAPTER_CHARS) {
    return {
      chapter: {
        id: slugChapter(n),
        title: (title || firstTitle(markdown, `${fallbackTitle} · ${n + 1}`)).slice(0, 120),
        markdown,
      },
      rest: '',
    };
  }
  let cut = markdown.lastIndexOf('\n\n', BOOK_TUTOR_CHAPTER_CHARS);
  if (cut < BOOK_TUTOR_CHAPTER_CHARS * 0.55) cut = markdown.lastIndexOf('. ', BOOK_TUTOR_CHAPTER_CHARS);
  if (cut < BOOK_TUTOR_CHAPTER_CHARS * 0.55) cut = BOOK_TUTOR_CHAPTER_CHARS;
  return {
    chapter: {
      id: slugChapter(n),
      title: (title || firstTitle(markdown, `${fallbackTitle} · ${n + 1}`)).slice(0, 120),
      markdown: markdown.slice(0, cut + 1).trim(),
    },
    rest: markdown.slice(cut + 1).trim(),
  };
}

/** Build chapters from PDF pages without concatenating the whole book into one string. */
export function chaptersFromPages(pages: string[], fallbackTitle: string): ParsedChapter[] {
  const cleanedPages = stripRunningHeaders(pages).filter((page) => {
    const t = String(page || '').trim();
    if (!t || looksLikeSparseExtract(t)) return false;
    if (looksLikeHeadingCatalog(t) || looksLikeContentsList(t)) return false;
    return true;
  });
  const joined = cleanedPages.join('\n\n');
  const structured = splitStructural(joined, fallbackTitle);
  if (structured.length) return dropFrontMatter(mergeChapters(structured, BOOK_TUTOR_MAX_CHAPTERS));

  const chapters: ParsedChapter[] = [];
  let title = '';
  let buf = '';

  const flush = () => {
    let rest = buf;
    let heading = title;
    buf = '';
    title = '';
    while (rest.trim().length >= 80) {
      const next = flushSized(rest, heading, fallbackTitle, chapters.length);
      if (next.chapter) chapters.push(next.chapter);
      rest = next.rest;
      heading = '';
      if (!next.chapter) break;
    }
    if (rest.trim().length) buf = rest;
  };

  const sourcePages = cleanedPages.length ? cleanedPages : pages;
  for (const rawPage of sourcePages) {
    const page = String(rawPage || '').trim();
    if (!page || looksLikeSparseExtract(page) || looksLikeHeadingCatalog(page) || looksLikeContentsList(page)) continue;
    const firstLine = page.split('\n').map((l) => l.trim()).find(Boolean) || '';
    const isHead = CHAPTER_HEADING.test(firstLine) && firstLine.length < 160;
    if (isHead && buf.length > 400) flush();
    if (isHead && !title) title = firstLine.replace(/^#+\s*/, '');
    buf = buf ? `${buf}\n\n${page}` : page;
    if (buf.length > BOOK_TUTOR_CHAPTER_CHARS) flush();
  }
  flush();
  if (!chapters.length) {
    const nonempty = sourcePages.filter((p) => p && p.trim().length > 80 && !looksLikeHeadingCatalog(p));
    if (!nonempty.length) return [];
    const fromPages: ParsedChapter[] = [];
    for (const markdown of nonempty) {
      fromPages.push(
        ...splitLongChapter(firstTitle(markdown, `${fallbackTitle} · ${fromPages.length + 1}`), markdown, fromPages.length),
      );
    }
    return dropFrontMatter(mergeChapters(fromPages, BOOK_TUTOR_MAX_CHAPTERS));
  }
  return dropFrontMatter(mergeChapters(chapters, BOOK_TUTOR_MAX_CHAPTERS));
}

type PdfTextItem = { str?: string; hasEOL?: boolean };

function extOf(name: string, mime: string): string {
  const fromName = name.split('.').pop()?.toLowerCase() || '';
  if (['pdf', 'epub', 'docx', 'txt', 'md', 'markdown'].includes(fromName)) return fromName === 'markdown' ? 'md' : fromName;
  if (mime.includes('pdf')) return 'pdf';
  if (mime.includes('epub')) return 'epub';
  if (mime.includes('wordprocessingml') || mime.includes('msword')) return 'docx';
  if (mime.includes('markdown') || mime.includes('text/plain')) return 'txt';
  return fromName;
}

function looksLikeKindle(buf: Buffer, filename: string): boolean {
  const name = filename.toLowerCase();
  if (/\.(azw|azw3|kfx|mobi|prc)$/i.test(name)) return true;
  const head = buf.subarray(0, 72).toString('latin1');
  return head.includes('BOOKMOBI') || head.startsWith('TPZ') || head.includes('KINDLE');
}

/** Trust magic bytes — some stores send an EPUB named .pdf or a zip without an extension. */
function sniffKind(filename: string, mime: string, buf: Buffer): string {
  if (looksLikeKindle(buf, filename)) {
    throw new Error(
      'This looks like a locked ebook (.azw / .mobi / KFX). Book tutor cannot read DRM. Use an unlocked EPUB or a PDF you can select text in.',
    );
  }
  if (buf.length >= 5 && buf[0] === 0x25 && buf[1] === 0x50 && buf[2] === 0x44 && buf[3] === 0x46) return 'pdf';
  if (buf.length >= 2 && buf[0] === 0x50 && buf[1] === 0x4b) {
    const probe = buf.subarray(0, Math.min(buf.length, 16_000)).toString('latin1');
    if (probe.includes('word/')) return 'docx';
    if (probe.includes('META-INF') || probe.includes('epub') || probe.includes('mimetype')) return 'epub';
    return extOf(filename, mime) === 'docx' ? 'docx' : 'epub';
  }
  return extOf(filename, mime);
}

async function extractPdfPages(buffer: Buffer): Promise<{ pages: string[]; totalPages: number }> {
  const { getDocumentProxy } = await import('unpdf');
  const shared = new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength);
  const pdf = (await getDocumentProxy(shared)) as {
    numPages: number;
    getPage: (n: number) => Promise<{
      getTextContent: () => Promise<{ items: PdfTextItem[] }>;
      cleanup: () => void;
    }>;
    destroy?: () => Promise<unknown>;
    cleanup?: () => Promise<unknown>;
  };
  const totalPages = Number(pdf.numPages || 0);
  const pages: string[] = [];
  try {
    for (let n = 1; n <= totalPages; n++) {
      try {
        const page = await pdf.getPage(n);
        try {
          const content = await page.getTextContent();
          const text = (content.items as PdfTextItem[])
            .map((item) => (item.str || '') + (item.hasEOL ? '\n' : ''))
            .join('')
            .replace(/[ \t]+\n/g, '\n')
            .trim();
          pages.push(text);
        } finally {
          page.cleanup();
        }
      } catch (err) {
        console.warn('book tutor skipped PDF page', n, err);
        pages.push('');
      }
    }
  } finally {
    await pdf.destroy?.().catch(() => {});
    await pdf.cleanup?.().catch(() => {});
  }
  return { pages, totalPages };
}

async function extractDocx(buffer: Buffer): Promise<string> {
  const mammothMod = (await import('mammoth')) as unknown as {
    convertToHtml?: (input: { buffer: Buffer }) => Promise<{ value: string }>;
    default?: { convertToHtml: (input: { buffer: Buffer }) => Promise<{ value: string }> };
  };
  const convert = mammothMod.convertToHtml || mammothMod.default?.convertToHtml;
  if (!convert) throw new Error('Could not read this Word document.');
  const result = await convert({ buffer });
  return htmlToMarkdown(result.value || '');
}

function xmlAttr(xml: string, name: string): string | null {
  const m = xml.match(new RegExp(`${name}="([^"]+)"`));
  return m?.[1] || null;
}

async function extractEpubChapters(buffer: Buffer): Promise<string[]> {
  const JSZip = (await import('jszip')).default;
  const zip = await JSZip.loadAsync(buffer);
  if (zip.file('META-INF/encryption.xml')) {
    throw new Error(
      'This EPUB is locked (DRM). Book tutor needs an unlocked EPUB or a PDF you can select text in.',
    );
  }
  const container = await zip.file('META-INF/container.xml')?.async('string');
  if (!container) throw new Error('This EPUB is missing META-INF/container.xml.');
  const rootPath = xmlAttr(container, 'full-path');
  if (!rootPath) throw new Error('Could not find the EPUB package file.');
  const opf = await zip.file(rootPath)?.async('string');
  if (!opf) throw new Error('Could not read the EPUB package file.');
  const base = rootPath.includes('/') ? rootPath.slice(0, rootPath.lastIndexOf('/') + 1) : '';
  const manifest = new Map<string, string>();
  const itemRe = /<item\b[^>]*>/gi;
  let item: RegExpExecArray | null;
  while ((item = itemRe.exec(opf))) {
    const tag = item[0];
    const id = xmlAttr(tag, 'id');
    const href = xmlAttr(tag, 'href');
    if (id && href) manifest.set(id, decodeURIComponent(href.replace(/\\/g, '/')));
  }
  const spineIds: string[] = [];
  const spineRe = /<itemref\b[^>]*>/gi;
  let ref: RegExpExecArray | null;
  while ((ref = spineRe.exec(opf))) {
    const idref = xmlAttr(ref[0], 'idref');
    if (idref) spineIds.push(idref);
  }
  const parts: string[] = [];
  for (const id of spineIds.slice(0, 1600)) {
    const href = manifest.get(id);
    if (!href) continue;
    if (/\.(css|jpg|jpeg|png|gif|svg|woff2?|ttf|otf|ncx|mp3|mp4)$/i.test(href)) continue;
    const path = `${base}${href}`.replace(/\\/g, '/').replace(/^\//, '');
    const file = zip.file(path) || zip.file(decodeURIComponent(path));
    if (!file) continue;
    const html = await file.async('string');
    const md = htmlToMarkdown(html);
    if (md.length > 40) parts.push(md);
  }
  if (!parts.length) throw new Error('No readable chapters found in this EPUB.');
  return parts;
}

export async function parseBookFile(opts: {
  buffer: Buffer;
  filename: string;
  mime?: string;
  titleHint?: string;
}): Promise<ParsedBook> {
  if (opts.buffer.length > BOOK_TUTOR_MAX_BYTES) {
    throw new Error('File is too large. Use a text PDF, EPUB, DOCX, or text file under 80 MB.');
  }
  const ext = sniffKind(opts.filename, opts.mime || '', opts.buffer);
  const fallbackTitle = (opts.titleHint || opts.filename.replace(/\.[^.]+$/, '') || 'Untitled book').slice(0, 120);

  let chapters: ParsedChapter[] = [];
  let pageHint: number | undefined;
  let extractedChars = 0;

  if (ext === 'pdf') {
    const pdf = await extractPdfPages(opts.buffer);
    if (pdf.totalPages > BOOK_TUTOR_MAX_PAGES) {
      throw new Error(`This PDF has ${pdf.totalPages} pages. Book tutor can read up to ${BOOK_TUTOR_MAX_PAGES} pages.`);
    }
    extractedChars = pdf.pages.reduce((n, p) => n + p.length, 0);
    const denseEnough = extractedChars >= 8_000 || (pdf.totalPages > 0 && extractedChars >= pdf.totalPages * 12);
    if (pdf.totalPages > 60 && extractedChars < 4_000 && !denseEnough) {
      throw new Error(
        'This looks like a scanned / image PDF. Book tutor needs selectable text — try an EPUB or a PDF you can highlight.',
      );
    }
    if (extractedChars < 400) {
      throw new Error('Hardly any text came out of that PDF. Try an EPUB or a PDF you can select text in.');
    }
    pageHint = pdf.totalPages;
    chapters = chaptersFromPages(pdf.pages, fallbackTitle);
  } else if (ext === 'epub') {
    const parts = await extractEpubChapters(opts.buffer);
    extractedChars = parts.reduce((n, p) => n + p.length, 0);
    chapters = chaptersFromPages(parts, fallbackTitle);
  } else if (ext === 'docx') {
    const raw = await extractDocx(opts.buffer);
    extractedChars = raw.length;
    chapters = splitIntoChapters(raw, fallbackTitle);
  } else if (ext === 'txt' || ext === 'md') {
    const raw = opts.buffer.toString('utf8');
    extractedChars = raw.length;
    chapters = splitIntoChapters(raw, fallbackTitle);
  } else {
    throw new Error(
      'Use a PDF, EPUB, DOCX, Markdown, or .txt file. Locked ebook files (.azw / .mobi) are not readable.',
    );
  }

  if (!chapters.length) throw new Error('Could not extract enough teaching text from that file. Tables of contents and title pages are skipped.');

  return {
    title: bookTitleFrom(chapters, fallbackTitle),
    chapters,
    charCount: extractedChars,
    pageHint,
  };
}
