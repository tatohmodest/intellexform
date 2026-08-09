import { ObjectId } from 'mongodb';
import clientPromise from '@/lib/mongodb';
import { Course, ContactRequest, Order } from '@/lib/types';

const DB_NAME = 'intellex';

export async function getDb() {
  const client = await clientPromise;
  return client.db(DB_NAME);
}

/**
 * Live Mongo catalogue only - no static / imported seed fallback.
 * Courses are created by admins or instructors, not auto-seeded from mock files.
 */
export async function getAllCourses(): Promise<Course[]> {
  try {
    const db = await getDb();
    const docs = await db
      .collection('courses')
      .find({}, { projection: { _id: 0 } })
      .toArray();
    return docs as unknown as Course[];
  } catch (err) {
    console.error('getAllCourses failed:', err);
    return [];
  }
}

export async function getFeaturedCourses(): Promise<Course[]> {
  const courses = await getAllCourses();
  return courses.filter((c) => c.featured);
}

/** Admin view: full catalogue including the Mongo `_id` (as string) for editing. */
export async function getAllCoursesAdmin(): Promise<(Course & { _id: string })[]> {
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
    const db = await getDb();
    const cleanSlug = decodeURIComponent(slug);
    const numId = Number(cleanSlug);
    const doc = await db.collection('courses').findOne(
      {
        $or: [
          { slug: cleanSlug },
          { slug: slug },
          { id: cleanSlug },
          { id: !isNaN(numId) ? numId : cleanSlug },
          { name: { $regex: cleanSlug.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&'), $options: 'i' } },
        ],
      },
      { projection: { _id: 0 } },
    );
    return (doc as unknown as Course) ?? null;
  } catch (err) {
    console.error('getCourseBySlug failed:', err);
    return null;
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
