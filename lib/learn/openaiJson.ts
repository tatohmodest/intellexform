import { isLLMConfigured } from '@/lib/learn/tutor';

export async function openaiJsonCompletion(opts: {
  system: string;
  user: string;
  temperature?: number;
  timeoutMs?: number;
}): Promise<string | null> {
  if (!isLLMConfigured()) return null;
  const url = `${process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1'}/chat/completions`;
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
  };
  const messages = [
    { role: 'system', content: opts.system },
    { role: 'user', content: opts.user },
  ];
  const base = {
    model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
    temperature: opts.temperature ?? 0.4,
    messages,
  };
  const timeoutMs = opts.timeoutMs ?? 20_000;
  const ac = new AbortController();
  const timer = setTimeout(() => ac.abort(), timeoutMs);

  try {
    let res = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify({ ...base, response_format: { type: 'json_object' } }),
      signal: ac.signal,
    });
    if (!res.ok) {
      res = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(base),
        signal: ac.signal,
      });
    }
    if (!res.ok) {
      const err = await res.text().catch(() => '');
      throw new Error(`LLM request failed (${res.status}): ${err.slice(0, 280)}`);
    }
    const data = (await res.json()) as { choices?: Array<{ message?: { content?: string } }> };
    return data.choices?.[0]?.message?.content || null;
  } finally {
    clearTimeout(timer);
  }
}

export function parseJsonObject<T>(raw: string | null): T | null {
  if (!raw) return null;
  const trimmed = raw.trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/);
  const text = fenced?.[1] || trimmed;
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start < 0 || end <= start) return null;
  try {
    return JSON.parse(text.slice(start, end + 1)) as T;
  } catch {
    return null;
  }
}
