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
export const BOOK_TUTOR_MAX_CHAPTERS = 240;
/** In-memory cap per chapter while generating lessons — never persisted. */
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
    const first = starts[0];
    if (first > 0) {
      const intro = lines.slice(0, first).join('\n').trim();
      if (intro.length > 80) {
        chapters.push({
          id: slugChapter(0),
          title: firstTitle(intro, 'Introduction'),
          markdown: intro.slice(0, BOOK_TUTOR_CHAPTER_CHARS),
        });
      }
    }
    starts.forEach((start, idx) => {
      const end = starts[idx + 1] ?? lines.length;
      const body = lines.slice(start, end).join('\n').trim();
      if (body.length < 40) return;
      const titleLine = lines[start].replace(/^#+\s*/, '').trim();
      chapters.push({
        id: slugChapter(chapters.length),
        title: titleLine.slice(0, 120) || `Chapter ${chapters.length + 1}`,
        markdown: body.slice(0, BOOK_TUTOR_CHAPTER_CHARS),
      });
    });
    if (chapters.length) return mergeChapters(chapters, BOOK_TUTOR_MAX_CHAPTERS);
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
    chunks.push({
      id: slugChapter(n),
      title: firstTitle(markdown, `${fallbackTitle} · part ${n + 1}`),
      markdown: markdown.slice(0, BOOK_TUTOR_CHAPTER_CHARS),
    });
    n += 1;
    buf = '';
  };
  for (const p of paras) {
    if ((buf + '\n\n' + p).length > 2200 && buf.length > 400) flush();
    buf = buf ? `${buf}\n\n${p}` : p;
  }
  flush();
  if (!chunks.length) {
    return [{ id: 'ch_1', title: fallbackTitle, markdown: text.slice(0, BOOK_TUTOR_CHAPTER_CHARS) }];
  }
  return mergeChapters(chunks, BOOK_TUTOR_MAX_CHAPTERS);
}

/** Keep coverage across a long book instead of merging then truncating (which threw 600-page text away). */
function thinChapters(chapters: ParsedChapter[], max: number): ParsedChapter[] {
  if (chapters.length <= max) return chapters;
  const out: ParsedChapter[] = [];
  const seen = new Set<number>();
  for (let i = 0; i < max; i++) {
    const idx = Math.round((i * (chapters.length - 1)) / Math.max(1, max - 1));
    if (seen.has(idx)) continue;
    seen.add(idx);
    const ch = chapters[idx];
    out.push({
      id: slugChapter(out.length),
      title: ch.title,
      markdown: ch.markdown.slice(0, BOOK_TUTOR_CHAPTER_CHARS),
    });
  }
  return out;
}

function mergeChapters(chapters: ParsedChapter[], max: number): ParsedChapter[] {
  return thinChapters(chapters, max);
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

  for (const rawPage of pages) {
    const page = String(rawPage || '').trim();
    if (!page) continue;
    const firstLine = page.split('\n').map((l) => l.trim()).find(Boolean) || '';
    const isHead = CHAPTER_HEADING.test(firstLine) && firstLine.length < 160;
    if (isHead && buf.length > 400) flush();
    if (isHead && !title) title = firstLine.replace(/^#+\s*/, '');
    buf = buf ? `${buf}\n\n${page}` : page;
    if (buf.length > BOOK_TUTOR_CHAPTER_CHARS) flush();
  }
  flush();
  if (!chapters.length) {
    const nonempty = pages.filter((p) => p && p.trim().length > 80);
    if (!nonempty.length) return [];
    return mergeChapters(
      nonempty.slice(0, BOOK_TUTOR_MAX_CHAPTERS).map((markdown, i) => ({
        id: slugChapter(i),
        title: firstTitle(markdown, `${fallbackTitle} · ${i + 1}`),
        markdown: markdown.slice(0, BOOK_TUTOR_CHAPTER_CHARS),
      })),
      BOOK_TUTOR_MAX_CHAPTERS,
    );
  }
  return mergeChapters(chapters, BOOK_TUTOR_MAX_CHAPTERS);
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

/** Trust magic bytes — Amazon often sends an EPUB named .pdf or a zip without an extension. */
function sniffKind(filename: string, mime: string, buf: Buffer): string {
  if (looksLikeKindle(buf, filename)) {
    throw new Error(
      'This looks like a locked Kindle file (.azw / .mobi / KFX). Book tutor cannot read DRM. In Amazon use “Download EPUB” or a text PDF you can select text in.',
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
  const pdf = (await getDocumentProxy(shared, {
    disableAutoFetch: true,
    disableStream: true,
    isEvalSupported: false,
    useSystemFonts: true,
  })) as {
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
      'This EPUB is locked (Kindle / Adobe DRM). Book tutor needs an unlocked EPUB or a text PDF you can select text in.',
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
        'This looks like a scanned / image PDF (common with Amazon “print replica”). Book tutor needs selectable text — download the EPUB or a text PDF.',
      );
    }
    if (extractedChars < 400) {
      throw new Error('Hardly any text came out of that PDF. If it is an Amazon print replica, try the EPUB instead.');
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
      'Use a PDF, EPUB, DOCX, Markdown, or .txt file. Kindle .azw / .mobi files are not readable (DRM).',
    );
  }

  if (!chapters.length) throw new Error('Could not extract enough text from that file.');

  return {
    title: firstTitle(chapters[0]?.markdown || fallbackTitle, fallbackTitle),
    chapters,
    charCount: extractedChars,
    pageHint,
  };
}
