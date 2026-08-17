/**
 * Email-bound institution onboarding invites.
 * Intellex admin generates a secure link; the assigned email completes a multi-step LMS setup wizard.
 * Mongo remains for legacy list/read; Prisma OnboardingInvitation is the emerging source of truth.
 */

import crypto from 'crypto';
import { getDb } from '@/lib/repo';
import {
  COMMERCIAL_PLANS,
  type BillingCycle,
  type CommercialPlanId,
} from '@/lib/eduos/plans';
import { modulesForPack, type ModuleId } from '@/lib/eduos/capabilities';
import { createInstitution, provisionInstitution } from '@/lib/admin/platform';
import { prisma } from '@/lib/db/prisma';
import {
  isValidDatabaseMode,
  type TenantDatabaseMode,
} from '@/lib/eduos/databaseModes';

export type OnboardingInviteStatus = 'pending' | 'completed' | 'revoked' | 'expired';

export interface OnboardingInviteDoc {
  token: string;
  email: string;
  contactName?: string | null;
  organizationName?: string | null;
  organizationType?: string | null;
  plan: CommercialPlanId;
  allowedModules: string[];
  billingOptions: BillingCycle[];
  databaseMode: TenantDatabaseMode;
  suggestedSubdomain?: string | null;
  status: OnboardingInviteStatus;
  onboardingState: string;
  note?: string | null;
  createdByEmail?: string | null;
  expiresAt: Date;
  completedAt?: Date | null;
  provisionedInstitutionId?: string | null;
  provisionedSlug?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

function newToken(): string {
  return crypto.randomBytes(24).toString('hex');
}

async function mirrorInviteToPrisma(doc: OnboardingInviteDoc) {
  try {
    await prisma.onboardingInvitation.upsert({
      where: { token: doc.token },
      create: {
        token: doc.token,
        email: doc.email,
        contactName: doc.contactName || null,
        organizationName: doc.organizationName || null,
        organizationType: doc.organizationType || null,
        planCode: doc.plan,
        allowedModules: doc.allowedModules,
        billingOptions: doc.billingOptions,
        databaseMode: doc.databaseMode,
        suggestedSubdomain: doc.suggestedSubdomain || null,
        note: doc.note || null,
        status: doc.status,
        onboardingState: doc.onboardingState,
        expiresAt: new Date(doc.expiresAt),
        completedAt: doc.completedAt ? new Date(doc.completedAt) : null,
        provisionedInstitutionId: doc.provisionedInstitutionId || null,
        provisionedSlug: doc.provisionedSlug || null,
        createdByEmail: doc.createdByEmail || null,
      },
      update: {
        status: doc.status,
        onboardingState: doc.onboardingState,
        completedAt: doc.completedAt ? new Date(doc.completedAt) : null,
        provisionedInstitutionId: doc.provisionedInstitutionId || null,
        provisionedSlug: doc.provisionedSlug || null,
        note: doc.note || null,
      },
    });
  } catch (err) {
    console.error('mirrorInviteToPrisma failed:', err);
  }
}

export async function createOnboardingInvite(opts: {
  email: string;
  plan: CommercialPlanId;
  allowedModules?: string[];
  note?: string;
  actorEmail?: string;
  expiresInDays?: number;
  contactName?: string;
  organizationName?: string;
  organizationType?: string;
  databaseMode?: TenantDatabaseMode;
  suggestedSubdomain?: string;
}): Promise<OnboardingInviteDoc> {
  const plan = COMMERCIAL_PLANS[opts.plan];
  if (!plan) throw new Error('Invalid plan');
  const email = opts.email.trim().toLowerCase();
  if (!email.includes('@')) throw new Error('Valid email required');

  const allowed =
    opts.allowedModules && opts.allowedModules.length
      ? opts.allowedModules.filter((m) => plan.selectableModules.includes(m as ModuleId))
      : [...plan.selectableModules];

  const databaseMode: TenantDatabaseMode =
    opts.databaseMode && isValidDatabaseMode(opts.databaseMode)
      ? opts.databaseMode
      : opts.plan === 'enterprise' || opts.plan === 'institution'
        ? 'DEDICATED'
        : 'SHARED';

  const days = Math.min(Math.max(opts.expiresInDays ?? 14, 1), 90);
  const suggestedSubdomain = opts.suggestedSubdomain
    ? opts.suggestedSubdomain
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9-]/g, '')
        .slice(0, 48)
    : opts.organizationName
      ? opts.organizationName
          .trim()
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '')
          .slice(0, 48)
      : null;

  const doc: OnboardingInviteDoc = {
    token: newToken(),
    email,
    contactName: opts.contactName?.trim().slice(0, 120) || null,
    organizationName: opts.organizationName?.trim().slice(0, 120) || null,
    organizationType: opts.organizationType?.trim().slice(0, 60) || null,
    plan: opts.plan,
    allowedModules: allowed,
    billingOptions: [...plan.billing],
    databaseMode,
    suggestedSubdomain,
    status: 'pending',
    onboardingState: 'invited',
    note: opts.note?.slice(0, 500) || null,
    createdByEmail: opts.actorEmail || null,
    expiresAt: new Date(Date.now() + days * 24 * 60 * 60 * 1000),
    completedAt: null,
    provisionedInstitutionId: null,
    provisionedSlug: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const db = await getDb();
  await db.collection('onboarding_invites').createIndex({ token: 1 }, { unique: true }).catch(() => {});
  await db.collection('onboarding_invites').createIndex({ email: 1, status: 1 }).catch(() => {});
  await db.collection('onboarding_invites').insertOne(doc as unknown as Record<string, unknown>);
  await mirrorInviteToPrisma(doc);
  return doc;
}

