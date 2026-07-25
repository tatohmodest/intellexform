import type { Course } from '@/lib/types';

export type CertMarkId = 'azure' | 'ceh' | 'intellex' | 'data';

export type CertTrack = {
  id: string;
  issuer: string;
  title: string;
  blurb: string;
  badge: string;
  href: string;
  mark: CertMarkId;
  accent: string;
  accentSoft: string;
  inkOnAccent: string;
  outcomes: string[];
  match: (c: Course) => boolean;
};

/**
 * Professional / accredited certification tracks.
 * Visual identity is brand marks + color systems - not AI stock photos.
 */
export const CERT_TRACKS: CertTrack[] = [
  {
    id: 'ec-council-ceh',
    issuer: 'EC-Council',
    title: 'Certified Ethical Hacker (CEH) Prep',
    blurb:
      'Industry-recognized ethical hacking prep aligned to the EC-Council CEH pathway - labs, domains, and exam readiness.',
    badge: 'Accredited path',
    href: '/certifications#ec-council-ceh',
    mark: 'ceh',
    accent: '#B42318',
    accentSoft: '#FFF5F4',
    inkOnAccent: '#FFFFFF',
    outcomes: ['Recon & scanning labs', 'Threat modeling drills', 'Exam-domain mapping'],
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
    blurb:
      'Cloud architecture, DevOps, and Azure-ready skills - prepare for Microsoft-aligned cloud roles and certifications.',
    badge: 'Cloud credential',
    href: '/certifications#microsoft-azure',
    mark: 'azure',
    accent: '#0078D4',
    accentSoft: '#F3F9FF',
    inkOnAccent: '#FFFFFF',
    outcomes: ['Azure fundamentals', 'Cloud architecture', 'DevOps & IaC basics'],
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
    blurb:
      'Our own completion credential - finish an Intellex path and earn a certificate that proves you did the work.',
    badge: 'Intellex certified',
    href: '/certifications#intellex',
    mark: 'intellex',
    accent: '#009a5a',
    accentSoft: '#F0FBF5',
    inkOnAccent: '#FFFFFF',
    outcomes: ['Verified completion', 'Mentor-ready skills', 'Shareable credential'],
    match: (c) => Boolean(c.featured || c.selfPaced || c.certificateOfCompletion),
  },
  {
    id: 'data-analysis',
    issuer: 'Data & Analytics',
    title: 'Data Analysis Professional Track',
    blurb:
      'From spreadsheets to Python analytics - a job-ready data path with certificate of completion on every finished course.',
    badge: 'Career track',
    href: '/certifications#data-analysis',
    mark: 'data',
    accent: '#1F5FA8',
    accentSoft: '#F3F8FE',
    inkOnAccent: '#FFFFFF',
    outcomes: ['Python & spreadsheets', 'Dashboards & SQL', 'Portfolio projects'],
    match: (c) => {
      const hay = `${c.name} ${c.type}`.toLowerCase();
      return (
        hay.includes('data') ||
        hay.includes('analysis') ||
        hay.includes('analytics') ||
        (hay.includes('python') && hay.includes('data')) ||
        ['data science', 'ai & data science', 'database'].includes((c.type || '').toLowerCase())
      );
    },
  },
];

export function coursesForTrack(all: Course[], track: CertTrack, limit = 6) {
  return all.filter(track.match).slice(0, limit);
}
