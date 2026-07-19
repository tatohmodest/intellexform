import type { Course } from '@/lib/types';

export type CertTrack = {
  id: string;
  issuer: string;
  title: string;
  blurb: string;
  image: string;
  badge: string;
  href: string;
  match: (c: Course) => boolean;
};

/**
 * Coursera-style professional / accredited certification tracks.
 * Matchers pull related catalogue courses into list views.
 */
export const CERT_TRACKS: CertTrack[] = [
  {
    id: 'ec-council-ceh',
    issuer: 'EC-Council',
    title: 'Certified Ethical Hacker (CEH) Prep',
    blurb: 'Industry-recognized ethical hacking prep aligned to the EC-Council CEH pathway — labs, domains, and exam readiness.',
    image: '/cert_eccouncil.webp',
    badge: 'Accredited path',
    href: '/certifications#ec-council-ceh',
    match: (c) => {
      const hay = `${c.name} ${c.shortDescription} ${c.type}`.toLowerCase();
      return (
        hay.includes('ceh') ||
        hay.includes('ethical hack') ||
        hay.includes('penetration') ||
        (c.type || '').toLowerCase() === 'cybersecurity'
      );
    },
  },
  {
    id: 'microsoft-azure',
    issuer: 'Microsoft Azure',
    title: 'Azure & Cloud Professional Path',
    blurb: 'Cloud architecture, DevOps, and Azure-ready skills — prepare for Microsoft-aligned cloud roles and certifications.',
    image: '/cert_azure.webp',
    badge: 'Cloud credential',
    href: '/certifications#microsoft-azure',
    match: (c) => {
      const hay = `${c.name} ${c.shortDescription} ${c.courseDetails} ${c.type}`.toLowerCase();
      return (
        hay.includes('azure') ||
        hay.includes('aws') ||
        hay.includes('cloud') ||
        hay.includes('devops') ||
        hay.includes('terraform') ||
        (c.type || '').toLowerCase() === 'it certification'
      );
    },
  },
  {
    id: 'intellex',
    issuer: 'Intellex',
    title: 'Intellex Professional Certificate',
    blurb: 'Our own completion credential — finish an Intellex path and earn a certificate that proves you did the work.',
    image: '/cert_intellex.webp',
    badge: 'Intellex certified',
    href: '/certifications#intellex',
    match: (c) => Boolean(c.featured || c.selfPaced || c.certificateOfCompletion),
  },
  {
    id: 'data-analysis',
    issuer: 'Data & Analytics',
    title: 'Data Analysis Professional Track',
    blurb: 'From spreadsheets to Python analytics — a job-ready data path with certificate of completion on every finished course.',
    image: '/eco_learning.webp',
    badge: 'Career track',
    href: '/certifications#data-analysis',
    match: (c) => {
      const hay = `${c.name} ${c.type}`.toLowerCase();
      return (
        hay.includes('data') ||
        hay.includes('analysis') ||
        hay.includes('analytics') ||
        hay.includes('python') && hay.includes('data') ||
        ['data science', 'ai & data science', 'database'].includes((c.type || '').toLowerCase())
      );
    },
  },
];

export function coursesForTrack(all: Course[], track: CertTrack, limit = 6) {
  return all.filter(track.match).slice(0, limit);
}
