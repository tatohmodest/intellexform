export type InterestId =
  | 'software-engineering'
  | 'ai'
  | 'data-science'
  | 'design'
  | 'business'
  | 'marketing'
  | 'cybersecurity'
  | 'finance'
  | 'entrepreneurship'
  | 'education';

export const INTERESTS: Array<{
  id: InterestId;
  label: string;
  catalogSlugs: string[];
}> = [
  {
    id: 'software-engineering',
    label: 'Software Engineering',
    catalogSlugs: [
      'html',
      'css',
      'javascript',
      'react',
      'nextjs',
      'nodejs-express',
      'nestjs',
      'golang',
      'java',
      'cpp',
      'rust',
      'ruby-on-rails',
      'docker',
      'kubernetes',
    ],
  },
  {
    id: 'ai',
    label: 'AI',
    catalogSlugs: ['python', 'data-analysis'],
  },
  {
    id: 'data-science',
    label: 'Data Science',
    catalogSlugs: ['python', 'data-analysis', 'postgresql', 'mongodb'],
  },
  {
    id: 'design',
    label: 'Design',
    catalogSlugs: ['html', 'css', 'flutter'],
  },
  {
    id: 'business',
    label: 'Business',
    catalogSlugs: ['digital-marketing'],
  },
  {
    id: 'marketing',
    label: 'Marketing',
    catalogSlugs: ['digital-marketing'],
  },
  {
    id: 'cybersecurity',
    label: 'Cybersecurity',
    catalogSlugs: ['linux-administration', 'bash-scripting', 'computer-architecture'],
  },
  {
    id: 'finance',
    label: 'Finance',
    catalogSlugs: ['digital-marketing', 'data-analysis'],
  },
  {
    id: 'entrepreneurship',
    label: 'Entrepreneurship',
    catalogSlugs: ['digital-marketing', 'javascript'],
  },
  {
    id: 'education',
    label: 'Education',
    catalogSlugs: ['html', 'python'],
  },
];

const VALID = new Set(INTERESTS.map((i) => i.id));

export function sanitizeInterests(raw: unknown): InterestId[] {
  if (!Array.isArray(raw)) return [];
  const out: InterestId[] = [];
  for (const item of raw) {
    const id = String(item || '').trim() as InterestId;
    if (VALID.has(id) && !out.includes(id)) out.push(id);
  }
  return out.slice(0, 12);
}

export function interestLabels(ids: string[]): string[] {
  return ids
    .map((id) => INTERESTS.find((i) => i.id === id)?.label)
    .filter((x): x is string => Boolean(x));
}

export function catalogSlugsForInterests(ids: string[]): string[] {
  const set = new Set<string>();
  for (const id of ids) {
    const row = INTERESTS.find((i) => i.id === id);
    row?.catalogSlugs.forEach((s) => set.add(s));
  }
  return Array.from(set);
}
