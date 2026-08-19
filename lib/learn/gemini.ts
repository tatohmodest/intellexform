/**
 * Gemini is the primary LLM for book tutor (curriculum, grade, clarify)
 * and other JSON completions. OpenAI remains a fallback if no Gemini key.
 */

export function geminiApiKey(): string {
  return (process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY || '').trim();
}

export function geminiModel(): string {
  return (process.env.GEMINI_MODEL || 'gemini-2.5-flash').trim();
}

const FALLBACK_MODELS = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash', 'gemini-flash-latest'];

type GeminiPart = { text?: string };
type GeminiResp = {
  candidates?: Array<{ content?: { parts?: GeminiPart[] } }>;
  error?: { message?: string; status?: string };
};

function modelsToTry(preferred: string): string[] {
  const out = [preferred];
  for (const m of FALLBACK_MODELS) if (!out.includes(m)) out.push(m);
  return out;
}

function extractText(data: GeminiResp): string {
  const parts = data.candidates?.[0]?.content?.parts || [];
  return parts.map((p) => String(p.text || '')).join('').trim();
}

async function postGenerate(opts: {
  key: string;
  model: string;
  system: string;
  user: string;
  temperature: number;
  json: boolean;
}): Promise<{ ok: boolean; status: number; text: string; body: string }> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(opts.model)}:generateContent?key=${encodeURIComponent(opts.key)}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: opts.system }] },
      contents: [{ role: 'user', parts: [{ text: opts.user }] }],
      generationConfig: {
        temperature: opts.temperature,
        maxOutputTokens: 8192,
        ...(opts.json ? { responseMimeType: 'application/json' } : {}),
      },
    }),
  });
  const body = await res.text().catch(() => '');
  let text = '';
  try {
    const data = JSON.parse(body) as GeminiResp;
    text = extractText(data);
  } catch {
    text = '';
  }
  return { ok: res.ok, status: res.status, text, body };
}

export async function geminiJsonCompletion(opts: {
  system: string;
  user: string;
  temperature?: number;
}): Promise<string | null> {
  const key = geminiApiKey();
  if (!key) return null;
  const temperature = opts.temperature ?? 0.4;
  let lastErr = '';
  for (const model of modelsToTry(geminiModel())) {
    const result = await postGenerate({
      key,
      model,
      system: opts.system,
      user: opts.user,
      temperature,
      json: true,
    });
    if (result.ok && result.text) return result.text;
    lastErr = result.body.slice(0, 280);
    if (result.status !== 404 && result.status !== 400) {
      throw new Error(`Gemini request failed (${result.status}): ${lastErr}`);
    }
  }
  throw new Error(`Gemini request failed: ${lastErr || 'no model accepted the request'}`);
}

export async function geminiTextCompletion(opts: {
  system: string;
  user: string;
  temperature?: number;
}): Promise<string | null> {
  const key = geminiApiKey();
  if (!key) return null;
  const temperature = opts.temperature ?? 0.7;
  let lastErr = '';
  for (const model of modelsToTry(geminiModel())) {
    const result = await postGenerate({
      key,
      model,
      system: opts.system,
      user: opts.user,
      temperature,
      json: false,
    });
    if (result.ok && result.text) return result.text;
    lastErr = result.body.slice(0, 280);
    if (result.status !== 404 && result.status !== 400) {
      throw new Error(`Gemini request failed (${result.status}): ${lastErr}`);
    }
  }
  throw new Error(`Gemini request failed: ${lastErr || 'no model accepted the request'}`);
}

/** Stream-shaped ReadableStream so the existing tutor UI can consume Gemini output. */
export function textToTokenStream(text: string): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder();
  const chunks = text.match(/[\s\S]{1,48}/g) || [text];
  let i = 0;
  return new ReadableStream<Uint8Array>({
    pull(controller) {
      if (i >= chunks.length) {
        controller.close();
        return;
      }
      controller.enqueue(encoder.encode(chunks[i]));
      i += 1;
    },
  });
}
