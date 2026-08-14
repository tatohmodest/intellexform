/**
 * Per-lesson personal study notes (linked to course + lesson).
 */

import { ObjectId } from 'mongodb';
import { getDb } from '@/lib/repo';
import { ensureLearnCollections } from '@/lib/learn/ecosystem';

export type LessonNoteView = {
  id: string;
  userId: string;
  courseKey: string;
  lessonKey: string;
  body: string;
  timestampSec: number | null;
  updatedAt: string;
};

async function col() {
  await ensureLearnCollections();
  const db = await getDb();
  await db
    .collection('lesson_study_notes')
    .createIndex({ userId: 1, courseKey: 1, lessonKey: 1 }, { unique: true })
    .catch(() => {});
  return db.collection('lesson_study_notes');
}

function toView(d: Record<string, unknown>): LessonNoteView {
  return {
    id: String((d._id as ObjectId).toString()),
    userId: String(d.userId),
    courseKey: String(d.courseKey),
    lessonKey: String(d.lessonKey),
    body: String(d.body || ''),
    timestampSec: typeof d.timestampSec === 'number' ? d.timestampSec : null,
    updatedAt: new Date(d.updatedAt as string | Date).toISOString(),
  };
}

export async function getLessonNote(opts: {
  userId: string;
  courseKey: string;
  lessonKey: string;
}): Promise<LessonNoteView | null> {
  try {
    const c = await col();
    const doc = await c.findOne({
      userId: opts.userId,
      courseKey: opts.courseKey,
      lessonKey: opts.lessonKey,
    });
    return doc ? toView(doc as Record<string, unknown>) : null;
  } catch {
    return null;
  }
}

export async function upsertLessonNote(opts: {
  userId: string;
  courseKey: string;
  lessonKey: string;
  body: string;
  timestampSec?: number | null;
}): Promise<LessonNoteView> {
  const c = await col();
  const now = new Date();
  await c.updateOne(
    {
      userId: opts.userId,
      courseKey: opts.courseKey,
      lessonKey: opts.lessonKey,
    },
    {
      $set: {
        body: opts.body.slice(0, 20_000),
        timestampSec: opts.timestampSec ?? null,
        updatedAt: now,
      },
      $setOnInsert: {
        userId: opts.userId,
        courseKey: opts.courseKey,
        lessonKey: opts.lessonKey,
        createdAt: now,
      },
    },
    { upsert: true },
  );
  const doc = await c.findOne({
    userId: opts.userId,
    courseKey: opts.courseKey,
    lessonKey: opts.lessonKey,
  });
  return toView(doc as Record<string, unknown>);
}

export async function listLessonNotesForUser(userId: string, take = 50): Promise<LessonNoteView[]> {
  try {
    const c = await col();
    const docs = await c.find({ userId }).sort({ updatedAt: -1 }).limit(take).toArray();
    return docs.map((d) => toView(d as Record<string, unknown>));
  } catch {
    return [];
  }
}
