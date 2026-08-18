/**
 * Institutional Data Workspace — dynamic datasets, forms, records.
 * Structured Mongo documents (not a spreadsheet blob) with search, audit, and permissions.
 */

import { ObjectId, type Filter } from 'mongodb';
import { getDb } from '@/lib/repo';
import { getLearner } from '@/lib/learn/repo';
import { getStudentMembership } from '@/lib/learn/studentAccess';
import { createNotification } from '@/lib/learn/notifications';
import { StaffAuthError, type StaffActor } from '@/lib/staff/store';
import { listCampuses } from '@/lib/staff/org';
import {
  DATASET_TEMPLATES,
  makeField,
  type DataField,
  type DatasetVisibility,
  type SubmitAccess,
} from '@/lib/staff/dataTypes';
import { isLLMConfigured } from '@/lib/learn/tutor';
import type { StaffDesk } from '@/lib/staff/permissions';

async function cols() {
  const db = await getDb();
  await Promise.all([
    db.collection('data_datasets').createIndex({ slug: 1 }, { unique: true }).catch(() => {}),
    db.collection('data_datasets').createIndex({ ownerId: 1, updatedAt: -1 }).catch(() => {}),
    db.collection('data_records').createIndex({ datasetId: 1, deletedAt: 1, createdAt: -1 }).catch(() => {}),
    db.collection('data_records').createIndex({ datasetId: 1, searchText: 1 }).catch(() => {}),
    db.collection('data_records').createIndex({ datasetId: 1, status: 1 }).catch(() => {}),
    db.collection('data_audit').createIndex({ datasetId: 1, createdAt: -1 }).catch(() => {}),
    db.collection('data_audit').createIndex({ recordId: 1, createdAt: -1 }).catch(() => {}),
  ]);
  return {
    datasets: db.collection('data_datasets'),
    records: db.collection('data_records'),
    audit: db.collection('data_audit'),
  };
}

function slugify(name: string) {
  const base = name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40) || 'dataset';
  return `${base}-${Math.random().toString(36).slice(2, 6)}`;
}

export type DatasetDoc = {
  id: string;
  name: string;
  description: string;
  category: string;
  slug: string;
  ownerId: string;
  ownerName: string;
  status: 'active' | 'archived';
  visibility: DatasetVisibility;
  submitAccess: SubmitAccess;
  accessDesks: StaffDesk[];
  statuses: string[];
  defaultStatus: string;
  maxSubmissions: number | null;
  openAt: string | null;
  closeAt: string | null;
  fields: DataField[];
  recordCount: number;
  fieldCount: number;
  createdAt: string;
  updatedAt: string;
};

function datasetView(d: Record<string, unknown>, recordCount = 0): DatasetDoc {
  const fields = Array.isArray(d.fields) ? (d.fields as DataField[]) : [];
  return {
    id: String(d._id),
    name: String(d.name),
    description: String(d.description || ''),
    category: String(d.category || 'Custom'),
    slug: String(d.slug),
    ownerId: String(d.ownerId),
    ownerName: String(d.ownerName || ''),
    status: d.status === 'archived' ? 'archived' : 'active',
    visibility: (d.visibility as DatasetVisibility) || 'internal',
    submitAccess: (d.submitAccess as SubmitAccess) || 'staff',
    accessDesks: Array.isArray(d.accessDesks) ? (d.accessDesks as StaffDesk[]) : [],
    statuses: Array.isArray(d.statuses) && d.statuses.length ? (d.statuses as string[]) : ['New'],
    defaultStatus: String(d.defaultStatus || (d.statuses as string[])?.[0] || 'New'),
    maxSubmissions: d.maxSubmissions != null ? Number(d.maxSubmissions) : null,
    openAt: d.openAt ? new Date(d.openAt as Date).toISOString() : null,
    closeAt: d.closeAt ? new Date(d.closeAt as Date).toISOString() : null,
    fields,
    recordCount,
    fieldCount: fields.length,
    createdAt: new Date(d.createdAt as Date).toISOString(),
    updatedAt: new Date(d.updatedAt as Date).toISOString(),
  };
}

function canSeeDataset(actor: StaffActor, d: Record<string, unknown>) {
  if (actor.permissions.includes('data.manage')) return true;
  if (String(d.ownerId) === actor.userId) return true;
  const desks = (d.accessDesks as string[]) || [];
  if (!desks.length) return actor.permissions.includes('data.read');
  return actor.post.desks.some((desk) => desks.includes(desk));
}

function visibleFields(actor: StaffActor, fields: DataField[]) {
  if (actor.permissions.includes('data.manage')) return fields;
  return fields.filter((f) => !f.sensitive);
}

