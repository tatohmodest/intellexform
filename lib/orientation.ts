import { PLATFORM_CONTACT } from '@/lib/contact';
import { PROGRAMMES, priceNumber, type Programme } from '@/lib/programmes';

/**
 * Public "Chat with AI" orientation advisor. Helps visitors choose a path and
 * understand why a programme is worth it. Grounded in the real programme list.
 */

export type OrientationMessage = { role: 'user' | 'assistant'; content: string };

function programmeLine(p: Programme) {
  const monthly = p.monthlyXAF ? `, or ${priceNumber(p.monthlyXAF)} XAF/month` : '';
  return `- ${p.title} [${p.categoryLabel}] - ${p.duration}, ${p.level}, ${priceNumber(p.priceXAF)} XAF${monthly}, registration ${priceNumber(p.registrationFee)} XAF. Covers: ${p.technologies.slice(0, 8).join(', ')}. Link: /programmes/${p.id}`;
}

export function orientationSystemPrompt() {
  return `You are the InTelleX orientation advisor - a warm, sharp career and learning guide on the InTelleX website.
InTelleX is an online school by Looping Binary (Douala, Cameroon). Students enrol in structured programmes taught live by approved instructors, with mentorship, practical projects and a certificate. Payment: in full or monthly via MTN MoMo, Orange Money or card.

What you help with: trending technologies, which skill or programme suits someone, career paths and in-demand jobs, why a particular programme is worth it, how learning at InTelleX works.

Rules:
1. Be concise and conversational (under ~180 words unless asked for depth). Use short paragraphs or bullets. Ask one follow-up question about their goal, level or budget when it helps.
2. Recommend ONLY programmes from the list below, by exact title, and include the link as a markdown link, e.g. [Full Stack Web Development](/programmes/fullstack).
3. Frame programme fees as an investment in an income skill: what it unlocks (portfolio projects, job readiness, freelancing, a certificate), and that monthly payment makes it accessible. Never pressure.
4. Be honest. Do not invent statistics, salaries, job guarantees or employment rates. You may describe general market demand (e.g. "web developers and data analysts are widely hired, including remotely") without precise numbers. If asked for exact salaries, say they vary by country, level and employer, and explain what drives higher pay.
5. For enrolment, start dates, or anything you are unsure about, point them to WhatsApp ${PLATFORM_CONTACT.phoneDisplay} or the Enrol button on the programme page.
6. Stay on topic (learning, careers, technology, InTelleX). Politely decline unrelated requests.

InTelleX programmes:
${PROGRAMMES.map(programmeLine).join('\n')}`;
}

const TOPICS: { keys: string[]; ids: string[]; why: string }[] = [
  {
    keys: ['web', 'website', 'frontend', 'front-end', 'react', 'next', 'javascript', 'full stack', 'fullstack', 'backend', 'node'],
    ids: ['fullstack', 'mern', 'javascript'],
    why: 'Web development is one of the most widely hired tech skills and works well for remote jobs and freelancing.',
  },
  {
    keys: ['data', 'analyst', 'analysis', 'excel', 'power bi', 'sql', 'statistics', 'ai', 'machine learning', 'ml'],
    ids: ['data-analysis', 'python'],
    why: 'Data skills are needed in almost every industry, from banks and telecoms to NGOs and startups.',
  },
  {
    keys: ['security', 'cyber', 'hacking', 'hacker', 'ceh', 'network', 'ethical'],
    ids: ['cybersecurity', 'cybersecurity-ceh'],
    why: 'Every organisation going digital needs people who can protect it, and certification prep makes your skills easy to prove.',
  },
  {
    keys: ['mobile', 'android', 'ios', 'app', 'flutter', 'react native'],
    ids: ['flutter-mobile-design', 'react-native-mobile-design'],
    why: 'Mobile apps are how most people in Africa use the internet, so mobile developers are in steady demand.',
  },
  {
    keys: ['python', 'django', 'automation'],
    ids: ['python', 'django'],
    why: 'Python is beginner-friendly and opens doors to backend development, automation and data.',
  },
  {
    keys: ['beginner', 'start', 'zero', 'new to', 'no experience', 'never coded', 'cheap', 'budget', 'affordable'],
    ids: ['webfundamentals', 'python-basics', 'htmlcss'],
    why: 'Starting with a short Foundations programme is a low-cost way to build confidence before a full programme.',
  },
];