export async function listOnboardingInvites(take = 40) {
  const db = await getDb();
  const docs = await db
    .collection('onboarding_invites')
    .find({})
    .sort({ createdAt: -1 })
    .limit(take)
    .toArray();
  return docs.map((d) => {
    const { _id, ...rest } = d;
    return { id: String(_id), ...rest };
  });
}

export async function getOnboardingInvite(token: string): Promise<OnboardingInviteDoc | null> {
  const db = await getDb();
  const doc = await db.collection('onboarding_invites').findOne({ token }, { projection: { _id: 0 } });
  if (!doc) return null;
  const invite = doc as unknown as OnboardingInviteDoc;
  if (!invite.databaseMode) invite.databaseMode = 'SHARED';
  if (!invite.onboardingState) invite.onboardingState = invite.status === 'completed' ? 'completed' : 'invited';
  if (invite.status === 'pending' && new Date(invite.expiresAt).getTime() < Date.now()) {
    await db.collection('onboarding_invites').updateOne(
      { token },
      { $set: { status: 'expired', onboardingState: 'suspended', updatedAt: new Date() } },
    );
    await mirrorInviteToPrisma({ ...invite, status: 'expired', onboardingState: 'suspended' });
    return { ...invite, status: 'expired', onboardingState: 'suspended' };
  }
  return invite;
}

