/**
 * Email-bound institution onboarding invites.
 * Admin generates a link; the assigned email fills a restricted plan form.
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

export type OnboardingInviteStatus = 'pending' | 'completed' | 'revoked' | 'expired';

export interface OnboardingInviteDoc {
  token: string;
  email: string;
  plan: CommercialPlanId;
  allowedModules: string[];
  billingOptions: BillingCycle[];
  status: OnboardingInviteStatus;
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

export async function createOnboardingInvite(opts: {
  email: string;
  plan: CommercialPlanId;
  allowedModules?: string[];
  note?: string;
  actorEmail?: string;
  expiresInDays?: number;
}): Promise<OnboardingInviteDoc> {
  const plan = COMMERCIAL_PLANS[opts.plan];
  if (!plan) throw new Error('Invalid plan');
  const email = opts.email.trim().toLowerCase();
  if (!email.includes('@')) throw new Error('Valid email required');

  const allowed =
    opts.allowedModules && opts.allowedModules.length
      ? opts.allowedModules.filter((m) => plan.selectableModules.includes(m as ModuleId))
      : [...plan.selectableModules];

  const days = Math.min(Math.max(opts.expiresInDays ?? 14, 1), 90);
  const doc: OnboardingInviteDoc = {
    token: newToken(),
    email,
    plan: opts.plan,
    allowedModules: allowed,
    billingOptions: [...plan.billing],
    status: 'pending',
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
  if (invite.status === 'pending' && new Date(invite.expiresAt).getTime() < Date.now()) {
    await db.collection('onboarding_invites').updateOne(
      { token },
      { $set: { status: 'expired', updatedAt: new Date() } },
    );
    return { ...invite, status: 'expired' };
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
  institutionType?: string;
  billingCycle: BillingCycle;
  selectedModules: string[];
}): Promise<{ slug: string; institutionId: string }> {
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

  const inst = await createInstitution({
    name: opts.name,
    description: opts.description,
    website: opts.website,
    country: opts.country,
    institutionType: opts.institutionType,
    email: invite.email,
    ownerEmail: invite.email,
    capabilityPack: selected.length ? 'custom' : capabilityPack,
    enabledModules: selected.length ? selected : enabledModules,
    actorEmail: invite.createdByEmail || undefined,
  });
  if (!inst?.id) throw new Error('Could not create institution');

  await provisionInstitution(inst.id, { actorEmail: invite.createdByEmail || undefined });

  // Store billing preference on institution settings
  await prisma.institution.update({
    where: { id: inst.id },
    data: {
      settings: {
        onboardingPlan: invite.plan,
        billingCycle: opts.billingCycle,
        onboardedViaInvite: true,
      },
    },
  });

  const db = await getDb();
  await db.collection('onboarding_invites').updateOne(
    { token: opts.token },
    {
      $set: {
        status: 'completed',
        completedAt: new Date(),
        provisionedInstitutionId: inst.id,
        provisionedSlug: inst.slug,
        updatedAt: new Date(),
      },
    },
  );

  return { slug: String(inst.slug), institutionId: String(inst.id) };
}
