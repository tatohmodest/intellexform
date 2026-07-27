import { ObjectId } from 'mongodb';
import { getDb } from '@/lib/repo';
import { MENTORS, type Mentor, type MentorSlot } from '@/lib/learn/mentors';

/**
 * Ecosystem data layer — roles, mentor profiles, the book library &
 * publishing portal, and institutions (the multi-tenant "EduOS" foundation).
 *
 * All collections are created explicitly with indexes by
 * ensureLearnCollections(), so the database schema is visible and verifiable
 * from the admin dashboard.
 */

export type LearnerRole = 'student' | 'mentor' | 'admin';

// ── Explicit collection creation ──────────────────────────────────────────────

export const LEARN_COLLECTIONS = [
  'learners',
  'enrollments',
  'lesson_progress',
  'bookings',
  'mentor_profiles',
  'books',
  'book_purchases',
  'institutions',
  'institution_members',
  'institution_posts',
] as const;

let ensured = false;

/** Create every learning collection + its indexes (idempotent). */
export async function ensureLearnCollections() {
  if (ensured) return;
  const db = await getDb();
  const existing = new Set(
    (await db.listCollections({}, { nameOnly: true }).toArray()).map((c) => c.name),
  );
  for (const name of LEARN_COLLECTIONS) {
    if (!existing.has(name)) await db.createCollection(name).catch(() => {});
  }
  await Promise.all([
    db.collection('learners').createIndex({ lbId: 1 }, { unique: true }),
    db.collection('enrollments').createIndex({ userId: 1, courseSlug: 1 }, { unique: true }),
    db
      .collection('lesson_progress')
      .createIndex({ userId: 1, courseSlug: 1, lessonSlug: 1 }, { unique: true }),
    db.collection('bookings').createIndex({ userId: 1, scheduledAt: 1 }),
    db.collection('bookings').createIndex({ mentorId: 1, scheduledAt: 1 }),
    db.collection('mentor_profiles').createIndex({ lbId: 1 }, { unique: true }),
    db.collection('books').createIndex({ published: 1, createdAt: -1 }),
    db.collection('books').createIndex({ authorId: 1 }),
    db.collection('book_purchases').createIndex({ userId: 1, bookId: 1 }, { unique: true }),
    db.collection('institutions').createIndex({ slug: 1 }, { unique: true }),
    db
      .collection('institution_members')
      .createIndex({ institutionSlug: 1, userId: 1 }, { unique: true }),
    db.collection('institution_posts').createIndex({ institutionSlug: 1, createdAt: -1 }),
  ]).catch(() => {});
  await seedBooks(db);
  await seedIntellexInstitution(db);
  ensured = true;
}

// ── Roles ─────────────────────────────────────────────────────────────────────

export async function getRoles(lbId: string): Promise<LearnerRole[]> {
  try {
    const db = await getDb();
    const doc = await db
      .collection('learners')
      .findOne({ lbId }, { projection: { roles: 1 } });
    const roles = (doc?.roles as LearnerRole[] | undefined) ?? [];
    return roles.length ? roles : ['student'];
  } catch {
    return ['student'];
  }
}

async function grantRole(lbId: string, role: LearnerRole, name?: string) {
  const db = await getDb();
  await db.collection('learners').updateOne(
    { lbId },
    {
      $addToSet: { roles: role },
      $setOnInsert: {
        lbId,
        name: name ?? 'Learner',
        email: '',
        xp: 0,
        streakCount: 0,
        lastActiveDay: null,
        weeklyGoalMinutes: 150,
        createdAt: new Date(),
      },
    },
    { upsert: true },
  );
}

// ── Mentor profiles (dynamic mentors alongside the seed directory) ────────────

export interface MentorProfileDoc {
  lbId: string;
  name: string;
  title: string;
  expertise: string[];
  bio: string;
  languages: string[];
  priceXAF: number;
  sessionMinutes: number;
  accent: string;
  initials: string;
  slots: MentorSlot[];
  rating: number;
  sessionsCompleted: number;
  active: boolean;
  createdAt: Date;
}

function initialsOf(name: string): string {
  return (
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase())
      .join('') || 'MX'
  );
}