async function audit(
  actor: { userId: string; name: string },
  opts: { datasetId: string; recordId?: string; action: string; before?: unknown; after?: unknown },
) {
  const { audit } = await cols();
  await audit.insertOne({
    datasetId: opts.datasetId,
    recordId: opts.recordId || null,
    actorId: actor.userId,
    actorName: actor.name,
    action: opts.action,
    before: opts.before || null,
    after: opts.after || null,
    createdAt: new Date(),
  });
}

export type FillableDatasetCard = {
  id: string;
  name: string;
  description: string;
  category: string;
  slug: string;
  ownerName: string;
  submitAccess: SubmitAccess;
  updatedAt: string;
};

/**
 * Datasets an institution member can fill from their own dashboard,
 * including ones they did not create.
 */
export async function listFillableDatasetsForUser(opts: {
  userId: string;
  isStudent: boolean;
}): Promise<FillableDatasetCard[]> {
  void opts.userId;
  const access: SubmitAccess[] = ['public', 'authenticated'];
  if (opts.isStudent) access.push('students');
  const { datasets } = await cols();
  const docs = await datasets
    .find({
      deletedAt: { $in: [null, undefined] },
      status: { $ne: 'archived' },
      submitAccess: { $in: access },
    })
    .sort({ updatedAt: -1 })
    .limit(40)
    .toArray();
  return docs.map((d) => {
    const view = datasetView(d as Record<string, unknown>);
    return {
      id: view.id,
      name: view.name,
      description: view.description,
      category: view.category,
      slug: view.slug,
      ownerName: view.ownerName || 'Staff',
      submitAccess: view.submitAccess,
      updatedAt: view.updatedAt,
    };
  });
}

export async function listDatasets(actor: StaffActor) {
  const { datasets, records } = await cols();
  const docs = await datasets.find({ deletedAt: { $in: [null, undefined] } }).sort({ updatedAt: -1 }).limit(80).toArray();
  const visible = docs.filter((d) => canSeeDataset(actor, d as Record<string, unknown>));
  const out: DatasetDoc[] = [];
  for (const d of visible) {
    const n = await records.countDocuments({ datasetId: String(d._id), deletedAt: null });
    out.push(datasetView(d as Record<string, unknown>, n));
  }
  return out;
}

export async function createDataset(
  actor: StaffActor,
  opts: {
    name: string;
    description?: string;
    category?: string;
    templateId?: string;
    visibility?: DatasetVisibility;
    submitAccess?: SubmitAccess;
    accessDesks?: StaffDesk[];
    statuses?: string[];
  },
) {
  if (!actor.permissions.includes('data.write') && !actor.permissions.includes('data.manage')) {
    throw new StaffAuthError('You cannot create datasets.', 403);
  }
  const name = opts.name.trim().slice(0, 120);
  if (name.length < 2) throw new StaffAuthError('Give the dataset a name.', 400);
  const tmpl = DATASET_TEMPLATES.find((t) => t.id === opts.templateId) || DATASET_TEMPLATES.find((t) => t.id === 'blank')!;
  const fields = tmpl.fields.map((f) => makeField(f));
  const statuses = (opts.statuses && opts.statuses.length ? opts.statuses : tmpl.statuses).map((s) => s.trim()).filter(Boolean);
  const now = new Date();
  const { datasets } = await cols();
  const doc = {
    name,
    description: String(opts.description || tmpl.description).slice(0, 400),
    category: String(opts.category || tmpl.category),
    slug: slugify(name),
    ownerId: actor.userId,
    ownerName: actor.name,
    status: 'active',
    visibility: opts.visibility || 'internal',
    submitAccess: opts.submitAccess || 'staff',
    accessDesks: opts.accessDesks || [],
    statuses,
    defaultStatus: statuses[0] || 'New',
    maxSubmissions: null,
    openAt: null,
    closeAt: null,
    fields,
    createdAt: now,
    updatedAt: now,
    deletedAt: null,
  };
  const res = await datasets.insertOne(doc);
  await audit(actor, { datasetId: res.insertedId.toString(), action: 'dataset.create', after: { name } });
  return datasetView({ ...doc, _id: res.insertedId }, 0);
}

export async function getDataset(actor: StaffActor | null, idOrSlug: string, opts?: { public?: boolean }) {
  const { datasets, records } = await cols();
  const q: Filter<Record<string, unknown>> = ObjectId.isValid(idOrSlug)
    ? { _id: new ObjectId(idOrSlug) }
    : { slug: idOrSlug };
  const d = await datasets.findOne({ ...q, deletedAt: { $in: [null, undefined] } });
  if (!d) throw new StaffAuthError('Dataset not found.', 404);
  if (opts?.public) {
    if (d.submitAccess === 'staff' && d.visibility !== 'public') {
      throw new StaffAuthError('This form is not public.', 403);
    }
  } else if (!actor || !canSeeDataset(actor, d as Record<string, unknown>)) {
    throw new StaffAuthError('You cannot open this dataset.', 403);
  }
  const n = await records.countDocuments({ datasetId: String(d._id), deletedAt: null });
  const view = datasetView(d as Record<string, unknown>, n);
  if (actor && !opts?.public) view.fields = visibleFields(actor, view.fields);
  return view;
}

