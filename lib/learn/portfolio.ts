/**
 * Portfolio + opportunities for career surface.
 */

import { getLearner, getEnrollments, getProgress, getBookings } from '@/lib/learn/repo';
import { getCatalogTrack } from '@/lib/learn/catalog';
import { getMyCourseSections } from '@/lib/learn/myCourses';
import { listPublishedBooks, getPurchasedBookIds } from '@/lib/learn/ecosystem';
import { ObjectId } from 'mongodb';
import { getDb } from '@/lib/repo';
import { ensureLearnCollections } from '@/lib/learn/ecosystem';

export type PortfolioSnapshot = {
  name: string;
  email: string;
  bio: string;
  skills: string[];
  xp: number;
  streak: number;
  coursesCompleted: { slug: string; title: string }[];
  coursesInProgress: { slug: string; title: string; pct: number; href: string }[];
  certificates: { id: string; title: string; earnedAt: string }[];
  mentorshipSessions: number;
  booksOwned: number;
};

export async function getPortfolioSnapshot(userId: string): Promise<PortfolioSnapshot> {
  const [learner, enrollments, progress, bookings, courseData, books, purchased] =
    await Promise.all([
      getLearner(userId).catch(() => null),
      getEnrollments(userId).catch(() => []),
      getProgress(userId).catch(() => []),
      getBookings(userId).catch(() => []),
      getMyCourseSections(userId).catch(() => ({ sections: [], total: 0, inProgress: 0 })),
      listPublishedBooks().catch(() => []),
      getPurchasedBookIds(userId).catch(() => new Set<string>()),
    ]);

  const doneByCourse = new Map<string, Set<string>>();
  for (const p of progress) {
    if (!doneByCourse.has(p.courseSlug)) doneByCourse.set(p.courseSlug, new Set());
    doneByCourse.get(p.courseSlug)!.add(p.lessonSlug);
  }

  const coursesCompleted: { slug: string; title: string }[] = [];
  for (const e of enrollments) {
    const track = getCatalogTrack(e.courseSlug);
    if (!track) continue;
    const done = doneByCourse.get(e.courseSlug)?.size || 0;
    if (track.totalLessons && done >= track.totalLessons) {
      coursesCompleted.push({ slug: e.courseSlug, title: track.title });
    }
  }

  const enrolled =
    courseData.sections.find((s) => s.id === 'enrolled')?.courses.filter((c) => c.enrolled) || [];
  for (const c of enrolled.filter((c) => c.pct >= 100)) {
    if (!coursesCompleted.some((x) => x.slug === c.slug)) {
      coursesCompleted.push({ slug: c.slug, title: c.title });
    }
  }

  const coursesInProgress = enrolled
    .filter((c) => c.pct > 0 && c.pct < 100)
    .map((c) => ({
      slug: c.slug,
      title: c.title,
      pct: c.pct,
      href: c.continueHref || c.href,
    }));

  const certificates = coursesCompleted.map((c) => ({
    id: `cert-${c.slug}`,
    title: `${c.title} — Completion`,
    earnedAt: new Date().toISOString(),
  }));

  const skillHints = new Set<string>();
  for (const c of [...coursesCompleted, ...coursesInProgress]) {
    const words = c.title.split(/[\s,/|&-]+/).filter((w) => w.length > 2);
    for (const w of words.slice(0, 3)) skillHints.add(w);
  }

  const prefs = learner?.preferences as { bio?: string; skills?: string[] } | undefined;

  return {
    name: learner?.name || 'Learner',
    email: learner?.email || '',
    bio: prefs?.bio || '',
    skills: prefs?.skills?.length ? prefs.skills : Array.from(skillHints).slice(0, 8),
    xp: learner?.xp ?? 0,
    streak: learner?.streakCount ?? 0,
    coursesCompleted,
    coursesInProgress,
    certificates,
    mentorshipSessions: bookings.filter((b) => b.status !== 'cancelled').length,
    booksOwned: books.filter((b) => purchased.has(b.id) || b.priceXAF === 0).length,
  };
}

export type OpportunityView = {
  id: string;
  title: string;
  kind: string;
  org: string;
  summary: string;
  href: string | null;
  deadline: string | null;
  createdAt: string;
};

const DEFAULT_OPPS: Omit<OpportunityView, 'id' | 'createdAt'>[] = [
  {
    title: 'Campus internship board',
    kind: 'internship',
    org: 'Intellex Network',
    summary: 'Browse internships shared by partner organizations on Intellex.',
    href: '/dashboard/institutions',
    deadline: null,
  },
  {
    title: 'Build your public portfolio',
    kind: 'project',
    org: 'Intellex Career',
    summary: 'Turn completed courses and certificates into a shareable profile.',
    href: '/dashboard/portfolio',
    deadline: null,
  },
  {
    title: 'Mentorship programs',
    kind: 'mentorship',
    org: 'Intellex Mentors',
    summary: 'Request a mentor session and set career goals with an expert.',
    href: '/dashboard/mentorship',
    deadline: null,
  },
  {
    title: 'Hackathon & competitions',
    kind: 'competition',
    org: 'Intellex Events',
    summary: 'Join platform challenges when your campus enables Career opportunities.',
    href: '/dashboard/notifications',
    deadline: null,
  },
];

export async function listOpportunities(): Promise<OpportunityView[]> {
  try {
    await ensureLearnCollections();
    const db = await getDb();
    await db.collection('opportunities').createIndex({ createdAt: -1 }).catch(() => {});
    const docs = await db
      .collection('opportunities')
      .find({ published: true })
      .sort({ createdAt: -1 })
      .limit(40)
      .toArray();
    if (docs.length) {
      return docs.map((d) => ({
        id: String((d._id as ObjectId).toString()),
        title: String(d.title),
        kind: String(d.kind || 'opportunity'),
        org: String(d.org || 'Intellex'),
        summary: String(d.summary || ''),
        href: (d.href as string) || null,
        deadline: d.deadline ? new Date(d.deadline as string | Date).toISOString() : null,
        createdAt: new Date(d.createdAt as string | Date).toISOString(),
      }));
    }
  } catch {
    /* fall through */
  }
  const now = new Date().toISOString();
  return DEFAULT_OPPS.map((o, i) => ({ ...o, id: `default-${i}`, createdAt: now }));
}