export async function becomeMentor(opts: {
  lbId: string;
  name: string;
  title: string;
  expertise: string[];
  bio: string;
  priceXAF: number;
  sessionMinutes: number;
  slots: MentorSlot[];
}): Promise<void> {
  await ensureLearnCollections();
  const db = await getDb();
  const doc: MentorProfileDoc = {
    lbId: opts.lbId,
    name: opts.name,
    title: opts.title.slice(0, 90),
    expertise: opts.expertise.slice(0, 6).map((e) => e.slice(0, 30)),
    bio: opts.bio.slice(0, 500),
    languages: ['English'],
    priceXAF: Math.max(0, Math.min(opts.priceXAF, 1_000_000)),
    sessionMinutes: [30, 45, 60].includes(opts.sessionMinutes) ? opts.sessionMinutes : 45,
    accent: '#00b369',
    initials: initialsOf(opts.name),
    slots: opts.slots.slice(0, 10),
    rating: 5,
    sessionsCompleted: 0,
    active: true,
    createdAt: new Date(),
  };
  const { createdAt, rating, sessionsCompleted, ...updatable } = doc;
  await db.collection('mentor_profiles').updateOne(
    { lbId: opts.lbId },
    {
      $set: updatable,
      $setOnInsert: { createdAt, rating, sessionsCompleted },
    },
    { upsert: true },
  );
  await grantRole(opts.lbId, 'mentor', opts.name);
}

export async function getMentorProfile(lbId: string): Promise<MentorProfileDoc | null> {
  try {
    const db = await getDb();
    const doc = await db
      .collection('mentor_profiles')
      .findOne({ lbId }, { projection: { _id: 0 } });
    return (doc as unknown as MentorProfileDoc) ?? null;
  } catch {
    return null;
  }
}

export async function updateMentorProfile(
  lbId: string,
  patch: Partial<Pick<MentorProfileDoc, 'title' | 'bio' | 'expertise' | 'priceXAF' | 'sessionMinutes' | 'slots' | 'active'>>,
) {
  const db = await getDb();
  await db.collection('mentor_profiles').updateOne({ lbId }, { $set: patch });
}

/** Full mentor directory: seed mentors + live mentor profiles. */
export async function getAllMentors(): Promise<Mentor[]> {
  let dynamic: Mentor[] = [];
  try {
    const db = await getDb();
    const docs = await db
      .collection('mentor_profiles')
      .find({ active: true }, { projection: { _id: 0 } })
      .toArray();
    dynamic = (docs as unknown as MentorProfileDoc[]).map((d) => ({
      id: d.lbId,
      name: d.name,
      title: d.title,
      expertise: d.expertise,
      bio: d.bio,
      rating: d.rating,
      sessionsCompleted: d.sessionsCompleted,
      languages: d.languages,
      priceXAF: d.priceXAF,
      sessionMinutes: d.sessionMinutes,
      accent: d.accent,
      initials: d.initials,
      slots: d.slots,
    }));
  } catch {
    /* directory still works from seed */
  }
  const dynamicIds = new Set(dynamic.map((m) => m.id));
  return [...dynamic, ...MENTORS.filter((m) => !dynamicIds.has(m.id))];
}

export async function findMentor(id: string): Promise<Mentor | null> {
  const all = await getAllMentors();
  return all.find((m) => m.id === id) ?? null;
}

/** Sessions booked with this mentor (for the mentor dashboard). */
export async function getMentorBookings(mentorId: string) {
  try {
    const db = await getDb();
    const docs = await db
      .collection('bookings')
      .find({ mentorId })
      .sort({ scheduledAt: 1 })
      .toArray();
    return docs.map((d) => ({
      id: d._id.toString(),
      userId: d.userId as string,
      topic: d.topic as string,
      scheduledAt: d.scheduledAt as Date,
      durationMinutes: d.durationMinutes as number,
      channel: d.channel as string,
      status: d.status as string,
      priceXAF: (d.priceXAF as number) ?? 0,
    }));
  } catch {
    return [];
  }
}

// ── Books (library + mentor publishing portal) ────────────────────────────────

export interface BookChapter {
  title: string;
  content: string;
}

export interface BookDoc {
  _id?: ObjectId;
  authorId: string;
  authorName: string;
  title: string;
  subtitle: string;
  description: string;
  category: string;
  coverColor: string;
  coverEmoji: string;
  priceXAF: number;
  chapters: BookChapter[];
  published: boolean;
  sales: number;
  createdAt: Date;
  updatedAt: Date;
}

export type BookView = Omit<BookDoc, '_id'> & { id: string };