export async function updateDataset(actor: StaffActor, id: string, patch: Record<string, unknown>) {
  if (!actor.permissions.includes('data.write') && !actor.permissions.includes('data.manage')) {
    throw new StaffAuthError('You cannot edit this dataset.', 403);
  }
  const current = await getDataset(actor, id);
  const { datasets } = await cols();
  const next: Record<string, unknown> = { updatedAt: new Date() };
  if (typeof patch.name === 'string' && patch.name.trim()) next.name = patch.name.trim().slice(0, 120);
  if (typeof patch.description === 'string') next.description = patch.description.slice(0, 400);
  if (typeof patch.category === 'string') next.category = patch.category.slice(0, 60);
  if (patch.visibility === 'private' || patch.visibility === 'internal' || patch.visibility === 'public') {
    next.visibility = patch.visibility;
  }
  if (patch.submitAccess === 'staff' || patch.submitAccess === 'authenticated' || patch.submitAccess === 'students' || patch.submitAccess === 'public') {
    next.submitAccess = patch.submitAccess;
  }
  if (Array.isArray(patch.accessDesks)) next.accessDesks = patch.accessDesks.map(String);
  if (Array.isArray(patch.statuses)) {
    next.statuses = patch.statuses.map((s) => String(s).trim()).filter(Boolean).slice(0, 12);
    next.defaultStatus = String(patch.defaultStatus || (next.statuses as string[])[0] || current.defaultStatus);
  }
  if (patch.maxSubmissions !== undefined) {
    next.maxSubmissions = patch.maxSubmissions === null || patch.maxSubmissions === '' ? null : Number(patch.maxSubmissions);
  }
  if (patch.openAt !== undefined) next.openAt = patch.openAt ? new Date(String(patch.openAt)) : null;
  if (patch.closeAt !== undefined) next.closeAt = patch.closeAt ? new Date(String(patch.closeAt)) : null;
  if (Array.isArray(patch.fields)) {
    next.fields = (patch.fields as DataField[]).slice(0, 60).map((f) =>
      makeField({
        ...f,
        label: String(f.label || 'Field'),
        type: f.type,
      }),
    );
  }
  await datasets.updateOne({ _id: new ObjectId(id) }, { $set: next });
  await audit(actor, { datasetId: id, action: 'dataset.update', after: next });
  return getDataset(actor, id);
}

export async function deleteDataset(actor: StaffActor, id: string) {
  if (!actor.permissions.includes('data.write') && !actor.permissions.includes('data.manage')) {
    throw new StaffAuthError('You cannot delete this dataset.', 403);
  }
  const current = await getDataset(actor, id);
  if (!actor.permissions.includes('data.manage') && current.ownerId !== actor.userId) {
    throw new StaffAuthError('Only the owner or a manager can delete this dataset.', 403);
  }
  const { datasets, records, audit: auditCol } = await cols();
  const now = new Date();
  await records.deleteMany({ datasetId: id });
  await datasets.updateOne(
    { _id: new ObjectId(id) },
    { $set: { deletedAt: now, status: 'archived', updatedAt: now } },
  );
  await auditCol.insertOne({
    datasetId: id,
    recordId: null,
    actorId: actor.userId,
    actorName: actor.name,
    action: 'dataset.delete',
    before: { name: current.name, records: current.recordCount },
    after: { deleted: true },
    createdAt: now,
  });
  return { ok: true };
}

function searchBlob(values: Record<string, unknown>, tags: string[], status: string) {
  return [status, ...tags, ...Object.values(values).map((v) => (Array.isArray(v) ? v.join(' ') : String(v ?? '')))]
    .join(' ')
    .toLowerCase();
}

function recordView(d: Record<string, unknown>, fields: DataField[]) {
  const values = (d.values as Record<string, unknown>) || {};
  const allowed = new Set(fields.map((f) => f.id));
  const filtered: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(values)) {
    if (allowed.has(k)) filtered[k] = v;
  }
  for (const f of fields) {
    if (!f.formula) continue;
    const left = Number(filtered[f.formula.left] ?? values[f.formula.left] ?? 0);
    const right = Number(filtered[f.formula.right] ?? values[f.formula.right] ?? 0);
    if (f.formula.op === 'add') filtered[f.id] = left + right;
    else if (f.formula.op === 'subtract') filtered[f.id] = left - right;
    else if (f.formula.op === 'divide') filtered[f.id] = right ? left / right : 0;
    else filtered[f.id] = left * right;
  }
  return {
    id: String(d._id),
    datasetId: String(d.datasetId),
    values: filtered,
    status: String(d.status || ''),
    tags: Array.isArray(d.tags) ? (d.tags as string[]) : [],
    source: String(d.source || 'manual'),
    createdBy: String(d.createdBy || ''),
    createdByName: String(d.createdByName || ''),
    updatedBy: String(d.updatedBy || ''),
    createdAt: new Date(d.createdAt as Date).toISOString(),
    updatedAt: new Date(d.updatedAt as Date).toISOString(),
    deletedAt: d.deletedAt ? new Date(d.deletedAt as Date).toISOString() : null,
  };
}

