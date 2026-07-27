/**
 * Lightweight syntax highlighter for AI tutor + tutorial code blocks.
 * No heavy deps - token colors for JS/TSX/CSS/HTML/bash/json.
 */

export type HighlightToken = { text: string; className?: string };

const KEYWORDS =
  /\b(const|let|var|function|return|if|else|for|while|class|extends|import|from|export|default|async|await|try|catch|throw|new|typeof|instanceof|switch|case|break|continue|true|false|null|undefined|this|of|in|as|type|interface|enum|public|private|protected|static|void|number|string|boolean|any|React|useState|useEffect|useRef|useMemo|useCallback|props|children)\b/g;

const STRINGS = /(`(?:\\.|[^`])*`|'(?:\\.|[^'\\])*'|"(?:\\.|[^"\\])*")/g;
const COMMENTS = /(\/\/[^\n]*|\/\*[\s\S]*?\*\/|#(?!!).*$)/gm;
const NUMBERS = /\b(\d+\.?\d*)\b/g;
const TAGS = /(<\/?[a-zA-Z][\w:-]*)/g;
const ATTRS = /\b([a-zA-Z_:][\w:-]*)(?=\s*=)/g;

export function highlightCode(code: string, language = 'javascript'): HighlightToken[] {
  const lang = language.toLowerCase().replace(/^\s+/, '');
  if (lang === 'bash' || lang === 'shell' || lang === 'sh') {
    return highlightBash(code);
  }
  if (lang === 'html' || lang === 'xml') {
    return highlightMarkup(code);
  }
  if (lang === 'css') {
    return highlightCss(code);
  }
  return highlightJs(code);
}

function pushPlain(out: HighlightToken[], text: string) {
  if (text) out.push({ text });
}

function highlightJs(code: string): HighlightToken[] {
  const out: HighlightToken[] = [];
  // Split preserving strings and comments first
  const chunks = code.split(/(`(?:\\.|[^`])*`|'(?:\\.|[^'\\])*'|"(?:\\.|[^"\\])*"|\/\/[^\n]*|\/\*[\s\S]*?\*\/)/g);
  for (const chunk of chunks) {
    if (!chunk) continue;
    if (/^(\/\/|\/\*)/.test(chunk)) {
      out.push({ text: chunk, className: 'tok-comment' });
      continue;
    }
    if (/^['"`]/.test(chunk)) {
      out.push({ text: chunk, className: 'tok-string' });
      continue;
    }
    let last = 0;
    const re = new RegExp(`${KEYWORDS.source}|${NUMBERS.source}`, 'g');
    let m: RegExpExecArray | null;
    while ((m = re.exec(chunk))) {
      pushPlain(out, chunk.slice(last, m.index));
      const tok = m[0];
      out.push({
        text: tok,
        className: /^\d/.test(tok) ? 'tok-number' : 'tok-keyword',
      });
      last = m.index + tok.length;
    }
    pushPlain(out, chunk.slice(last));
  }
  return out;
}

function highlightMarkup(code: string): HighlightToken[] {
  const out: HighlightToken[] = [];
  const parts = code.split(/(<\/?[\w:-]+[^>]*>|<!--[\s\S]*?-->)/g);
  for (const part of parts) {
    if (!part) continue;
    if (part.startsWith('<!--')) {
      out.push({ text: part, className: 'tok-comment' });
      continue;
    }
    if (part.startsWith('<')) {
      const tagMatch = part.match(/^<\/?[\w:-]+/);
      if (tagMatch) {
        out.push({ text: tagMatch[0], className: 'tok-tag' });
        const rest = part.slice(tagMatch[0].length);
        const attrParts = rest.split(/("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')/g);
        for (const ap of attrParts) {
          if (!ap) continue;
          if (/^['"]/.test(ap)) out.push({ text: ap, className: 'tok-string' });
          else {
            let last = 0;
            let m: RegExpExecArray | null;
            const re = /\b([\w:-]+)(?=\s*=)/g;
            while ((m = re.exec(ap))) {
              pushPlain(out, ap.slice(last, m.index));
              out.push({ text: m[1], className: 'tok-attr' });
              last = m.index + m[1].length;
            }
            pushPlain(out, ap.slice(last));
          }
        }
      } else {
        pushPlain(out, part);
      }
      continue;
    }
    pushPlain(out, part);
  }
  return out;
}

function highlightCss(code: string): HighlightToken[] {
  const out: HighlightToken[] = [];
  const parts = code.split(/(\/\*[\s\S]*?\*\/|'(?:\\.|[^'\\])*'|"(?:\\.|[^"\\])*")/g);
  for (const part of parts) {
    if (!part) continue;
    if (part.startsWith('/*')) {
      out.push({ text: part, className: 'tok-comment' });
      continue;
    }
    if (/^['"]/.test(part)) {
      out.push({ text: part, className: 'tok-string' });
      continue;
    }
    let last = 0;
    const re = /([.#]?[\w-]+)(?=\s*\{)|(:[\w-]+)|(\d+\.?\d*(?:px|rem|em|%|vh|vw)?)/g;
    let m: RegExpExecArray | null;
    while ((m = re.exec(part))) {
      pushPlain(out, part.slice(last, m.index));
      if (m[1]) out.push({ text: m[1], className: 'tok-tag' });
      else if (m[2]) out.push({ text: m[2], className: 'tok-keyword' });
      else out.push({ text: m[3], className: 'tok-number' });
      last = m.index + m[0].length;
    }
    pushPlain(out, part.slice(last));
  }
  return out;
}

function highlightBash(code: string): HighlightToken[] {
  const out: HighlightToken[] = [];
  for (const line of code.split(/(\n)/)) {
    if (line === '\n') {
      out.push({ text: '\n' });
      continue;
    }
    if (line.trimStart().startsWith('#')) {
      out.push({ text: line, className: 'tok-comment' });
      continue;
    }
    const parts = line.split(/('(?:\\.|[^'\\])*'|"(?:\\.|[^"\\])*")/g);
    for (const p of parts) {
      if (!p) continue;
      if (/^['"]/.test(p)) out.push({ text: p, className: 'tok-string' });
      else {
        const words = p.split(/(\s+)/);
        let first = true;
        for (const w of words) {
          if (!w.trim()) {
            pushPlain(out, w);
            continue;
          }
          if (first) {
            out.push({ text: w, className: 'tok-keyword' });
            first = false;
          } else if (w.startsWith('-')) out.push({ text: w, className: 'tok-attr' });
          else pushPlain(out, w);
        }
      }
    }
  }
  return out;
}