function toBookView(d: Record<string, unknown>): BookView {
  const { _id, ...rest } = d as unknown as BookDoc & { _id: ObjectId };
  return { ...(rest as Omit<BookDoc, '_id'>), id: _id.toString() };
}

export async function listPublishedBooks(): Promise<BookView[]> {
  try {
    await ensureLearnCollections();
    const db = await getDb();
    const docs = await db
      .collection('books')
      .find({ published: true })
      .sort({ createdAt: -1 })
      .toArray();
    return docs.map((d) => toBookView(d as Record<string, unknown>));
  } catch {
    return [];
  }
}

export async function listBooksByAuthor(authorId: string): Promise<BookView[]> {
  try {
    const db = await getDb();
    const docs = await db
      .collection('books')
      .find({ authorId })
      .sort({ updatedAt: -1 })
      .toArray();
    return docs.map((d) => toBookView(d as Record<string, unknown>));
  } catch {
    return [];
  }
}

export async function getBook(id: string): Promise<BookView | null> {
  try {
    const db = await getDb();
    const doc = await db.collection('books').findOne({ _id: new ObjectId(id) });
    return doc ? toBookView(doc as Record<string, unknown>) : null;
  } catch {
    return null;
  }
}

export async function createBook(opts: {
  authorId: string;
  authorName: string;
  title: string;
}): Promise<string> {
  await ensureLearnCollections();
  const db = await getDb();
  const doc: BookDoc = {
    authorId: opts.authorId,
    authorName: opts.authorName,
    title: opts.title.slice(0, 120) || 'Untitled book',
    subtitle: '',
    description: '',
    category: 'Programming',
    coverColor: '#00b369',
    coverEmoji: 'B',
    priceXAF: 0,
    chapters: [{ title: 'Chapter 1', content: '' }],
    published: false,
    sales: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  const res = await db
    .collection('books')
    .insertOne(doc as unknown as Record<string, unknown>);
  return res.insertedId.toString();
}

export async function updateBook(
  id: string,
  authorId: string,
  patch: Partial<
    Pick<
      BookDoc,
      | 'title'
      | 'subtitle'
      | 'description'
      | 'category'
      | 'coverColor'
      | 'coverEmoji'
      | 'priceXAF'
      | 'chapters'
      | 'published'
    >
  >,
) {
  const db = await getDb();
  await db
    .collection('books')
    .updateOne(
      { _id: new ObjectId(id), authorId },
      { $set: { ...patch, updatedAt: new Date() } },
    );
}

export async function purchaseBook(userId: string, book: BookView) {
  const db = await getDb();
  const res = await db.collection('book_purchases').updateOne(
    { userId, bookId: book.id },
    {
      $setOnInsert: {
        userId,
        bookId: book.id,
        priceXAF: book.priceXAF,
        authorId: book.authorId,
        createdAt: new Date(),
      },
    },
    { upsert: true },
  );
  if (res.upsertedCount > 0 && book.priceXAF > 0) {
    await db
      .collection('books')
      .updateOne({ _id: new ObjectId(book.id) }, { $inc: { sales: 1 } });
  }
}

export async function getPurchasedBookIds(userId: string): Promise<Set<string>> {
  try {
    const db = await getDb();
    const docs = await db
      .collection('book_purchases')
      .find({ userId }, { projection: { bookId: 1 } })
      .toArray();
    return new Set(docs.map((d) => d.bookId as string));
  } catch {
    return new Set();
  }
}

/** Author earnings from paid book sales. */
export async function getBookEarnings(authorId: string): Promise<number> {
  try {
    const db = await getDb();
    const rows = await db
      .collection('book_purchases')
      .aggregate([
        { $match: { authorId, priceXAF: { $gt: 0 } } },
        { $group: { _id: null, total: { $sum: '$priceXAF' } } },
      ])
      .toArray();
    return (rows[0]?.total as number) ?? 0;
  } catch {
    return 0;
  }
}

// ── Institutions (multi-tenant EduOS foundation) ──────────────────────────────

export interface InstitutionDoc {
  slug: string;
  name: string;
  tagline: string;
  about: string;
  color: string;
  emoji: string;
  visibility: 'public' | 'private';
  ownerId: string;
  ownerName: string;
  memberCount: number;
  createdAt: Date;
}

export interface InstitutionPostDoc {
  _id?: ObjectId;
  institutionSlug: string;
  authorId: string;
  authorName: string;
  title: string;
  body: string;
  createdAt: Date;
}

export function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 48);
}