export async function listRecords(
  actor: StaffActor,
  datasetId: string,
  opts: {
    q?: string;
    status?: string;
    tag?: string;
    sort?: string;
    dir?: 'asc' | 'desc';
    page?: number;
    trash?: boolean;
    filters?: Array<{ fieldId: string; op: string; value: string }>;
  },
) {
  const dataset = await getDataset(actor, datasetId);
  const { records } = await cols();
  const page = Math.max(1, opts.page || 1);
  const pageSize = 50;
  const query: Record<string, unknown> = {
    datasetId,
    deletedAt: opts.trash ? { $ne: null } : null,
  };
  if (opts.status) query.status = opts.status;
  if (opts.tag) query.tags = opts.tag;
  if (opts.q?.trim()) {
    const q = opts.q.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    query.searchText = { $regex: q, $options: 'i' };
  }
  if (opts.filters?.length) {
    const parts = opts.filters
      .filter((f) => f.fieldId && f.value)
      .map((f) => {
        const path = `values.${f.fieldId}`;
        if (f.op === 'eq') return { [path]: f.value };
        if (f.op === 'neq') return { [path]: { $ne: f.value } };
        return { [path]: { $regex: f.value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), $options: 'i' } };
      });
    if (parts.length) query.$and = parts;
  }
  const dir = opts.dir === 'asc' ? 1 : -1;
  const sortSpec: Record<string, 1 | -1> =
    opts.sort === 'status'
      ? { status: dir }
      : opts.sort === 'updatedAt'
        ? { updatedAt: dir }
        : opts.sort?.startsWith('field:')
          ? { [`values.${opts.sort.slice(6)}`]: dir }
          : { createdAt: dir };
  const [rows, total] = await Promise.all([
    records.find(query).sort(sortSpec).skip((page - 1) * pageSize).limit(pageSize).toArray(),
    records.countDocuments(query),
  ]);
  return {
    records: rows.map((r) => recordView(r as Record<string, unknown>, dataset.fields)),
    total,
    page,
    pageSize,
    fields: dataset.fields,
    dataset,
  };
}

