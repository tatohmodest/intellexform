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

export const BOOK_TUTOR_MAX_BYTES = 12 * 1024 * 1024;
export const BOOK_TUTOR_MAX_CHARS = 220_000;

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
          markdown: intro.slice(0, 24_000),
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
        markdown: body.slice(0, 24_000),
      });
    });
    if (chapters.length) return chapters.slice(0, 40);
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
      markdown: markdown.slice(0, 24_000),
    });
    n += 1;
    buf = '';
  };
  for (const p of paras) {
    if ((buf + '\n\n' + p).length > 2200 && buf.length > 400) flush();
    buf = buf ? `${buf}\n\n${p}` : p;
  }
  flush();
  return chunks.length ? chunks.slice(0, 40) : [{ id: 'ch_1', title: fallbackTitle, markdown: text.slice(0, 24_000) }];
}

async function extractPdf(buffer: Buffer): Promise<{ text: string; pages: number }> {
  const { extractText, getDocumentProxy } = await import('unpdf');
  const pdf = await getDocumentProxy(new Uint8Array(buffer));
  const result = await extractText(pdf, { mergePages: false });
  const pages = Array.isArray(result.text) ? result.text : [String(result.text || '')];
  const text = pages
    .map((p, i) => `\n\n## Page ${i + 1}\n\n${p}`)
    .join('\n')
    .trim();
  return { text, pages: result.totalPages || pages.length };
}

async function extractDocx(buffer: Buffer): Promise<string> {
  const mammothMod = await import('mammoth');
  const mammoth = ('convertToHtml' in mammothMod ? mammothMod : mammothMod.default) as {
    convertToHtml: (input: { buffer: Buffer }) => Promise<{ value: string }>;
  };
  const result = await mammoth.convertToHtml({ buffer });
  return htmlToMarkdown(result.value || '');
}

function xmlAttr(xml: string, name: string): string | null {
  const m = xml.match(new RegExp(`${name}="([^"]+)"`));
  return m?.[1] || null;
}

async function extractEpub(buffer: Buffer): Promise<string> {
  const JSZip = (await import('jszip')).default;
  const zip = await JSZip.loadAsync(buffer);
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
    if (id && href) manifest.set(id, decodeURIComponent(href));
  }
  const spineIds: string[] = [];
  const spineRe = /<itemref\b[^>]*>/gi;
  let ref: RegExpExecArray | null;
  while ((ref = spineRe.exec(opf))) {
    const idref = xmlAttr(ref[0], 'idref');
    if (idref) spineIds.push(idref);
  }
  const parts: string[] = [];
  for (const id of spineIds.slice(0, 80)) {
    const href = manifest.get(id);
    if (!href) continue;
    const path = `${base}${href}`.replace(/\\/g, '/');
    const html = await zip.file(path)?.async('string');
    if (!html) continue;
    const md = htmlToMarkdown(html);
    if (md.length > 40) parts.push(md);
  }
  if (!parts.length) throw new Error('No readable chapters found in this EPUB.');
  return parts.join('\n\n');
}

function extOf(name: string, mime: string): string {
  const fromName = name.split('.').pop()?.toLowerCase() || '';
  if (['pdf', 'epub', 'docx', 'txt', 'md', 'markdown'].includes(fromName)) return fromName === 'markdown' ? 'md' : fromName;
  if (mime.includes('pdf')) return 'pdf';
  if (mime.includes('epub')) return 'epub';
  if (mime.includes('wordprocessingml') || mime.includes('msword')) return 'docx';
  if (mime.includes('markdown') || mime.includes('text/plain')) return 'txt';
  return fromName;
}

export async function parseBookFile(opts: {
  buffer: Buffer;
  filename: string;
  mime?: string;
  titleHint?: string;
}): Promise<ParsedBook> {
  if (opts.buffer.length > BOOK_TUTOR_MAX_BYTES) {
    throw new Error('File is too large. Upload a PDF, EPUB, DOCX, or text file under 12 MB.');
  }
  const ext = extOf(opts.filename, opts.mime || '');
  const fallbackTitle = (opts.titleHint || opts.filename.replace(/\.[^.]+$/, '') || 'Untitled book').slice(0, 120);

  let raw = '';
  let pageHint: number | undefined;
  if (ext === 'pdf') {
    const pdf = await extractPdf(opts.buffer);
    raw = pdf.text;
    pageHint = pdf.pages;
  } else if (ext === 'epub') {
    raw = await extractEpub(opts.buffer);
  } else if (ext === 'docx') {
    raw = await extractDocx(opts.buffer);
  } else if (ext === 'txt' || ext === 'md') {
    raw = opts.buffer.toString('utf8');
  } else {
    throw new Error('Use a PDF, EPUB, DOCX, Markdown, or .txt file.');
  }

  raw = raw.slice(0, BOOK_TUTOR_MAX_CHARS).trim();
  if (raw.length < 80) throw new Error('Could not extract enough text from that file.');

  const chapters = splitIntoChapters(raw, fallbackTitle);
  return {
    title: firstTitle(raw, fallbackTitle),
    chapters,
    charCount: chapters.reduce((n, c) => n + c.markdown.length, 0),
    pageHint,
  };
}