export async function createInstitution(opts: {
  name: string;
  tagline: string;
  about: string;
  color: string;
  emoji: string;
  visibility: 'public' | 'private';
  ownerId: string;
  ownerName: string;
}): Promise<{ slug: string } | { error: string }> {
  await ensureLearnCollections();
  const db = await getDb();
  const slug = slugify(opts.name);
  if (!slug) return { error: 'invalid_name' };
  const exists = await db.collection('institutions').findOne({ slug });
  if (exists) return { error: 'slug_taken' };
  const doc: InstitutionDoc = {
    slug,
    name: opts.name.slice(0, 80),
    tagline: opts.tagline.slice(0, 140),
    about: opts.about.slice(0, 2000),
    color: /^#[0-9a-fA-F]{6}$/.test(opts.color) ? opts.color : '#00b369',
    emoji: opts.emoji.slice(0, 4) || '',
    visibility: opts.visibility === 'private' ? 'private' : 'public',
    ownerId: opts.ownerId,
    ownerName: opts.ownerName,
    memberCount: 1,
    createdAt: new Date(),
  };
  await db.collection('institutions').insertOne(doc as unknown as Record<string, unknown>);
  await db.collection('institution_members').insertOne({
    institutionSlug: slug,
    userId: opts.ownerId,
    userName: opts.ownerName,
    role: 'owner',
    joinedAt: new Date(),
  });
  return { slug };
}

export async function listPublicInstitutions(): Promise<InstitutionDoc[]> {
  try {
    await ensureLearnCollections();
    const db = await getDb();
    const docs = await db
      .collection('institutions')
      .find({ visibility: 'public' }, { projection: { _id: 0 } })
      .sort({ memberCount: -1, createdAt: 1 })
      .toArray();
    return docs as unknown as InstitutionDoc[];
  } catch {
    return [];
  }
}

export async function getInstitution(slug: string): Promise<InstitutionDoc | null> {
  try {
    await ensureLearnCollections();
    const db = await getDb();
    const doc = await db
      .collection('institutions')
      .findOne({ slug }, { projection: { _id: 0 } });
    return (doc as unknown as InstitutionDoc) ?? null;
  } catch {
    return null;
  }
}

export async function getMembership(
  slug: string,
  userId: string,
): Promise<'owner' | 'member' | null> {
  try {
    const db = await getDb();
    const doc = await db
      .collection('institution_members')
      .findOne({ institutionSlug: slug, userId });
    return (doc?.role as 'owner' | 'member') ?? null;
  } catch {
    return null;
  }
}

export async function joinInstitution(slug: string, userId: string, userName: string) {
  const db = await getDb();
  const res = await db.collection('institution_members').updateOne(
    { institutionSlug: slug, userId },
    { $setOnInsert: { institutionSlug: slug, userId, userName, role: 'member', joinedAt: new Date() } },
    { upsert: true },
  );
  if (res.upsertedCount > 0) {
    await db.collection('institutions').updateOne({ slug }, { $inc: { memberCount: 1 } });
  }
}

export async function myInstitutionSlugs(userId: string): Promise<Set<string>> {
  try {
    const db = await getDb();
    const docs = await db
      .collection('institution_members')
      .find({ userId }, { projection: { institutionSlug: 1 } })
      .toArray();
    return new Set(docs.map((d) => d.institutionSlug as string));
  } catch {
    return new Set();
  }
}

export async function listInstitutionPosts(slug: string): Promise<(InstitutionPostDoc & { id: string })[]> {
  try {
    const db = await getDb();
    const docs = await db
      .collection('institution_posts')
      .find({ institutionSlug: slug })
      .sort({ createdAt: -1 })
      .limit(30)
      .toArray();
    return docs.map((d) => ({ ...(d as unknown as InstitutionPostDoc), id: d._id.toString() }));
  } catch {
    return [];
  }
}

export async function createInstitutionPost(opts: {
  institutionSlug: string;
  authorId: string;
  authorName: string;
  title: string;
  body: string;
}) {
  const db = await getDb();
  await db.collection('institution_posts').insertOne({
    institutionSlug: opts.institutionSlug,
    authorId: opts.authorId,
    authorName: opts.authorName,
    title: opts.title.slice(0, 140),
    body: opts.body.slice(0, 4000),
    createdAt: new Date(),
  });
}

// ── Admin overview ────────────────────────────────────────────────────────────

