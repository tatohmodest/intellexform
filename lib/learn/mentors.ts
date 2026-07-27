/**
 * Mentor directory. Mentors run 1-on-1 sessions and live classes over Agora.
 */

export interface MentorSlot {
  /** Day offset from "today" (0 = today, 1 = tomorrow …). */
  dayOffset: number;
  /** 24h time, e.g. "18:30". */
  time: string;
}

export interface Mentor {
  id: string;
  name: string;
  title: string;
  expertise: string[];
  bio: string;
  rating: number;
  sessionsCompleted: number;
  languages: string[];
  priceXAF: number;
  /** Session length in minutes. */
  sessionMinutes: number;
  accent: string;
  initials: string;
  slots: MentorSlot[];
}

export const MENTORS: Mentor[] = [
  {
    id: 'tatoh-modest',
    name: 'Tatoh Modest Wilton',
    title: 'Founder & Full-stack Engineer, LoopingBinary',
    expertise: ['Full-stack', 'Next.js', 'System design', 'Career'],
    bio: 'Builder of the Intellex platform and the LoopingBinary ecosystem. Mentors on shipping real products, full-stack architecture, and turning skills into income.',
    rating: 4.9,
    sessionsCompleted: 320,
    languages: ['English', 'French'],
    priceXAF: 5000,
    sessionMinutes: 45,
    accent: '#00b369',
    initials: 'TM',
    slots: [
      { dayOffset: 1, time: '18:00' },
      { dayOffset: 2, time: '19:30' },
      { dayOffset: 4, time: '17:00' },
    ],
  },
  {
    id: 'amara-ndip',
    name: 'Amara Ndip',
    title: 'Senior Frontend Engineer',
    expertise: ['React', 'JavaScript', 'CSS', 'UI engineering'],
    bio: 'Specialist in modern frontend - component architecture, animations, and accessible interfaces. Great for portfolio reviews and interview prep.',
    rating: 4.8,
    sessionsCompleted: 210,
    languages: ['English'],
    priceXAF: 4000,
    sessionMinutes: 45,
    accent: '#4a90e2',
    initials: 'AN',
    slots: [
      { dayOffset: 1, time: '16:00' },
      { dayOffset: 3, time: '18:30' },
      { dayOffset: 5, time: '10:00' },
    ],
  },
  {
    id: 'jules-fongang',
    name: 'Jules Fongang',
    title: 'Backend & DevOps Engineer',
    expertise: ['Node.js', 'PostgreSQL', 'Docker', 'APIs'],
    bio: 'Runs production systems for fintech clients. Mentors on backend fundamentals, databases, deployment, and debugging real-world outages.',
    rating: 4.9,
    sessionsCompleted: 185,
    languages: ['French', 'English'],
    priceXAF: 4500,
    sessionMinutes: 60,
    accent: '#7c3aed',
    initials: 'JF',
    slots: [
      { dayOffset: 2, time: '20:00' },
      { dayOffset: 4, time: '19:00' },
      { dayOffset: 6, time: '11:00' },
    ],
  },
  {
    id: 'sarah-ekwe',
    name: 'Sarah Ekwe',
    title: 'Data Scientist',
    expertise: ['Python', 'Data analysis', 'Machine learning', 'SQL'],
    bio: 'From spreadsheets to models in production. Mentors on pandas, visualization, statistics, and landing your first data role.',
    rating: 4.7,
    sessionsCompleted: 142,
    languages: ['English'],
    priceXAF: 4500,
    sessionMinutes: 45,
    accent: '#f59e0b',
    initials: 'SE',
    slots: [
      { dayOffset: 1, time: '12:00' },
      { dayOffset: 3, time: '15:00' },
      { dayOffset: 5, time: '18:00' },
    ],
  },
  {
    id: 'brice-tabe',
    name: 'Brice Tabe',
    title: 'Mobile Engineer',
    expertise: ['Flutter', 'Dart', 'Mobile UX', 'App Store shipping'],
    bio: 'Shipped 12+ apps to the Play Store and App Store. Mentors on Flutter architecture, state management, and going from idea to published app.',
    rating: 4.8,
    sessionsCompleted: 98,
    languages: ['French', 'English'],
    priceXAF: 4000,
    sessionMinutes: 45,
    accent: '#02569B',
    initials: 'BT',
    slots: [
      { dayOffset: 2, time: '17:30' },
      { dayOffset: 4, time: '20:30' },
    ],
  },
  {
    id: 'linda-mbah',
    name: 'Linda Mbah',
    title: 'Growth & Digital Marketing Lead',
    expertise: ['Digital marketing', 'SEO', 'Content', 'Analytics'],
    bio: 'Grew three startups past their first 100k users. Mentors on campaigns, funnels, SEO, and marketing analytics that actually convert.',
    rating: 4.9,
    sessionsCompleted: 167,
    languages: ['English', 'French'],
    priceXAF: 3500,
    sessionMinutes: 45,
    accent: '#e0234e',
    initials: 'LM',
    slots: [
      { dayOffset: 1, time: '14:00' },
      { dayOffset: 6, time: '09:30' },
    ],
  },
];

export function getMentor(id: string): Mentor | null {
  return MENTORS.find((m) => m.id === id) ?? null;
}
