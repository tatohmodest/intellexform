import { isLLMConfigured } from '@/lib/learn/tutor';
import { geminiApiKey, geminiJsonCompletion } from '@/lib/learn/gemini';

export async function openaiJsonCompletion(opts: {
  system: string;
  user: string;
  temperature?: number;
}): Promise<string | null> {
  if (!isLLMConfigured()) return null;
  if (geminiApiKey()) {
    return geminiJsonCompletion(opts);
  }
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

  let res = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify({ ...base, response_format: { type: 'json_object' } }),
  });
  if (!res.ok) {
    res = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(base),
    });
  }
  if (!res.ok) {
    const err = await res.text().catch(() => '');
    throw new Error(`LLM request failed (${res.status}): ${err.slice(0, 280)}`);
  }
  const data = (await res.json()) as { choices?: Array<{ message?: { content?: string } }> };
  return data.choices?.[0]?.message?.content || null;
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