export async function getAdminLearningOverview() {
  await ensureLearnCollections();
  const db = await getDb();
  const collections: { name: string; count: number }[] = [];
  for (const name of LEARN_COLLECTIONS) {
    collections.push({ name, count: await db.collection(name).countDocuments() });
  }
  const [recentLearners, recentEnrollments, recentBookings, recentBooks, recentInstitutions] =
    await Promise.all([
      db.collection('learners').find({}, { projection: { _id: 0, lbId: 1, name: 1, email: 1, xp: 1, streakCount: 1, roles: 1, lastLoginAt: 1 } }).sort({ lastLoginAt: -1 }).limit(25).toArray(),
      db.collection('enrollments').find({}, { projection: { _id: 0 } }).sort({ enrolledAt: -1 }).limit(25).toArray(),
      db.collection('bookings').find({}).sort({ createdAt: -1 }).limit(25).toArray(),
      db.collection('books').find({}, { projection: { chapters: 0 } }).sort({ createdAt: -1 }).limit(25).toArray(),
      db.collection('institutions').find({}, { projection: { _id: 0 } }).sort({ createdAt: -1 }).limit(25).toArray(),
    ]);
  const revenueRows = await db
    .collection('book_purchases')
    .aggregate([{ $match: { priceXAF: { $gt: 0 } } }, { $group: { _id: null, total: { $sum: '$priceXAF' } } }])
    .toArray();
  return {
    collections,
    bookRevenueXAF: (revenueRows[0]?.total as number) ?? 0,
    recentLearners,
    recentEnrollments,
    recentBookings: recentBookings.map((b) => ({ ...b, _id: b._id.toString() })),
    recentBooks: recentBooks.map((b) => ({ ...b, _id: b._id.toString() })),
    recentInstitutions,
  };
}

// ── Seeds ─────────────────────────────────────────────────────────────────────

async function seedIntellexInstitution(db: Awaited<ReturnType<typeof getDb>>) {
  const exists = await db.collection('institutions').findOne({ slug: 'intellex' });
  if (exists) return;
  await db.collection('institutions').insertOne({
    slug: 'intellex',
    name: 'Intellex',
    tagline: 'The home campus of the Intellex learning ecosystem',
    about:
      'Intellex is the founding institution of the ecosystem — public courses, mentorship, certifications, career programs and communities. Other schools, academies and companies can open their own campus and run it alongside Intellex.',
    color: '#00b369',
    emoji: '',
    visibility: 'public',
    ownerId: 'system',
    ownerName: 'Intellex',
    memberCount: 0,
    createdAt: new Date(),
  });
}

const SEED_BOOKS: Array<
  Pick<BookDoc, 'title' | 'subtitle' | 'description' | 'category' | 'coverColor' | 'coverEmoji' | 'chapters'>