/** Rule-based answer used when no LLM is configured or the LLM call fails. */
export function fallbackOrientationAnswer(messages: OrientationMessage[]): string {
  const last = [...messages].reverse().find((m) => m.role === 'user')?.content.toLowerCase() || '';
  const hasWord = (k: string) => new RegExp(`(^|[^a-z])${k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}([^a-z]|$)`).test(last);
  const matches = (t: (typeof TOPICS)[number]) => t.keys.some(hasWord);
  const beginner = TOPICS[TOPICS.length - 1];
  const careerQuestion = /(trend|demand|hot|future|best skill|high income|high-income|pay well|money|job|career)/.test(last);
  // A named technology wins; then career questions; the beginner track is the last resort.
  const topic =
    TOPICS.slice(0, -1).find(matches) || (!careerQuestion && matches(beginner) ? beginner : undefined);
  const wa = `WhatsApp us on ${PLATFORM_CONTACT.phoneDisplay}`;

  if (topic) {
    const picks = topic.ids.map((id) => PROGRAMMES.find((p) => p.id === id)).filter(Boolean) as Programme[];
    const lines = picks.map((p) => {
      const monthly = p.monthlyXAF ? ` (or ${priceNumber(p.monthlyXAF)} XAF/month)` : '';
      return `- **[${p.title}](/programmes/${p.id})** - ${p.duration}, ${p.level}. ${priceNumber(p.priceXAF)} XAF${monthly}.`;
    });
    return `${topic.why}\n\nGood places to start at InTelleX:\n${lines.join('\n')}\n\nEach programme is taught live by an instructor, with real projects for your portfolio and a certificate at the end. Think of it as an investment in a skill you can earn with.\n\nWhat is your current level, and is your goal a job, freelancing or your own project? For start dates, ${wa}.`;
  }

  if (careerQuestion) {
    return `Some of the most in-demand, well-paid tech skills right now:\n\n- **Web development** - every business needs a website or web app. [Full Stack Web Development](/programmes/fullstack)\n- **Data analysis** - companies want people who turn data into decisions. [Data Analysis & Visualization](/programmes/data-analysis)\n- **Cybersecurity** - growing fast as everything goes online. [Cybersecurity Fundamentals](/programmes/cybersecurity)\n- **Mobile development** - apps are how most people get online. [Flutter](/programmes/flutter-mobile-design)\n\nPay depends on your level, portfolio and whether you work locally, remotely or freelance, which is why InTelleX programmes focus on real projects you can show.\n\nWhich of these sounds most like you?`;
  }

  return `I can help you choose. InTelleX teaches four disciplines:\n\n- **Software Development** - web, backend and mobile\n- **Data & AI** - analysis and visualisation\n- **Cybersecurity** - fundamentals and CEH prep\n- **Foundations** - short starter programmes for complete beginners\n\nTell me a bit about you: what do you enjoy, what is your current level, and what do you want this skill to do for you (a job, freelancing, your own business)? You can also browse [all programmes](/programmes) or ${wa}.`;
}

export async function orientationStream(messages: OrientationMessage[]): Promise<ReadableStream<Uint8Array>> {
  const res = await fetch(`${process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1'}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      stream: true,
      temperature: 0.6,
      max_tokens: 600,
      messages: [{ role: 'system', content: orientationSystemPrompt() }, ...messages.slice(-12)],
    }),
  });
  if (!res.ok || !res.body) {
    const err = await res.text().catch(() => '');
    throw new Error(`Orientation LLM failed (${res.status}): ${err.slice(0, 200)}`);
  }

  const decoder = new TextDecoder();
  const encoder = new TextEncoder();
  const reader = res.body.getReader();
  let buffer = '';
  return new ReadableStream<Uint8Array>({
    async pull(controller) {
      const { done, value } = await reader.read();
      if (done) {
        controller.close();
        return;
      }
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() ?? '';
      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed.startsWith('data:')) continue;
        const data = trimmed.slice(5).trim();
        if (data === '[DONE]') continue;
        try {
          const token = JSON.parse(data).choices?.[0]?.delta?.content;
          if (token) controller.enqueue(encoder.encode(token));
        } catch {
          // ignore keep-alives
        }
      }
    },
    cancel() {
      reader.cancel().catch(() => {});
    },
  });
}
