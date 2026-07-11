import { ObjectId } from 'mongodb';
import clientPromise from '@/lib/mongodb';
import { Course, ContactRequest, Order } from '@/lib/types';
import { PLATFORM_COURSES } from '@/lib/data/platformCourses';
import { IMPORTED_COURSES } from '@/lib/data/importedCourses';

const DB_NAME = 'intellex';

export async function getDb() {
  const client = await clientPromise;
  return client.db(DB_NAME);
}

/** The full catalogue as defined in code (platform programs first). */
export function allSeedCourses(): Course[] {
  return [...PLATFORM_COURSES, ...IMPORTED_COURSES];
}

/**
 * Seed the `courses` collection from the code-defined catalogue if it is empty.
 * Idempotent: only inserts when the collection has no documents.
 */
export async function ensureCoursesSeeded() {
  const db = await getDb();
  const col = db.collection('courses');
  const count = await col.countDocuments();
  if (count === 0) {
    await col.insertMany(allSeedCourses() as unknown as Record<string, unknown>[]);
    await col.createIndex({ slug: 1 }, { unique: true }).catch(() => {});
    return;
  }
  // Add-only sync: insert any newly-added Intellex-curated (platform) courses
  // that aren't in an already-seeded collection. Never overwrites admin edits.
  const slugs = PLATFORM_COURSES.map((c) => c.slug);
  const existing = await col
    .find({ slug: { $in: slugs } }, { projection: { slug: 1 } })
    .toArray();
  const have = new Set(existing.map((d) => (d as unknown as { slug: string }).slug));
  const missing = PLATFORM_COURSES.filter((c) => !have.has(c.slug));
  if (missing.length) {
    await col.insertMany(missing as unknown as Record<string, unknown>[]);
  }
}

export async function getAllCourses(): Promise<Course[]> {
  try {
    await ensureCoursesSeeded();
    const db = await getDb();
    const docs = await db
      .collection('courses')
      .find({}, { projection: { _id: 0 } })
      .toArray();
    if (docs.length) return docs as unknown as Course[];
    return allSeedCourses();
  } catch (err) {
    // Never hard-fail the catalogue: fall back to the code-defined courses.
    console.error('getAllCourses fell back to static seed:', err);
    return allSeedCourses();
  }
}

export async function getFeaturedCourses(): Promise<Course[]> {
  const courses = await getAllCourses();
  return courses.filter((c) => c.featured);
}

/** Admin view: full catalogue including the Mongo `_id` (as string) for editing. */
export async function getAllCoursesAdmin(): Promise<(Course & { _id: string })[]> {
  await ensureCoursesSeeded();
  const db = await getDb();
  const docs = await db.collection('courses').find({}).sort({ featured: -1, name: 1 }).toArray();
  return docs.map((d) => ({ ...(d as unknown as Course), _id: d._id.toString() }));
}

export async function updateCourseById(id: string, patch: Partial<Course>) {
  const db = await getDb();
  await db.collection('courses').updateOne({ _id: new ObjectId(id) }, { $set: patch });
}

export async function createCourseDoc(course: Course) {
  const db = await getDb();
  const res = await db.collection('courses').insertOne(course as unknown as Record<string, unknown>);
  return res.insertedId.toString();
}

export async function deleteCourseById(id: string) {
  const db = await getDb();
  await db.collection('courses').deleteOne({ _id: new ObjectId(id) });
}

export async function getCourseBySlug(slug: string): Promise<Course | null> {
  try {
    await ensureCoursesSeeded();
    const db = await getDb();
    const doc = await db
      .collection('courses')
      .findOne({ slug }, { projection: { _id: 0 } });
    if (doc) return doc as unknown as Course;
    return allSeedCourses().find((c) => c.slug === slug) ?? null;
  } catch (err) {
    console.error('getCourseBySlug fell back to static seed:', err);
    return allSeedCourses().find((c) => c.slug === slug) ?? null;
  }
}

export async function createRequest(req: ContactRequest) {
  const db = await getDb();
  const res = await db.collection('requests').insertOne(req);
  return res.insertedId;
}

export async function createOrder(order: Order) {
  const db = await getDb();
  const res = await db.collection('orders').insertOne(order);
  return res.insertedId;
}

export async function getOrderByTransaction(transactionId: string): Promise<Order | null> {
  const db = await getDb();
  const doc = await db
    .collection('orders')
    .findOne({ transactionId }, { projection: { _id: 0 } });
  return (doc as unknown as Order) ?? null;
}

export async function updateOrderStatus(
  transactionId: string,
  status: Order['status'],
) {
  const db = await getDb();
  await db.collection('orders').updateOne(
    { transactionId },
    { $set: { status, paidAt: status === 'paid' ? new Date() : null } },
  );
}