function validateValues(fields: DataField[], values: Record<string, unknown>, partial = false) {
  const out: Record<string, unknown> = {};
  for (const f of fields) {
    if (f.formula) continue;
    const raw = values[f.id];
    if (raw === undefined || raw === null || raw === '') {
      if (f.required && !partial) throw new StaffAuthError(`${f.label} is required.`, 400);
      continue;
    }
    if (f.type === 'number') {
      const n = Number(raw);
      if (Number.isNaN(n)) throw new StaffAuthError(`${f.label} must be a number.`, 400);
      if (f.min != null && n < f.min) throw new StaffAuthError(`${f.label} is below the minimum.`, 400);
      if (f.max != null && n > f.max) throw new StaffAuthError(`${f.label} is above the maximum.`, 400);
      out[f.id] = n;
      continue;
    }
    if (f.type === 'email') {
      const email = String(raw).trim().toLowerCase();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new StaffAuthError(`${f.label} must be a valid email.`, 400);
      out[f.id] = email;
      continue;
    }
    if (f.type === 'phone') {
      const digits = String(raw).replace(/\D/g, '');
      if (digits.length < 8 || digits.length > 15) throw new StaffAuthError(`${f.label} must be a valid phone number.`, 400);
      out[f.id] = String(raw).trim();
      continue;
    }
    if (f.type === 'url') {
      const url = String(raw).trim();
      if (!/^https?:\/\//i.test(url)) throw new StaffAuthError(`${f.label} must start with http:// or https://.`, 400);
      out[f.id] = url;
      continue;
    }
    if (f.type === 'multi_select' || f.type === 'checkbox') {
      out[f.id] = Array.isArray(raw) ? raw.map(String) : [String(raw)];
      continue;
    }
    const text = String(raw).trim();
    if (f.minLength && text.length < f.minLength) throw new StaffAuthError(`${f.label} is too short.`, 400);
    if (f.maxLength && text.length > f.maxLength) throw new StaffAuthError(`${f.label} is too long.`, 400);
    out[f.id] = text.slice(0, 4000);
  }
  return out;
}

export async function upsertRecord(
  actor: StaffActor,
  datasetId: string,
  opts: { id?: string; values: Record<string, unknown>; status?: string; tags?: string[]; source?: string },
) {
  if (!actor.permissions.includes('data.write') && !actor.permissions.includes('data.manage')) {
    throw new StaffAuthError('You cannot edit records.', 403);
  }
  const dataset = await getDataset(actor, datasetId);
  const { records } = await cols();
  const now = new Date();
  if (opts.id && ObjectId.isValid(opts.id)) {
    const existing = await records.findOne({ _id: new ObjectId(opts.id), datasetId, deletedAt: null });
    if (!existing) throw new StaffAuthError('Record not found.', 404);
    const merged = { ...((existing.values as Record<string, unknown>) || {}), ...opts.values };
    const values = validateValues(dataset.fields, merged, true);
    const status = opts.status || String(existing.status);
    const tags = opts.tags || (existing.tags as string[]) || [];
    const prevStatus = String(existing.status);
    await records.updateOne(
      { _id: existing._id },
      {
        $set: {
          values,
          status,
          tags,
          searchText: searchBlob(values, tags, status),
          updatedBy: actor.userId,
          updatedAt: now,
        },
      },
    );
    await audit(actor, {
      datasetId,
      recordId: opts.id,
      action: 'record.update',
      before: { values: existing.values, status: existing.status },
      after: { values, status },
    });
    if (status !== prevStatus && existing.createdBy && existing.createdBy !== 'external') {
      await createNotification({
        userId: String(existing.createdBy),
        title: `${dataset.name}: ${status}`,
        body: `Your record was updated from ${prevStatus} to ${status}.`,
        href: `/dashboard/staff/data/${datasetId}`,
        kind: 'institution',
      }).catch(() => null);
    }
    const row = await records.findOne({ _id: existing._id });
    return recordView(row as Record<string, unknown>, dataset.fields);
  }
  const values = validateValues(dataset.fields, opts.values);
  const status = opts.status || dataset.defaultStatus;
  const tags = opts.tags || [];
  const doc = {
    datasetId,
    values,
    status,
    tags,
    source: opts.source || 'manual',
    searchText: searchBlob(values, tags, status),
    createdBy: actor.userId,
    createdByName: actor.name,
    updatedBy: actor.userId,
    createdAt: now,
    updatedAt: now,
    deletedAt: null,
  };
  const res = await records.insertOne(doc);
  await audit(actor, { datasetId, recordId: res.insertedId.toString(), action: 'record.create', after: { status } });
  return recordView({ ...doc, _id: res.insertedId }, dataset.fields);
}

export async function bulkRecords(
  actor: StaffActor,
  datasetId: string,
  opts: { ids: string[]; action: 'status' | 'tag' | 'delete' | 'restore' | 'purge'; value?: string },
) {
  if (!actor.permissions.includes('data.write') && !actor.permissions.includes('data.manage')) {
    throw new StaffAuthError('You cannot change these records.', 403);
  }
  const ids = opts.ids.filter((id) => ObjectId.isValid(id)).map((id) => new ObjectId(id));
  if (!ids.length) throw new StaffAuthError('Select at least one row.', 400);
  const { records } = await cols();
  const now = new Date();
  if (opts.action === 'delete') {
    await records.updateMany({ _id: { $in: ids }, datasetId }, { $set: { deletedAt: now, updatedAt: now, updatedBy: actor.userId } });
  } else if (opts.action === 'restore') {
    await records.updateMany({ _id: { $in: ids }, datasetId }, { $set: { deletedAt: null, updatedAt: now, updatedBy: actor.userId } });
  } else if (opts.action === 'purge') {
    if (!actor.permissions.includes('data.manage')) throw new StaffAuthError('Only managers can permanently delete.', 403);
    await records.deleteMany({ _id: { $in: ids }, datasetId });
  } else if (opts.action === 'status' && opts.value) {
    await records.updateMany({ _id: { $in: ids }, datasetId }, { $set: { status: opts.value, updatedAt: now, updatedBy: actor.userId } });
  } else if (opts.action === 'tag' && opts.value) {
    await records.updateMany({ _id: { $in: ids }, datasetId }, { $addToSet: { tags: opts.value }, $set: { updatedAt: now, updatedBy: actor.userId } });
  }
  await audit(actor, { datasetId, action: `record.bulk.${opts.action}`, after: { count: ids.length, value: opts.value } });
  return { ok: true, count: ids.length };
}

export async function datasetAnalytics(actor: StaffActor, datasetId: string) {
  const dataset = await getDataset(actor, datasetId);
  const { records } = await cols();
  const rows = await records.find({ datasetId, deletedAt: null }).limit(5000).toArray();
  const total = rows.length;
  const byStatus: Record<string, number> = {};
  for (const s of dataset.statuses) byStatus[s] = 0;
  const numeric: Record<string, number[]> = {};
  const breakdown: Record<string, Record<string, number>> = {};
  for (const f of dataset.fields) {
    if (f.type === 'number') numeric[f.id] = [];
    if (['dropdown', 'radio', 'yes_no', 'campus', 'department', 'faculty', 'program', 'course', 'cohort'].includes(f.type)) {
      breakdown[f.id] = {};
    }
  }
  for (const r of rows) {
    const st = String(r.status || '');
    byStatus[st] = (byStatus[st] || 0) + 1;
    const values = (r.values as Record<string, unknown>) || {};
    for (const f of dataset.fields) {
      const v = values[f.id];
      if (v == null || v === '') continue;
      if (numeric[f.id]) numeric[f.id].push(Number(v) || 0);
      if (breakdown[f.id]) {
        const key = Array.isArray(v) ? v.join(', ') : String(v);
        breakdown[f.id][key] = (breakdown[f.id][key] || 0) + 1;
      }
    }
  }
  const calcs = dataset.fields
    .filter((f) => f.type === 'number')
    .map((f) => {
      const nums = numeric[f.id] || [];
      const sum = nums.reduce((a, b) => a + b, 0);
      return {
        fieldId: f.id,
        label: f.label,
        sum,
        avg: nums.length ? sum / nums.length : 0,
        min: nums.length ? Math.min(...nums) : 0,
        max: nums.length ? Math.max(...nums) : 0,
        count: nums.length,
      };
    });
  const done = ['Confirmed', 'Accepted', 'Awarded', 'Attended', 'Enrolled', 'Placed', 'Done'].reduce(
    (n, s) => n + (byStatus[s] || 0),
    0,
  );
  return {
    total,
    byStatus,
    calcs,
    confirmationRate: total ? Math.round((done / total) * 1000) / 10 : 0,
    breakdown: Object.entries(breakdown).map(([fieldId, counts]) => ({
      fieldId,
      label: dataset.fields.find((f) => f.id === fieldId)?.label || fieldId,
      counts,
    })),
  };
}

export async function exportCsv(actor: StaffActor, datasetId: string) {
  const { fields, dataset } = await listRecords(actor, datasetId, { page: 1 });
  const all = await (await cols()).records.find({ datasetId, deletedAt: null }).sort({ createdAt: -1 }).limit(5000).toArray();
  const header = ['ID', 'Status', 'Tags', 'Created', ...fields.map((f) => f.label)];
  const lines = [header.map(csvCell).join(',')];
  for (const r of all) {
    const view = recordView(r as Record<string, unknown>, fields);
    lines.push(
      [
        view.id,
        view.status,
        view.tags.join('; '),
        view.createdAt,
        ...fields.map((f) => {
          const v = view.values[f.id];
          return Array.isArray(v) ? v.join('; ') : String(v ?? '');
        }),
      ]
        .map(csvCell)
        .join(','),
    );
  }
  await audit(actor, { datasetId, action: 'dataset.export', after: { rows: all.length } });
  return { filename: `${dataset.slug}.csv`, csv: `\uFEFF${lines.join('\n')}` };
}

function csvCell(v: string) {
  return `"${String(v).replace(/"/g, '""')}"`;
}

function detectDelim(s: string) {
  const first = (s.split(/\r?\n/).find((line) => line.trim()) || '').slice(0, 4000);
  const counts: Record<string, number> = { ',': 0, ';': 0, '\t': 0 };
  let q = false;
  for (const c of first) {
    if (c === '"') q = !q;
    else if (!q && c in counts) counts[c] += 1;
  }
  const ranked = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  return ranked[0][1] > 0 ? ranked[0][0] : ',';
}

export function parseCsv(text: string, delim?: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cur = '';
  let q = false;
  const s = text.replace(/^\uFEFF/, '');
  if (/^PK\x03\x04/.test(s) || s.startsWith('PK')) {
    throw new StaffAuthError(
      'This looks like an Excel workbook (.xlsx). In Excel choose File → Save As → CSV UTF-8, then import that CSV.',
      400,
    );
  }
  const sep = delim || detectDelim(s);
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (q) {
      if (c === '"' && s[i + 1] === '"') {
        cur += '"';
        i++;
      } else if (c === '"') q = false;
      else cur += c;
    } else if (c === '"') q = true;
    else if (c === sep) {
      row.push(cur);
      cur = '';
    } else if (c === '\n') {
      row.push(cur);
      rows.push(row);
      row = [];
      cur = '';
    } else if (c !== '\r') cur += c;
  }
  if (cur || row.length) {
    row.push(cur);
    rows.push(row);
  }
  return rows.filter((r) => r.some((c) => c.trim()));
}

