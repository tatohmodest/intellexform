import { ObjectId } from 'mongodb';
import { getDb } from '@/lib/repo';
import { HOME_ORGANIZATION } from '@/lib/staff/permissions';

export type OrgCampus = {
  id: string;
  organizationSlug: string;
  slug: string;
  name: string;
  city: string;
  address: string;
  color: string;
  active: boolean;
};

async function campusesCol() {
  const db = await getDb();
  await db
    .collection('org_campuses')
    .createIndex({ organizationSlug: 1, slug: 1 }, { unique: true })
    .catch(() => {});
  return db.collection('org_campuses');
}

function mapCampus(doc: Record<string, unknown>): OrgCampus {
  return {
    id: String(doc._id),
    organizationSlug: String(doc.organizationSlug || HOME_ORGANIZATION.slug),
    slug: String(doc.slug),
    name: String(doc.name),
    city: String(doc.city || ''),
    address: String(doc.address || ''),
    color: String(doc.color || '#00B369'),
    active: doc.active !== false,
  };
}

export async function listCampuses(organizationSlug = HOME_ORGANIZATION.slug): Promise<OrgCampus[]> {
  const col = await campusesCol();
  const rows = await col.find({ organizationSlug, active: { $ne: false } }).sort({ name: 1 }).limit(80).toArray();
  return rows.map((d) => mapCampus(d as Record<string, unknown>));
}

export async function listAllCampuses(organizationSlug = HOME_ORGANIZATION.slug): Promise<OrgCampus[]> {
  const col = await campusesCol();
  const rows = await col.find({ organizationSlug }).sort({ name: 1 }).limit(80).toArray();
  return rows.map((d) => mapCampus(d as Record<string, unknown>));
}

export async function saveCampus(doc: {
  organizationSlug: string;
  slug: string;
  name: string;
  city: string;
  address: string;
  color: string;
  active: boolean;
  actorId: string;
}) {
  const col = await campusesCol();
  const existing = await col.findOne({ organizationSlug: doc.organizationSlug, slug: doc.slug });
  const now = new Date();
  await col.updateOne(
    { organizationSlug: doc.organizationSlug, slug: doc.slug },
    {
      $set: {
        ...doc,
        updatedAt: now,
        updatedBy: doc.actorId,
      },
      $setOnInsert: { createdAt: now, createdBy: doc.actorId, _id: new ObjectId() },
    },
    { upsert: true },
  );
  const saved = await col.findOne({ organizationSlug: doc.organizationSlug, slug: doc.slug });
  return { campus: mapCampus((saved || doc) as Record<string, unknown>), created: !existing };
}