export async function completeOnboardingInvite(opts: {
  token: string;
  sessionEmail: string;
  name: string;
  description?: string;
  website?: string;
  country?: string;
  city?: string;
  phone?: string;
  address?: string;
  institutionType?: string;
  platformName?: string;
  primaryColor?: string;
  secondaryColor?: string;
  tagline?: string;
  logoUrl?: string;
  subdomain?: string;
  billingCycle: BillingCycle;
  selectedModules: string[];
  adminFirstName?: string;
  adminLastName?: string;
  adminTitle?: string;
  learningStructure?: string[];
  studentRegistration?: string;
  instructorMode?: string;
  instructorCanPublish?: boolean;
}): Promise<{
  slug: string;
  institutionId: string;
  subdomain: string;
  platformHost: string;
  platformUrl: string;
  subdomainUrl: string;
  shortPathUrl: string;
  adminUrl: string;
  campusUrl: string;
  emailSent: boolean;
  emailTo: string;
  organizationName: string;
}> {
  const invite = await getOnboardingInvite(opts.token);
  if (!invite) throw new Error('Invite not found');
  if (invite.status !== 'pending') throw new Error(`Invite is ${invite.status}`);
  if (invite.email.toLowerCase() !== opts.sessionEmail.trim().toLowerCase()) {
    throw new Error('This invite is assigned to a different email. Sign in with that address.');
  }

  const plan = COMMERCIAL_PLANS[invite.plan];
  const selected = opts.selectedModules.filter((m) =>
    invite.allowedModules.includes(m),
  ) as ModuleId[];

  const capabilityPack = plan.capabilityPack;
  const enabledModules =
    capabilityPack === 'custom' || selected.length
      ? selected.length
        ? selected
        : plan.modules
      : modulesForPack(capabilityPack);

  const orgName = opts.name.trim() || invite.organizationName || 'New Organization';
  const subdomainHint = opts.subdomain || invite.suggestedSubdomain || undefined;

  const inst = await createInstitution({
    name: orgName,
    description: opts.description || opts.tagline,
    website: opts.website,
    country: opts.country,
    institutionType: opts.institutionType || invite.organizationType || undefined,
    email: invite.email,
    ownerEmail: invite.email,
    capabilityPack: selected.length ? 'custom' : capabilityPack,
    enabledModules: selected.length ? selected : enabledModules,
    databaseMode: invite.databaseMode,
    subdomain: subdomainHint,
    actorEmail: invite.createdByEmail || undefined,
  });
  if (!inst?.id) throw new Error('Could not create institution');

  await provisionInstitution(inst.id, { actorEmail: invite.createdByEmail || undefined });

  const settings: Record<string, unknown> = {
    onboardingPlan: invite.plan,
    billingCycle: opts.billingCycle,
    onboardedViaInvite: true,
    platformName: opts.platformName || orgName,
    tagline: opts.tagline || null,
    adminProfile: {
      firstName: opts.adminFirstName || null,
      lastName: opts.adminLastName || null,
      title: opts.adminTitle || null,
      phone: opts.phone || null,
    },
    address: opts.address || null,
    city: opts.city || null,
    learningStructure: opts.learningStructure || [],
    studentRegistration: opts.studentRegistration || 'invite_only',
    instructorMode: opts.instructorMode || 'admin_create',
    instructorCanPublish: Boolean(opts.instructorCanPublish),
  };

  const { featuresFromModules } = await import('@/lib/eduos/featureFlags');
  const moduleIds = (selected.length ? selected : enabledModules) as ModuleId[];

  await prisma.institution.update({
    where: { id: inst.id },
    data: {
      primaryColor: opts.primaryColor || undefined,
      secondaryColor: opts.secondaryColor || undefined,
      logoUrl: opts.logoUrl || undefined,
      city: opts.city || undefined,
      address: opts.address || undefined,
      settings: settings as never,
      featuresEnabled: featuresFromModules(moduleIds),
      enabledModules: moduleIds,
      enrollmentPolicy:
        opts.studentRegistration === 'public'
          ? 'PUBLIC_OPEN'
          : opts.studentRegistration === 'code'
            ? 'CODE_BASED'
            : opts.studentRegistration === 'admin_only'
              ? 'INVITE_ONLY'
              : 'INVITE_ONLY',
      onboardingState: 'completed',
      onboardingProgress: 100,
    },
  });

  const db = await getDb();
  const completed: OnboardingInviteDoc = {
    ...invite,
    status: 'completed',
    onboardingState: 'completed',
    completedAt: new Date(),
    provisionedInstitutionId: inst.id,
    provisionedSlug: inst.slug,
    updatedAt: new Date(),
  };
  await db.collection('onboarding_invites').updateOne(
    { token: opts.token },
    {
      $set: {
        status: 'completed',
        onboardingState: 'completed',
        completedAt: completed.completedAt,
        provisionedInstitutionId: inst.id,
        provisionedSlug: inst.slug,
        updatedAt: new Date(),
      },
    },
  );
  await mirrorInviteToPrisma(completed);

  const { platformCnameTarget } = await import('@/lib/learn/institutionDomains');
  const { getSiteUrl } = await import('@/lib/seo/share');
  const cname = platformCnameTarget();
  const subdomain = String(inst.subdomain || inst.slug);
  const platformHost = `${subdomain}.${cname}`;
  const subdomainUrl = `https://${platformHost}`;
  const site = getSiteUrl().replace(/\/$/, '');
  /** Path URL works immediately on the main Intellex host (no DNS needed). */
  const publicSiteUrl = `${site}/site/${inst.slug}`;
  const shortPathUrl = `${site}/${inst.slug}`;
  const adminPath = `/dashboard/institutions/${inst.slug}/admin`;
  const campusPath = `/dashboard/institutions/${inst.slug}`;
  const adminUrl = `${site}${adminPath}`;
  const campusUrl = `${site}${campusPath}`;
  const organizationName = String(opts.platformName || orgName);
  const planName = plan?.name || invite.plan;

  let emailSent = false;
  try {
    const { sendInstitutionOnboardingCompleteEmail } = await import('@/lib/email');
    await sendInstitutionOnboardingCompleteEmail({
      to: invite.email,
      organizationName,
      planName,
      subdomain,
      platformHost,
      platformUrl: publicSiteUrl,
      subdomainUrl,
      shortPathUrl,
      adminUrl,
      campusUrl,
      ownerEmail: invite.email,
    });
    emailSent = true;
  } catch (err) {
    console.error('onboarding complete email failed:', err);
  }

  return {
    slug: String(inst.slug),
    institutionId: String(inst.id),
    subdomain,
    platformHost,
    platformUrl: publicSiteUrl,
    subdomainUrl,
    shortPathUrl,
    adminUrl,
    campusUrl,
    emailSent,
    emailTo: invite.email,
    organizationName,
  };
}