const SYSTEM_HEADERS = /^(id|_id|status|tags|created|created at|updated|updated at|source)$/i;

function normHeader(h: string) {
  return h.trim().toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}

function guessMap(header: string[], fields: DataField[]) {
  const used = new Set<string>();
  const mapped = header.map((h) => {
    const n = normHeader(h);
    if (!n || SYSTEM_HEADERS.test(h.trim()) || SYSTEM_HEADERS.test(n)) return '';
    const hit = fields.find((f) => {
      if (used.has(f.id)) return false;
      const lab = normHeader(f.label);
      const key = f.key.replace(/_/g, ' ');
      return lab === n || key === n || (n.length > 2 && (lab.includes(n) || n.includes(lab)));
    });
    if (hit) {
      used.add(hit.id);
      return hit.id;
    }
    return '';
  });
  if (mapped.some(Boolean)) return mapped;
  let i = 0;
  return header.map((h) => {
    if (SYSTEM_HEADERS.test(h.trim()) || SYSTEM_HEADERS.test(normHeader(h))) return '';
    const f = fields[i++];
    return f?.id || '';
  });
}

export function previewCsv(dataset: DatasetDoc, csvText: string) {
  const table = parseCsv(csvText);
  if (table.length < 2) {
    throw new StaffAuthError(
      'No data rows found. Use a CSV with a header row, then one row per person. Excel: File → Save As → CSV UTF-8.',
      400,
    );
  }
  const header = table[0];
  const suggested = guessMap(header, dataset.fields);
  const previewRows = table.slice(1, 8).map((row) => {
    const values: Record<string, string> = {};
    suggested.forEach((fieldId, idx) => {
      if (fieldId) values[fieldId] = String(row[idx] ?? '').trim();
    });
    return values;
  });
  const missingRequired = dataset.fields
    .filter((f) => f.required && !suggested.includes(f.id))
    .map((f) => f.label);
  return {
    header,
    suggested,
    fields: dataset.fields.map((f) => ({ id: f.id, label: f.label, required: f.required })),
    sample: table.slice(1, 8),
    previewRows,
    rowCount: table.length - 1,
    missingRequired,
    csv: csvText,
  };
}