> = [
  {
    title: 'The Intellex Web Developer Handbook',
    subtitle: 'From your first HTML tag to a deployed product',
    description:
      'A practical companion to the Intellex web tracks — how the pieces fit together, how to structure projects, and how to think like a working developer.',
    category: 'Programming',
    coverColor: '#00b369',
    coverEmoji: 'G',
    chapters: [
      {
        title: 'How the web actually works',
        content:
          'Every website you visit is a conversation between two computers.\n\nYour browser (the client) asks a server for a page. The server answers with **HTML** (structure), **CSS** (style) and **JavaScript** (behaviour). Everything else — frameworks, databases, APIs — exists to make that conversation richer.\n\nKey ideas:\n- A URL is an address, DNS is the phonebook that resolves it.\n- HTTP is the language of the request/response cycle.\n- The browser builds a DOM from HTML and paints it to the screen.\n\n```text\nBrowser ──request──▶ Server\nBrowser ◀─response── Server (HTML + CSS + JS)\n```\n\nWhen you understand this loop, every technology you learn afterwards has a place to live in your mental model.',
      },
      {
        title: 'Structuring your first real project',
        content:
          'Beginners write files. Developers design folders.\n\nA simple, scalable structure:\n\n```text\nmy-app/\n├── index.html\n├── css/\n│   └── styles.css\n├── js/\n│   └── main.js\n└── assets/\n    └── images/\n```\n\nRules that keep projects healthy:\n- One responsibility per file.\n- Name things for what they do, not what they are.\n- Commit early and often with git.\n\nAs your projects grow, this discipline is what separates a portfolio that impresses from one that scares reviewers away.',
      },
      {
        title: 'From localhost to the internet',
        content:
          'A project that only runs on your laptop is a rehearsal, not a performance.\n\nThe modern deployment path:\n1. Push your code to GitHub.\n2. Connect the repository to a host (Vercel, Netlify, or a VPS).\n3. Every push becomes a live deployment.\n\nThings to check before you ship:\n- Images are compressed.\n- The site works on a phone.\n- Links, forms and titles are correct.\n\nShip small, ship often. Deployed beats perfect.',
      },
    ],
  },
  {
    title: 'Python Cheatsheet Collection',
    subtitle: 'Syntax, patterns and standard-library gems on tap',
    description:
      'The fastest reference for the Intellex Python track: core syntax, data structures, comprehensions, file handling and the patterns you will use every single day.',
    category: 'Programming',
    coverColor: '#3572A5',
    coverEmoji: 'P',
    chapters: [
      {
        title: 'Core syntax at a glance',
        content:
          'Variables, types and control flow — the 20% of Python you use 80% of the time.\n\n```python\nname = "Ada"            # str\nage = 36                 # int\nskills = ["ml", "math"] # list\nprofile = {"name": name, "age": age}  # dict\n\nif age >= 18:\n    print(f"{name} is an adult")\n\nfor skill in skills:\n    print(skill.upper())\n```\n\nRemember: indentation *is* syntax in Python. Four spaces, always.',
      },
      {
        title: 'Comprehensions and slicing',
        content:
          'Pythonic code is compact without being cryptic.\n\n```python\nnums = [1, 2, 3, 4, 5, 6]\n\nevens = [n for n in nums if n % 2 == 0]      # [2, 4, 6]\nsquares = {n: n * n for n in nums}            # dict comprehension\nfirst_three = nums[:3]                        # [1, 2, 3]\nreversed_all = nums[::-1]                     # [6, 5, 4, 3, 2, 1]\n```\n\nIf a comprehension needs more than one condition and one transform, use a regular loop — readability wins.',
      },
      {
        title: 'Files, errors and the standard library',
        content:
          'The patterns you will reach for daily:\n\n```python\nfrom pathlib import Path\nimport json\n\n# Read and write files safely\ndata = json.loads(Path("config.json").read_text())\n\ntry:\n    value = data["missing_key"]\nexcept KeyError:\n    value = "default"\n\nPath("output.txt").write_text("done\\n")\n```\n\nExplore `collections`, `itertools`, and `datetime` before installing a package — the standard library probably already solves it.',
      },
    ],
  },
  {
    title: 'The Career Switch Playbook',
    subtitle: 'A field guide for breaking into tech from anywhere',
    description:
      'How to go from learning to earning: building proof of skill, positioning yourself, finding your first clients or job, and growing once you are in.',
    category: 'Career',
    coverColor: '#7c3aed',
    coverEmoji: 'R',
    chapters: [
      {
        title: 'Proof beats promises',
        content:
          'Nobody hires potential they cannot see.\n\nYour portfolio is your proof. Three focused projects beat thirty tutorials:\n1. **A clone** — proves you can execute (rebuild a real product screen).\n2. **A tool** — proves you can think (solve a problem you actually have).\n3. **A collaboration** — proves you can work with others (contribute or pair up).\n\nEach project needs: a live link, a clear README, and a short write-up of decisions you made. That write-up is what interviewers actually read.',
      },
      {
        title: 'Positioning and the first opportunity',
        content:
          'The market does not reward the most skilled — it rewards the most legible.\n\nMake yourself easy to say yes to:\n- One sentence bio: "I build X for Y using Z."\n- A LinkedIn/GitHub that matches that sentence.\n- Evidence pinned at the top.\n\nFirst opportunities rarely come from job boards. They come from:\n- People who watched you learn in public.\n- Small businesses near you with real problems.\n- Communities where you consistently helped others.\n\nDo work worth talking about, then talk about it.',
      },
    ],
  },
];

async function seedBooks(db: Awaited<ReturnType<typeof getDb>>) {
  const count = await db.collection('books').countDocuments();
  if (count > 0) return;
  const now = new Date();
  await db.collection('books').insertMany(
    SEED_BOOKS.map((b) => ({
      ...b,
      authorId: 'system',
      authorName: 'Intellex Library',
      priceXAF: 0,
      published: true,
      sales: 0,
      createdAt: now,
      updatedAt: now,
    })),
  );
}
