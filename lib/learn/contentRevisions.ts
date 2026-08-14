/**
 * Content revision snapshots for teacher courses & assessments.
 */

import { ObjectId } from 'mongodb';
import { getDb } from '@/lib/repo';
import { ensureLearnCollections } from '@/lib/learn/ecosystem';

export type ContentEntityType = 'teacher_course' | 'assessment' | 'book';

export type ContentRevisionView = {
  id: string;
  entityType: ContentEntityType;
  entityId: string;
  version: number;
  label: string;
  authorId: string;
  authorName: string;
  createdAt: string;
};

async function ensure() {
  await ensureLearnCollections();
  const db = await getDb();
  const names = new Set(
    (await db.listCollections({}, { nameOnly: true }).toArray()).map((c) => c.name),
  );
  if (!names.has('content_revisions')) {
    await db.createCollection('content_revisions').catch(() => {});
  }
  await db
    .collection('content_revisions')
    .createIndex({ entityType: 1, entityId: 1, version: -1 })
    .catch(() => {});
  return db;
}

export async function recordContentRevision(opts: {
  entityType: ContentEntityType;
  entityId: string;
  snapshot: Record<string, unknown>;
  authorId: string;
  authorName: string;
  label?: string;
}): Promise<ContentRevisionView> {
  const db = await ensure();
  const latest = await db
    .collection('content_revisions')
    .find({ entityType: opts.entityType, entityId: opts.entityId })
    .sort({ version: -1 })
    .limit(1)
    .toArray();
  const version = latest.length ? Number(latest[0].version || 0) + 1 : 1;
  const doc = {
    entityType: opts.entityType,
    entityId: opts.entityId,
    version,
    label: opts.label || `v${version}`,
    authorId: opts.authorId,
    authorName: opts.authorName.slice(0, 80),
    snapshot: opts.snapshot,
    createdAt: new Date(),
  };
  const res = await db.collection('content_revisions').insertOne(doc);
  return {
    id: res.insertedId.toString(),
    entityType: opts.entityType,
    entityId: opts.entityId,
    version,
    label: doc.label,
    authorId: opts.authorId,
    authorName: doc.authorName,
    createdAt: doc.createdAt.toISOString(),
  };
}

export async function listContentRevisions(
  entityType: ContentEntityType,
  entityId: string,
  limit = 20,
): Promise<ContentRevisionView[]> {
  const db = await ensure();
  const docs = await db
    .collection('content_revisions')
    .find({ entityType, entityId })
    .project({ snapshot: 0 })
    .sort({ version: -1 })
    .limit(limit)
    .toArray();
  return docs.map((d) => ({
    id: String((d._id as ObjectId).toString()),
    entityType: d.entityType as ContentEntityType,
    entityId: String(d.entityId),
    version: Number(d.version),
    label: String(d.label || `v${d.version}`),
    authorId: String(d.authorId),
    authorName: String(d.authorName || ''),
    createdAt: new Date(d.createdAt as string | Date).toISOString(),
  }));
}

export async function getContentRevisionSnapshot(
  revisionId: string,
): Promise<{ snapshot: Record<string, unknown>; meta: ContentRevisionView } | null> {
  const db = await ensure();
  let oid: ObjectId;
  try {
    oid = new ObjectId(revisionId);
  } catch {
    return null;
  }
  const d = await db.collection('content_revisions').findOne({ _id: oid });
  if (!d) return null;
  return {
    snapshot: (d.snapshot as Record<string, unknown>) || {},
    meta: {
      id: oid.toString(),
      entityType: d.entityType as ContentEntityType,
      entityId: String(d.entityId),
      version: Number(d.version),
      label: String(d.label || `v${d.version}`),
      authorId: String(d.authorId),
      authorName: String(d.authorName || ''),
      createdAt: new Date(d.createdAt as string | Date).toISOString(),
    },
  };
}

/** Restore a snapshot onto the live teacher_course / assessment (as draft). */
export async function restoreContentRevision(opts: {
  revisionId: string;
  editorId: string;
}): Promise<{ ok: true; entityType: ContentEntityType; entityId: string } | { ok: false; error: string }> {
  const packed = await getContentRevisionSnapshot(opts.revisionId);
  if (!packed) return { ok: false, error: 'not_found' };
  const { snapshot, meta } = packed;
  const db = await getDb();

  if (meta.entityType === 'teacher_course') {
    let oid: ObjectId;
    try {
      oid = new ObjectId(meta.entityId);
    } catch {
      return { ok: false, error: 'bad_id' };
    }
    const existing = await db.collection('teacher_courses').findOne({
      _id: oid,
      $or: [{ authorId: opts.editorId }, { instructorId: opts.editorId }],
    });
    if (!existing) return { ok: false, error: 'forbidden' };
    const {
      _id: _drop,
      createdAt: _c,
      ...rest
    } = snapshot as Record<string, unknown> & { _id?: unknown; createdAt?: unknown };
    await db.collection('teacher_courses').updateOne(
      { _id: oid },
      {
        $set: {
          ...rest,
          published: false,
          updatedAt: new Date(),
          restoredFromVersion: meta.version,
        },
      },
    );
    return { ok: true, entityType: meta.entityType, entityId: meta.entityId };
  }

  if (meta.entityType === 'assessment') {
    let oid: ObjectId;
    try {
      oid = new ObjectId(meta.entityId);
    } catch {
      return { ok: false, error: 'bad_id' };
    }
    const existing = await db.collection('assessments').findOne({
      _id: oid,
      authorId: opts.editorId,
    });
    if (!existing) return { ok: false, error: 'forbidden' };
    const {
      _id: _drop,
      createdAt: _c,
      ...rest
    } = snapshot as Record<string, unknown> & { _id?: unknown; createdAt?: unknown };
    await db.collection('assessments').updateOne(
      { _id: oid },
      {
        $set: {
          ...rest,
          published: false,
          updatedAt: new Date(),
          restoredFromVersion: meta.version,
        },
      },
    );
    return { ok: true, entityType: meta.entityType, entityId: meta.entityId };
  }

  return { ok: false, error: 'unsupported' };
}