export async function importCsv(actor: StaffActor, datasetId: string, csvText: string, mapping?: string[]) {
  const dataset = await getDataset(actor, datasetId);
  const table = parseCsv(csvText);
  if (table.length < 2) throw new StaffAuthError('The file has no data rows.', 400);
  const header = table[0];
  const map = mapping && mapping.length === header.length ? mapping : guessMap(header, dataset.fields);
  const emailField = dataset.fields.find((f) => f.type === 'email');
  const { records } = await cols();
  const errors: string[] = [];
  let imported = 0;
  for (let i = 1; i < table.length; i++) {
    const row = table[i];
    const values: Record<string, unknown> = {};
    map.forEach((fieldId, idx) => {
      if (fieldId && row[idx] != null) values[fieldId] = row[idx];
    });
    try {
      if (emailField && values[emailField.id]) {
        const dup = await records.findOne({
          datasetId,
          deletedAt: null,
          [`values.${emailField.id}`]: String(values[emailField.id]).trim().toLowerCase(),
        });
        if (dup) throw new StaffAuthError('Duplicate email already in this dataset.', 400);
      }
      await upsertRecord(actor, datasetId, { values, source: 'import' });
      imported += 1;
    } catch (err) {
      errors.push(`Row ${i + 1}: ${err instanceof Error ? err.message : 'invalid'}`);
      if (errors.length > 40) break;
    }
  }
  await audit(actor, { datasetId, action: 'dataset.import', after: { imported, errors: errors.length } });
  return { imported, errors, header, suggested: guessMap(header, dataset.fields), fields: dataset.fields };
}

export async function listAudit(actor: StaffActor, datasetId: string, recordId?: string) {
  await getDataset(actor, datasetId);
  const { audit } = await cols();
  const q: Record<string, unknown> = { datasetId };
  if (recordId) q.recordId = recordId;
  const rows = await audit.find(q).sort({ createdAt: -1 }).limit(80).toArray();
  return rows.map((r) => ({
    id: String(r._id),
    action: String(r.action),
    actorName: String(r.actorName || ''),
    recordId: r.recordId ? String(r.recordId) : null,
    createdAt: new Date(r.createdAt as Date).toISOString(),
    before: r.before || null,
    after: r.after || null,
  }));
}

