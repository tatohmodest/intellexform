import { getDb } from '@/lib/repo';
import { HOME_ORGANIZATION } from '@/lib/staff/permissions';

export type OrgProgram = { id: string; name: string };

export type OrgConfig = {
  slug: string;
  name: string;
  tagline: string;
  color: string;
  logoUrl: string | null;
  terminology: {
    student: string;
    matricule: string;
    program: string;
    campus: string;
  };
  registration: {
    requirePayment: boolean;
    feeXAF: number;
    programs: OrgProgram[];
  };
};

const DEFAULT_PROGRAMS: OrgProgram[] = [
  { id: 'software-engineering', name: 'Software Engineering' },
  { id: 'business', name: 'Business' },
  { id: 'data-science', name: 'Data Science' },
  { id: 'design', name: 'Design' },
  { id: 'marketing', name: 'Marketing' },
  { id: 'cybersecurity', name: 'Cybersecurity' },
  { id: 'finance', name: 'Finance' },
  { id: 'education', name: 'Education' },
];

function defaults(): OrgConfig {
  const fee = Number(process.env.INSTITUTION_APPLICATION_FEE_XAF || '0');
  return {
    slug: (process.env.INSTITUTION_SLUG || HOME_ORGANIZATION.slug).trim() || HOME_ORGANIZATION.slug,
    name: (process.env.INSTITUTION_NAME || HOME_ORGANIZATION.name).trim() || HOME_ORGANIZATION.name,
    tagline: (process.env.INSTITUTION_TAGLINE || 'Learn. Connect. Grow.').trim(),
    color: (process.env.INSTITUTION_COLOR || '#00b369').trim(),
    logoUrl: process.env.INSTITUTION_LOGO_URL?.trim() || null,
    terminology: {
      student: 'student',
      matricule: 'matricule',
      program: 'program',
      campus: 'campus',
    },
    registration: {
      requirePayment: fee > 0 || process.env.INSTITUTION_REQUIRE_APPLICATION_FEE === '1',
      feeXAF: Number.isFinite(fee) ? Math.max(0, Math.round(fee)) : 0,
      programs: DEFAULT_PROGRAMS,
    },
  };
}

function merge(base: OrgConfig, patch: Record<string, unknown> | null | undefined): OrgConfig {
  if (!patch) return base;
  const terminology = (patch.terminology as OrgConfig['terminology']) || base.terminology;
  const registration = (patch.registration as OrgConfig['registration']) || base.registration;
  return {
    ...base,
    slug: String(patch.slug || base.slug),
    name: String(patch.name || base.name),
    tagline: String(patch.tagline || base.tagline),
    color: String(patch.color || base.color),
    logoUrl: patch.logoUrl != null ? String(patch.logoUrl) || null : base.logoUrl,
    terminology: {
      student: String(terminology.student || base.terminology.student),
      matricule: String(terminology.matricule || base.terminology.matricule),
      program: String(terminology.program || base.terminology.program),
      campus: String(terminology.campus || base.terminology.campus),
    },
    registration: {
      requirePayment: Boolean(registration.requirePayment),
      feeXAF: Number(registration.feeXAF) || 0,
      programs:
        Array.isArray(registration.programs) && registration.programs.length
          ? registration.programs.map((p) => ({
              id: String(p.id || p.name)
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-|-$/g, ''),
              name: String(p.name || p.id),
            }))
          : base.registration.programs,
    },
  };
}

let cached: { at: number; value: OrgConfig } | null = null;

/** Deployment institution — one clone, one organization. */
export async function getOrgConfig(): Promise<OrgConfig> {
  if (cached && Date.now() - cached.at < 30_000) return cached.value;
  const base = defaults();
  try {
    const db = await getDb();
    const row = await db.collection('org_settings').findOne({ key: 'home' });
    const value = merge(base, (row as Record<string, unknown> | null) || null);
    cached = { at: Date.now(), value };
    return value;
  } catch {
    cached = { at: Date.now(), value: base };
    return base;
  }
}

export async function saveOrgConfig(patch: Partial<OrgConfig>): Promise<OrgConfig> {
  const current = await getOrgConfig();
  const next = merge(current, patch as Record<string, unknown>);
  const db = await getDb();
  await db.collection('org_settings').updateOne(
    { key: 'home' },
    {
      $set: { ...next, key: 'home', updatedAt: new Date() },
      $setOnInsert: { createdAt: new Date() },
    },
    { upsert: true },
  );
  cached = { at: Date.now(), value: next };
  return next;
}