export async function submitForm(
  slug: string,
  values: Record<string, unknown>,
  submitter?: { userId?: string; name?: string; email?: string },
) {
  const { datasets, records } = await cols();
  const d = await datasets.findOne({ slug, deletedAt: { $in: [null, undefined] } });
  if (!d) throw new StaffAuthError('Form not found.', 404);
  const dataset = datasetView(d as Record<string, unknown>);
  if (dataset.submitAccess === 'staff') throw new StaffAuthError('This form is staff-only.', 403);
  if (dataset.submitAccess === 'authenticated' && !submitter?.userId) {
    throw new StaffAuthError('Sign in to submit this form.', 401);
  }
  if (dataset.submitAccess === 'students') {
    if (!submitter?.userId) throw new StaffAuthError('Sign in as a student to submit.', 401);
    const m = await getStudentMembership(submitter.userId);
    if (!m.isStudent) throw new StaffAuthError('Only official students can submit.', 403);
  }
  if (dataset.closeAt && new Date(dataset.closeAt).getTime() < Date.now()) {
    throw new StaffAuthError('This form is closed.', 400);
  }
  if (dataset.openAt && new Date(dataset.openAt).getTime() > Date.now()) {
    throw new StaffAuthError('This form is not open yet.', 400);
  }
  const live = await records.countDocuments({ datasetId: dataset.id, deletedAt: null });
  if (dataset.maxSubmissions && live >= dataset.maxSubmissions) {
    throw new StaffAuthError('Registration is closed — the limit has been reached.', 400);
  }
  let filled = { ...values };
  if (submitter?.userId) {
    const learner = await getLearner(submitter.userId);
    const membership = await getStudentMembership(submitter.userId);
    for (const f of dataset.fields) {
      if (!f.autoFrom || filled[f.id]) continue;
      if (f.autoFrom === 'name') filled[f.id] = learner?.name || submitter.name;
      if (f.autoFrom === 'email') filled[f.id] = learner?.email || submitter.email;
      if (f.autoFrom === 'matricule') filled[f.id] = membership.matricule;
      if (f.autoFrom === 'program') filled[f.id] = membership.program;
      if (f.autoFrom === 'department') filled[f.id] = membership.department;
      if (f.autoFrom === 'campus') filled[f.id] = membership.campusSlug;
    }
  }
  const validated = validateValues(dataset.fields, filled);
  const now = new Date();
  const status = dataset.defaultStatus;
  const doc = {
    datasetId: dataset.id,
    values: validated,
    status,
    tags: [] as string[],
    source: 'form',
    searchText: searchBlob(validated, [], status),
    createdBy: submitter?.userId || 'external',
    createdByName: submitter?.name || String(validated[dataset.fields[0]?.id] || 'External'),
    updatedBy: submitter?.userId || 'external',
    createdAt: now,
    updatedAt: now,
    deletedAt: null,
  };
  await records.insertOne(doc);
  if (dataset.ownerId) {
    await createNotification({
      userId: dataset.ownerId,
      title: `New response: ${dataset.name}`,
      body: `${doc.createdByName} submitted the form.`,
      href: `/dashboard/staff/data/${dataset.id}`,
      kind: 'institution',
    }).catch(() => null);
  }
  return { ok: true, status };
}

export async function formLookups() {
  const campuses = await listCampuses();
  return { campuses: campuses.map((c) => ({ slug: c.slug, name: c.name })) };
}

export async function askDataset(actor: StaffActor, datasetId: string, question: string) {
  const analytics = await datasetAnalytics(actor, datasetId);
  const { records, fields, dataset } = await listRecords(actor, datasetId, { page: 1 });
  const q = question.toLowerCase();
  const local: string[] = [];
  local.push(`${dataset.name} has ${analytics.total} live records.`);
  for (const [st, n] of Object.entries(analytics.byStatus)) {
    if (q.includes(st.toLowerCase())) local.push(`${n} records are “${st}”.`);
  }
  if (q.includes('how many') || q.includes('total')) {
    local.push(`Total: ${analytics.total}.`);
  }
  const sample = records.slice(0, 12).map((r) => {
    const row: Record<string, unknown> = { status: r.status };
    for (const f of fields) row[f.label] = r.values[f.id];
    return row;
  });

  if (!isLLMConfigured()) {
    return { answer: local.join(' ') || 'OpenAI is not configured. Use search and filters on the table.', local: true };
  }
  try {
    const res = await fetch(`${process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1'}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
        temperature: 0.2,
        messages: [
          {
            role: 'system',
            content:
              'You analyze one InTelleX dataset. Only use the provided stats and sample. Never invent people. If you cannot answer from the data, say so. Stay within this dataset.',
          },
          {
            role: 'user',
            content: JSON.stringify({ question, dataset: dataset.name, analytics, sample }),
          },
        ],
      }),
    });
    const data = await res.json();
    const answer = String(data.choices?.[0]?.message?.content || local.join(' '));
    return { answer, local: false };
  } catch {
    return { answer: local.join(' ') || 'Could not reach the AI right now.', local: true };
  }
}
