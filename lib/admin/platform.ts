/**
 * Platform Admin control plane - Supabase / Prisma.
 * Mongo remains for legacy learn catalogue, contact requests, and campus mirror.
 */

import {
  InstitutionLifecycleStatus,
  MembershipRole,
  type Prisma,
} from '@prisma/client';
import { prisma } from '@/lib/db/prisma';
import {
  CAPABILITY_PACKS,
  MODULE_CATALOG,
  modulesForPack,
  resolveCampusModules,
  type CapabilityPack,
  type ModuleId,
} from '@/lib/eduos/capabilities';
import { databaseModeFromDeployment, deploymentFromDatabaseMode, isValidDatabaseMode, type TenantDatabaseMode } from '@/lib/eduos/databaseModes';
import { getDb } from '@/lib/repo';
import { slugify } from '@/lib/learn/ecosystem';
import { platformCnameTarget } from '@/lib/learn/institutionDomains';
import { syncMongoLearnersToPrisma } from '@/lib/db/identity';
import {
  getTenantDatabaseConfig,
  setTenantDatabaseStrategy,
  testTenantDatabaseConnection,
  type SetTenantDatabaseInput,
} from '@/lib/eduos/tenantDb';
import {
  ensureDefaultCatalogPlans,
  listCatalogPlans,
  updateCatalogPlanPrice,
} from '@/lib/eduos/subscriptionCatalog';
import {
  FEATURE_FLAG_CATALOG,
  featuresFromModules,
  isFeatureFlagId,
  modulesFromFeatures,
  resolveInstitutionFeatures,
  type FeatureFlagId,
} from '@/lib/eduos/featureFlags';

function isPack(v: string): v is CapabilityPack {
  return v === 'foundation' || v === 'professional' || v === 'enterprise' || v === 'custom';
}

async function actorUserId(email: string | null | undefined): Promise<string | null> {
  if (!email) return null;
  const user = await prisma.user.findUnique({
    where: { email: email.trim().toLowerCase() },
    select: { id: true },
  });
  return user?.id ?? null;
}

async function writeAudit(opts: {
  actorEmail?: string | null;
  institutionId?: string | null;
  action: 'CREATE' | 'UPDATE' | 'ADMIN' | 'APPROVE' | 'REJECT' | 'PROVISION' | 'SUSPEND' | 'VERIFY';
  entityType: string;
  entityId?: string | null;
  summary: string;
  metadata?: Prisma.InputJsonValue;
}) {
  const actorId = await actorUserId(opts.actorEmail);
  await prisma.auditLog.create({
    data: {
      actorId: actorId ?? undefined,
      institutionId: opts.institutionId ?? undefined,
      action: opts.action,
      entityType: opts.entityType,
      entityId: opts.entityId ?? undefined,
      summary: opts.summary,
      metadata: opts.metadata ?? {},
    },
  });
}

/** Mirror capability pack into Mongo campus docs so existing portal stays in sync. */
async function mirrorInstitutionToMongo(inst: {
  slug: string;
  name: string;
  description: string | null;
  primaryColor: string;
  visibility: string;
  capabilityPack: string;
  enabledModules: string[];
  status: string;
  ownerUserId: string | null;
  logoUrl?: string | null;
  coverUrl?: string | null;
}) {
  try {
    const db = await getDb();
    const owner = inst.ownerUserId
      ? await prisma.user.findUnique({
          where: { id: inst.ownerUserId },
          select: { id: true, name: true, email: true, loopingBinaryId: true },
        })
      : null;
    const ownerId = owner?.loopingBinaryId || owner?.id || 'platform';
    const ownerName = owner?.name || owner?.email || 'Platform';
    const modules =
      inst.enabledModules.length > 0
        ? inst.enabledModules
        : modulesForPack(isPack(inst.capabilityPack) ? inst.capabilityPack : 'foundation');

    await db.collection('institutions').updateOne(
      { slug: inst.slug },
      {
        $set: {
          slug: inst.slug,
          name: inst.name,
          tagline: (inst.description || '').slice(0, 140),
          about: inst.description || '',
          color: inst.primaryColor || '#00b369',
          emoji: '',
          logoUrl: inst.logoUrl ?? null,
          coverUrl: inst.coverUrl ?? null,
          visibility: inst.visibility === 'PUBLIC' ? 'public' : 'private',
          capabilityPack: inst.capabilityPack,
          enabledModules: modules,
          status: inst.status,
          ownerId,
          ownerName,
          updatedAt: new Date(),
        },
        $setOnInsert: {
          memberCount: 1,
          createdAt: new Date(),
        },
      },
      { upsert: true },
    );
  } catch (err) {
    console.error('Mongo institution mirror failed:', err);
  }
}

export async function getPlatformOverview() {
  // Keep user counts aligned with live OAuth registrations in Mongo.
  await syncMongoLearnersToPrisma(800).catch((err) =>
    console.error('overview learner sync failed:', err),
  );

  const [
    institutions,
    users,
    memberships,
    courses,
    ordersPaid,
    ordersPending,
    subscriptionsActive,
    withdrawalsPending,
    applications,
    federation,
    wallets,
    recentAudit,
  ] = await Promise.all([
    prisma.institution.groupBy({ by: ['status'], _count: true }),
    prisma.user.count(),
    prisma.institutionMembership.count({ where: { isActive: true } }),
    prisma.course.count(),
    prisma.order.aggregate({
      where: { status: 'PAID' },
      _sum: { amountXaf: true },
      _count: true,
    }),
    prisma.order.count({ where: { status: 'PENDING' } }),
    prisma.subscription.count({ where: { status: 'ACTIVE' } }),
    prisma.withdrawalRequest.count({ where: { status: 'pending' } }),
    Promise.all([
      prisma.institutionApplication.count({
        where: { status: { in: ['SUBMITTED', 'UNDER_REVIEW'] } },
      }),
      prisma.instructorApplication.count({
        where: { status: { in: ['SUBMITTED', 'UNDER_REVIEW'] } },
      }),
      // Live mentor apply writes Mongo `mentor_applications`, not Prisma.
      getDb()
        .then((db) =>
          db.collection('mentor_applications').countDocuments({
            status: { $in: ['submitted', 'under_review'] },
          }),
        )
        .catch(() => 0),
    ]),
    prisma.institutionFederationLink.findMany({
      take: 20,
      orderBy: { updatedAt: 'desc' },
      include: { institution: { select: { name: true, slug: true, status: true } } },
    }),
    prisma.wallet.aggregate({ _sum: { balance: true }, _count: true }),
    prisma.auditLog.findMany({
      take: 25,
      orderBy: { createdAt: 'desc' },
      include: {
        actor: { select: { email: true, name: true } },
        institution: { select: { name: true, slug: true } },
      },
    }),
  ]);

  const byStatus = Object.fromEntries(institutions.map((r) => [r.status, r._count]));
  const [instApps, instructorApps, mentorApps] = applications;

  return {
    institutions: {
      total: institutions.reduce((a, b) => a + b._count, 0),
      byStatus,
    },
    users,
    memberships,
    courses,
    finance: {
      paidOrdersCount: ordersPaid._count,
      paidRevenueXaf: ordersPaid._sum.amountXaf ?? 0,
      pendingOrders: ordersPending,
      activeSubscriptions: subscriptionsActive,
      pendingWithdrawals: withdrawalsPending,
      walletBalanceTotal: wallets._sum.balance ?? 0,
      walletCount: wallets._count,
    },
    queue: {
      institutionApplications: instApps,
      instructorApplications: instructorApps,
      mentorApplications: mentorApps,
    },
    federation,
    recentAudit,
    packs: CAPABILITY_PACKS,
    modules: MODULE_CATALOG,
    featureFlags: FEATURE_FLAG_CATALOG,
    intellexInstitutionId: (
      await prisma.institution.findFirst({
        where: { isPlatformHome: true },
        select: { id: true, slug: true, name: true },
      })
    ),
  };
}

export async function getIntellexInstitution() {
  const home = await prisma.institution.findFirst({
    where: { OR: [{ isPlatformHome: true }, { slug: 'intellex' }] },
    select: { id: true },
  });
  if (!home) return null;
  return getInstitutionDetail(home.id);
}

export async function listInstitutions(opts?: { q?: string; status?: string }) {
  await syncMongoInstitutionsIntoPrisma();

  const where: Prisma.InstitutionWhereInput = {};
  if (opts?.status && opts.status !== 'all') {
    where.status = opts.status as InstitutionLifecycleStatus;
  }
  if (opts?.q?.trim()) {
    const q = opts.q.trim();
    where.OR = [
      { name: { contains: q, mode: 'insensitive' } },
      { slug: { contains: q, mode: 'insensitive' } },
      { email: { contains: q, mode: 'insensitive' } },
    ];
  }

  const rows = await prisma.institution.findMany({
    where,
    orderBy: [{ status: 'asc' }, { createdAt: 'desc' }],
    include: {
      owner: { select: { id: true, email: true, name: true } },
      federationLink: true,
      _count: {
        select: {
          memberships: true,
          courses: true,
          departments: true,
          withdrawalRequests: true,
        },
      },
    },
  });

  return rows.map((r) => ({
    ...r,
    resolvedModules: resolveCampusModules({
      capabilityPack: isPack(r.capabilityPack) ? r.capabilityPack : 'foundation',
      enabledModules: r.enabledModules as ModuleId[],
    }),
  }));
}

/**
 * Import Mongo campus docs into Prisma so Platform Admin can edit every
 * institution that exists in the learner portal (including seeded InTelleX).
 */
export async function syncMongoInstitutionsIntoPrisma() {
  try {
    const db = await getDb();
    const docs = await db.collection('institutions').find({}).toArray();
    for (const raw of docs) {
      const d = raw as Record<string, unknown>;
      const slug = String(d.slug || '').trim();
      if (!slug) continue;
      const name = String(d.name || slug).slice(0, 120);
      const pack = isPack(String(d.capabilityPack || 'foundation'))
        ? String(d.capabilityPack)
        : 'foundation';
      const enabledModules = Array.isArray(d.enabledModules)
        ? (d.enabledModules as string[])
        : [];
      const visibility = d.visibility === 'public' ? 'PUBLIC' : 'PRIVATE';
      const statusRaw = String(d.status || 'ACTIVE').toUpperCase();
      const status = (
        ['PENDING', 'PROVISIONING', 'ACTIVE', 'SUSPENDED', 'REJECTED', 'ARCHIVED'].includes(
          statusRaw,
        )
          ? statusRaw
          : 'ACTIVE'
      ) as InstitutionLifecycleStatus;

      await prisma.institution.upsert({
        where: { slug },
        create: {
          slug,
          name,
          description: String(d.about || d.tagline || '') || null,
          primaryColor: String(d.color || '#00b369'),
          logoUrl: (d.logoUrl as string) || null,
          coverUrl: (d.coverUrl as string) || null,
          visibility: visibility as 'PUBLIC' | 'PRIVATE',
          status,
          capabilityPack: pack,
          enabledModules,
          country: (d.country as string) || null,
          isPlatformHome: slug === 'intellex',
          verified: slug === 'intellex',
          customDomain: (d.customDomain as string) || null,
          subdomain: (d.subdomain as string) || null,
          domainStatus: String(d.domainStatus || 'none'),
          pendingCustomDomain: (d.pendingCustomDomain as string) || null,
          domainVerifiedAt: d.domainVerifiedAt ? new Date(d.domainVerifiedAt as string) : null,
          domainNotes: (d.domainNotes as string) || null,
        },
        update: {
          // Never wipe admin edits - only fill blanks / keep Mongo branding in sync when set
          name,
          ...(d.about || d.tagline
            ? { description: String(d.about || d.tagline || '') }
            : {}),
          ...(d.color ? { primaryColor: String(d.color) } : {}),
          ...(d.logoUrl !== undefined ? { logoUrl: (d.logoUrl as string) || null } : {}),
          ...(d.coverUrl !== undefined ? { coverUrl: (d.coverUrl as string) || null } : {}),
          ...(d.capabilityPack ? { capabilityPack: pack } : {}),
          ...(Array.isArray(d.enabledModules) ? { enabledModules } : {}),
          ...(d.customDomain !== undefined
            ? { customDomain: (d.customDomain as string) || null }
            : {}),
          ...(d.subdomain !== undefined ? { subdomain: (d.subdomain as string) || null } : {}),
          ...(d.domainStatus !== undefined
            ? { domainStatus: String(d.domainStatus || 'none') }
            : {}),
          ...(d.pendingCustomDomain !== undefined
            ? { pendingCustomDomain: (d.pendingCustomDomain as string) || null }
            : {}),
          ...(d.domainVerifiedAt !== undefined
            ? {
                domainVerifiedAt: d.domainVerifiedAt
                  ? new Date(d.domainVerifiedAt as string)
                  : null,
              }
            : {}),
          ...(d.domainNotes !== undefined
            ? { domainNotes: (d.domainNotes as string) || null }
            : {}),
        },
      });
    }
  } catch (err) {
    console.error('syncMongoInstitutionsIntoPrisma failed:', err);
  }
}

export async function getInstitutionDetail(id: string) {
  await syncMongoInstitutionsIntoPrisma();
  const inst = await prisma.institution.findUnique({
    where: { id },
    include: {
      owner: { select: { id: true, email: true, name: true, bannedAt: true } },
      federationLink: true,
      departments: { orderBy: { name: 'asc' } },
      memberships: {
        take: 100,
        orderBy: { joinedAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              name: true,
              bannedAt: true,
              banReason: true,
              globalRole: true,
            },
          },
        },
      },
      courses: {
        take: 50,
        orderBy: { updatedAt: 'desc' },
        select: {
          id: true,
          title: true,
          slug: true,
          status: true,
          priceXaf: true,
          instructorId: true,
          createdAt: true,
        },
      },
      withdrawalRequests: {
        take: 30,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { id: true, email: true, name: true } },
        },
      },
      instructorApplications: {
        take: 20,
        orderBy: { createdAt: 'desc' },
        include: {
          applicant: { select: { id: true, email: true, name: true } },
        },
      },
      auditLogs: {
        take: 30,
        orderBy: { createdAt: 'desc' },
        include: { actor: { select: { email: true, name: true } } },
      },
      _count: {
        select: {
          memberships: true,
          courses: true,
          certificates: true,
          liveClasses: true,
          departments: true,
        },
      },
    },
  });
  if (!inst) return null;

  const database = await getTenantDatabaseConfig(inst.id).catch(() => null);
  const resolvedFeatures = resolveInstitutionFeatures({
    capabilityPack: inst.capabilityPack,
    enabledModules: inst.enabledModules,
    featuresEnabled: inst.featuresEnabled,
  });

  return {
    ...inst,
    cnameTarget: platformCnameTarget(),
    database,
    featureCatalog: FEATURE_FLAG_CATALOG,
    resolvedFeatures,
    resolvedModules: resolveCampusModules({
      capabilityPack: isPack(inst.capabilityPack) ? inst.capabilityPack : 'foundation',
      enabledModules: inst.enabledModules as ModuleId[],
    }),
  };
}

export async function createInstitution(opts: {
  name: string;
  slug?: string;
  description?: string;
  email?: string;
  country?: string;
  website?: string;
  institutionType?: string;
  capabilityPack?: CapabilityPack;
  enabledModules?: ModuleId[];
  deploymentModel?: string;
  databaseMode?: TenantDatabaseMode;
  subdomain?: string | null;
  ownerEmail?: string;
  actorEmail?: string;
}) {
  const name = opts.name.trim().slice(0, 120);
  if (name.length < 2) throw new Error('Name is required');

  let slug = (opts.slug?.trim() || slugify(name)).toLowerCase();
  if (!slug) throw new Error('Invalid slug');

  const existing = await prisma.institution.findUnique({ where: { slug } });
  if (existing) {
    slug = `${slug}-${Date.now().toString(36).slice(-4)}`;
  }

  let ownerUserId: string | undefined;
  if (opts.ownerEmail) {
    const owner = await prisma.user.upsert({
      where: { email: opts.ownerEmail.trim().toLowerCase() },
      create: {
        email: opts.ownerEmail.trim().toLowerCase(),
        name: opts.ownerEmail.split('@')[0],
        emailVerified: new Date(),
      },
      update: {},
    });
    ownerUserId = owner.id;
  }

  const pack: CapabilityPack = opts.capabilityPack ?? 'foundation';
  const enabledModules =
    pack === 'custom'
      ? Array.from(new Set(opts.enabledModules ?? []))
      : modulesForPack(pack);

  const databaseMode: TenantDatabaseMode =
    opts.databaseMode && isValidDatabaseMode(opts.databaseMode)
      ? opts.databaseMode
      : databaseModeFromDeployment(opts.deploymentModel || 'SHARED_SAAS');

  const deploymentModel =
    (opts.deploymentModel as never) || deploymentFromDatabaseMode(databaseMode);

  let subdomain =
    (opts.subdomain || slug)
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '')
      .slice(0, 48) || slug;
  const subTaken = await prisma.institution.findFirst({
    where: { subdomain },
    select: { id: true },
  });
  if (subTaken) {
    subdomain = `${subdomain}-${Date.now().toString(36).slice(-4)}`;
  }

  const inst = await prisma.institution.create({
    data: {
      name,
      slug,
      subdomain,
      description: opts.description?.slice(0, 4000) || null,
      email: opts.email?.trim().toLowerCase() || null,
      country: opts.country || null,
      website: opts.website || null,
      institutionType: (opts.institutionType as never) || null,
      capabilityPack: pack,
      enabledModules,
      deploymentModel,
      status: 'PENDING',
      onboardingState: 'in_progress',
      onboardingProgress: 40,
      ownerUserId,
      visibility: 'PRIVATE',
    },
  });

  if (ownerUserId) {
    await prisma.institutionMembership.upsert({
      where: {
        institutionId_userId: { institutionId: inst.id, userId: ownerUserId },
      },
      create: {
        institutionId: inst.id,
        userId: ownerUserId,
        role: MembershipRole.INSTITUTION_OWNER,
        isActive: true,
      },
      update: {
        role: MembershipRole.INSTITUTION_OWNER,
        isActive: true,
        suspendedAt: null,
      },
    });
  }

  await writeAudit({
    actorEmail: opts.actorEmail,
    institutionId: inst.id,
    action: 'CREATE',
    entityType: 'Institution',
    entityId: inst.id,
    summary: `Created institution ${inst.name}`,
    metadata: { pack, slug: inst.slug },
  });

  await mirrorInstitutionToMongo(inst);

  return getInstitutionDetail(inst.id);
}

export async function updateInstitution(
  id: string,
  patch: {
    name?: string;
    description?: string | null;
    email?: string | null;
    country?: string | null;
    website?: string | null;
    status?: InstitutionLifecycleStatus;
    verified?: boolean;
    capabilityPack?: CapabilityPack;
    enabledModules?: ModuleId[];
    featuresEnabled?: string[];
    deploymentModel?: string;
    primaryColor?: string;
    visibility?: 'PUBLIC' | 'PRIVATE';
    logoUrl?: string | null;
    coverUrl?: string | null;
    settings?: Record<string, unknown>;
    actorEmail?: string;
  },
) {
  const current = await prisma.institution.findUnique({ where: { id } });
  if (!current) throw new Error('Institution not found');

  const data: Prisma.InstitutionUpdateInput = {};
  if (patch.name !== undefined) data.name = patch.name.trim().slice(0, 120);
  if (patch.description !== undefined) data.description = patch.description;
  if (patch.email !== undefined) data.email = patch.email;
  if (patch.country !== undefined) data.country = patch.country;
  if (patch.website !== undefined) data.website = patch.website;
  if (patch.status !== undefined) data.status = patch.status;
  if (patch.verified !== undefined) {
    data.verified = patch.verified;
    data.verifiedAt = patch.verified ? new Date() : null;
  }
  if (patch.primaryColor !== undefined) data.primaryColor = patch.primaryColor;
  if (patch.visibility !== undefined) data.visibility = patch.visibility;
  if (patch.logoUrl !== undefined) data.logoUrl = patch.logoUrl;
  if (patch.coverUrl !== undefined) data.coverUrl = patch.coverUrl;
  if (patch.deploymentModel !== undefined) {
    data.deploymentModel = patch.deploymentModel as never;
  }
  if (patch.settings !== undefined) {
    const prev =
      current.settings && typeof current.settings === 'object' && !Array.isArray(current.settings)
        ? (current.settings as Record<string, unknown>)
        : {};
    data.settings = { ...prev, ...patch.settings } as never;
  }

  let nextModules: ModuleId[] | undefined;

  if (patch.featuresEnabled !== undefined) {
    const flags = patch.featuresEnabled.filter(isFeatureFlagId) as FeatureFlagId[];
    data.featuresEnabled = flags;
    // Keep modules in sync with selected SaaS flags (additive with existing pack modules).
    const fromFlags = modulesFromFeatures(flags);
    const packModules =
      current.capabilityPack === 'custom'
        ? (current.enabledModules as ModuleId[])
        : modulesForPack(isPack(current.capabilityPack) ? current.capabilityPack : 'foundation');
    nextModules = Array.from(new Set([...packModules, ...fromFlags]));
    data.enabledModules = nextModules;
    if (fromFlags.length && current.capabilityPack !== 'custom') {
      // Preserve pack label unless admin is already on custom.
    }
  }

  if (patch.capabilityPack !== undefined) {
    const pack = patch.capabilityPack;
    data.capabilityPack = pack;
    if (pack === 'custom') {
      nextModules = Array.from(
        new Set(patch.enabledModules ?? (current.enabledModules as ModuleId[])),
      );
      data.enabledModules = nextModules;
    } else if (patch.enabledModules !== undefined) {
      nextModules = Array.from(new Set(patch.enabledModules));
      data.enabledModules = nextModules;
    } else {
      nextModules = modulesForPack(pack);
      data.enabledModules = nextModules;
    }
  } else if (patch.enabledModules !== undefined) {
    data.capabilityPack = 'custom';
    nextModules = Array.from(new Set(patch.enabledModules));
    data.enabledModules = nextModules;
  }

  if (nextModules && patch.featuresEnabled === undefined) {
    data.featuresEnabled = featuresFromModules(nextModules);
  }

  const inst = await prisma.institution.update({ where: { id }, data });

  await writeAudit({
    actorEmail: patch.actorEmail,
    institutionId: id,
    action: 'UPDATE',
    entityType: 'Institution',
    entityId: id,
    summary: `Updated institution ${inst.name}`,
    metadata: patch as unknown as Prisma.InputJsonValue,
  });

  await mirrorInstitutionToMongo(inst);
  return getInstitutionDetail(id);
}

export async function provisionInstitution(
  id: string,
  opts: { actorEmail?: string; activate?: boolean } = {},
) {
  const current = await prisma.institution.findUnique({ where: { id } });
  if (!current) throw new Error('Institution not found');

  const actorId = await actorUserId(opts.actorEmail);
  const inst = await prisma.institution.update({
    where: { id },
    data: {
      status: opts.activate === false ? 'PROVISIONING' : 'ACTIVE',
      provisionedAt: new Date(),
      provisionedById: actorId,
      verified: true,
      verifiedAt: new Date(),
    },
  });

  await prisma.institutionFederationLink.upsert({
    where: { institutionId: id },
    create: {
      institutionId: id,
      deploymentModel: inst.deploymentModel,
      databaseMode: databaseModeFromDeployment(inst.deploymentModel),
      databaseProvider: 'postgresql',
      databaseStatus: 'connected',
      schemaVersion: '1',
      migrationStatus: 'up_to_date',
      healthStatus: 'healthy',
      lastHealthAt: new Date(),
      activatedAt: new Date(),
    },
    update: {
      deploymentModel: inst.deploymentModel,
      healthStatus: 'healthy',
      lastHealthAt: new Date(),
      activatedAt: new Date(),
      databaseStatus: 'connected',
    },
  });

  await prisma.institution.update({
    where: { id },
    data: {
      onboardingState: 'published',
      onboardingProgress: 100,
      // Auto-assign Intellex subdomain from slug when missing.
      subdomain: inst.subdomain || inst.slug,
    },
  });

  await writeAudit({
    actorEmail: opts.actorEmail,
    institutionId: id,
    action: 'PROVISION',
    entityType: 'Institution',
    entityId: id,
    summary: `Provisioned institution ${inst.name}`,
  });

  await mirrorInstitutionToMongo(inst);
  return getInstitutionDetail(id);
}

export async function listPersonnel(opts?: {
  q?: string;
  banned?: boolean;
  role?: string;
  take?: number;
}) {
  // Ensure Mongo OAuth registrations exist in Supabase before listing.
  await syncMongoLearnersToPrisma(800).catch((err) =>
    console.error('personnel learner sync failed:', err),
  );

  const where: Prisma.UserWhereInput = {};
  if (opts?.banned === true) where.bannedAt = { not: null };
  if (opts?.banned === false) where.bannedAt = null;
  if (opts?.role) where.globalRole = opts.role as never;
  if (opts?.q?.trim()) {
    const q = opts.q.trim();
    where.OR = [
      { email: { contains: q, mode: 'insensitive' } },
      { name: { contains: q, mode: 'insensitive' } },
      { firstName: { contains: q, mode: 'insensitive' } },
      { lastName: { contains: q, mode: 'insensitive' } },
      { loopingBinaryId: { contains: q, mode: 'insensitive' } },
    ];
  }

  return prisma.user.findMany({
    where,
    take: opts?.take ?? 200,
    orderBy: [{ lastLoginAt: 'desc' }, { createdAt: 'desc' }],
    select: {
      id: true,
      email: true,
      name: true,
      firstName: true,
      lastName: true,
      globalRole: true,
      loopingBinaryId: true,
      bannedAt: true,
      banReason: true,
      createdAt: true,
      lastLoginAt: true,
      wallet: { select: { balance: true, currency: true } },
      mentorProfile: { select: { id: true, verified: true, tier: true } },
      memberships: {
        take: 8,
        include: {
          institution: { select: { id: true, name: true, slug: true, status: true } },
        },
      },
      _count: {
        select: {
          withdrawalRequests: true,
          orders: true,
          memberships: true,
        },
      },
    },
  });
}

export async function setUserBan(
  userId: string,
  opts: { ban: boolean; reason?: string; actorEmail?: string },
) {
  const user = await prisma.user.update({
    where: { id: userId },
    data: opts.ban
      ? { bannedAt: new Date(), banReason: opts.reason?.slice(0, 500) || 'Banned by platform admin' }
      : { bannedAt: null, banReason: null },
  });

  await writeAudit({
    actorEmail: opts.actorEmail,
    action: 'SUSPEND',
    entityType: 'User',
    entityId: userId,
    summary: opts.ban ? `Banned ${user.email}` : `Unbanned ${user.email}`,
    metadata: { reason: opts.reason ?? null },
  });

  return user;
}

export async function setMembershipSuspension(
  membershipId: string,
  opts: { suspend: boolean; reason?: string; actorEmail?: string },
) {
  const m = await prisma.institutionMembership.update({
    where: { id: membershipId },
    data: opts.suspend
      ? {
          suspendedAt: new Date(),
          suspendReason: opts.reason?.slice(0, 500) || 'Suspended by platform admin',
          isActive: false,
        }
      : { suspendedAt: null, suspendReason: null, isActive: true },
    include: {
      user: { select: { email: true } },
      institution: { select: { id: true, name: true } },
    },
  });

  await writeAudit({
    actorEmail: opts.actorEmail,
    institutionId: m.institutionId,
    action: 'SUSPEND',
    entityType: 'InstitutionMembership',
    entityId: membershipId,
    summary: opts.suspend
      ? `Suspended ${m.user.email} at ${m.institution.name}`
      : `Restored ${m.user.email} at ${m.institution.name}`,
  });

  return m;
}

export async function getFinanceSnapshot() {
  const [paid, refunded, pending, withdrawals, wallets, subscriptions, recentOrders] =
    await Promise.all([
      prisma.order.aggregate({
        where: { status: 'PAID' },
        _sum: { amountXaf: true },
        _count: true,
      }),
      prisma.order.aggregate({
        where: { status: 'REFUNDED' },
        _sum: { amountXaf: true },
        _count: true,
      }),
      prisma.order.aggregate({
        where: { status: 'PENDING' },
        _sum: { amountXaf: true },
        _count: true,
      }),
      prisma.withdrawalRequest.findMany({
        orderBy: { createdAt: 'desc' },
        take: 50,
        include: {
          user: {
            select: {
              id: true,
              email: true,
              name: true,
              bannedAt: true,
              wallet: { select: { balance: true, currency: true } },
            },
          },
          institution: { select: { id: true, name: true, slug: true } },
          reviewedBy: { select: { email: true, name: true } },
        },
      }),
      prisma.wallet.findMany({
        take: 40,
        orderBy: { balance: 'desc' },
        include: { user: { select: { id: true, email: true, name: true, bannedAt: true } } },
      }),
      prisma.subscription.findMany({
        take: 40,
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { email: true, name: true } } },
      }),
      prisma.order.findMany({
        take: 40,
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { email: true, name: true } } },
      }),
    ]);

  const withdrawalTotals = withdrawals.reduce(
    (acc, w) => {
      acc[w.status] = (acc[w.status] || 0) + w.amountCents;
      return acc;
    },
    {} as Record<string, number>,
  );

  return {
    income: {
      paidXaf: paid._sum.amountXaf ?? 0,
      paidCount: paid._count,
      pendingXaf: pending._sum.amountXaf ?? 0,
      pendingCount: pending._count,
    },
    spend: {
      refundedXaf: refunded._sum.amountXaf ?? 0,
      refundedCount: refunded._count,
      withdrawalsByStatusCents: withdrawalTotals,
    },
    withdrawals,
    wallets,
    subscriptions,
    recentOrders,
  };
}

export async function reviewWithdrawal(
  id: string,
  opts: {
    decision: 'approved' | 'rejected' | 'paid';
    note?: string;
    payoutRef?: string;
    actorEmail?: string;
  },
) {
  const current = await prisma.withdrawalRequest.findUnique({
    where: { id },
    include: {
      user: { include: { wallet: true } },
    },
  });
  if (!current) throw new Error('Withdrawal not found');
  if (current.status !== 'pending' && opts.decision !== 'paid') {
    throw new Error(`Cannot review withdrawal in status ${current.status}`);
  }

  if (opts.decision === 'approved' || opts.decision === 'paid') {
    if (current.user.bannedAt) {
      throw new Error('User is banned - cannot approve withdrawal');
    }
    const balance = current.user.wallet?.balance ?? 0;
    if (current.amountCents > balance) {
      throw new Error(
        `Insufficient wallet balance (${balance}) for requested ${current.amountCents}`,
      );
    }
  }

  const reviewerId = await actorUserId(opts.actorEmail);
  const status =
    opts.decision === 'approved' ? 'approved' : opts.decision === 'paid' ? 'paid' : 'rejected';

  const updated = await prisma.$transaction(async (tx) => {
    const w = await tx.withdrawalRequest.update({
      where: { id },
      data: {
        status,
        note: opts.note ?? current.note,
        payoutRef: opts.payoutRef ?? current.payoutRef,
        reviewedById: reviewerId,
        reviewedAt: new Date(),
      },
    });

    if ((opts.decision === 'approved' || opts.decision === 'paid') && current.user.wallet) {
      const wallet = current.user.wallet;
      const next = wallet.balance - current.amountCents;
      await tx.wallet.update({
        where: { id: wallet.id },
        data: { balance: next },
      });
      await tx.walletTransaction.create({
        data: {
          walletId: wallet.id,
          type: 'WITHDRAWAL',
          amount: current.amountCents,
          balanceAfter: next,
          reference: `withdrawal:${id}`,
          description: `Withdrawal ${status}`,
          metadata: { withdrawalId: id, payoutRef: opts.payoutRef ?? null },
        },
      });
    }

    return w;
  });

  await writeAudit({
    actorEmail: opts.actorEmail,
    institutionId: current.institutionId,
    action: opts.decision === 'rejected' ? 'REJECT' : 'APPROVE',
    entityType: 'WithdrawalRequest',
    entityId: id,
    summary: `Withdrawal ${status} for ${current.amountCents} ${current.currency}`,
  });

  return updated;
}

export async function listConnections() {
  const [federation, verifications, audit] = await Promise.all([
    prisma.institutionFederationLink.findMany({
      orderBy: { updatedAt: 'desc' },
      include: {
        institution: {
          select: {
            id: true,
            name: true,
            slug: true,
            status: true,
            deploymentModel: true,
            capabilityPack: true,
          },
        },
      },
    }),
    prisma.crossInstitutionVerification.findMany({
      take: 40,
      orderBy: { createdAt: 'desc' },
      include: {
        requester: { select: { email: true, name: true } },
        target: { select: { name: true, slug: true } },
      },
    }),
    prisma.auditLog.findMany({
      take: 60,
      orderBy: { createdAt: 'desc' },
      include: {
        actor: { select: { email: true, name: true } },
        institution: { select: { name: true, slug: true } },
      },
    }),
  ]);

  return { federation, verifications, audit };
}

export async function listGovernanceQueue() {
  const [institutions, instructors, mentorDocs] = await Promise.all([
    prisma.institutionApplication.findMany({
      where: { status: { in: ['SUBMITTED', 'UNDER_REVIEW'] } },
      orderBy: { createdAt: 'desc' },
      take: 50,
      include: {
        applicant: { select: { id: true, email: true, name: true } },
      },
    }),
    prisma.instructorApplication.findMany({
      where: { status: { in: ['SUBMITTED', 'UNDER_REVIEW'] } },
      orderBy: { createdAt: 'desc' },
      take: 50,
      include: {
        applicant: { select: { id: true, email: true, name: true } },
        institution: { select: { id: true, name: true, slug: true } },
      },
    }),
    getDb()
      .then((db) =>
        db
          .collection('mentor_applications')
          .find({ status: { $in: ['submitted', 'under_review'] } })
          .sort({ createdAt: -1 })
          .limit(50)
          .toArray(),
      )
      .catch(() => []),
  ]);

  // Shape Mongo mentor apps so the governance panel can render them.
  const mentors = mentorDocs.map((d) => {
    const { _id, name, email, title, status, createdAt } = d as {
      _id: { toString(): string };
      name?: string;
      email?: string | null;
      title?: string;
      status?: string;
      createdAt?: Date | string;
    };
    return {
      id: _id.toString(),
      title: title ?? '',
      status: status ?? 'submitted',
      createdAt: createdAt ?? null,
      applicant: { id: null, email: email ?? null, name: name ?? null },
      source: 'mongo' as const,
    };
  });

  return { institutions, instructors, mentors };
}

export async function reviewInstitutionApplication(
  id: string,
  opts: {
    decision: 'approve' | 'reject';
    reviewNotes?: string;
    capabilityPack?: CapabilityPack;
    actorEmail?: string;
  },
) {
  const app = await prisma.institutionApplication.findUnique({ where: { id } });
  if (!app) throw new Error('Application not found');
  if (app.status !== 'SUBMITTED' && app.status !== 'UNDER_REVIEW') {
    throw new Error('Application already reviewed');
  }

  const reviewerId = await actorUserId(opts.actorEmail);

  if (opts.decision === 'reject') {
    const updated = await prisma.institutionApplication.update({
      where: { id },
      data: {
        status: 'REJECTED',
        reviewerId: reviewerId ?? undefined,
        reviewNotes: opts.reviewNotes,
        reviewedAt: new Date(),
      },
    });
    await writeAudit({
      actorEmail: opts.actorEmail,
      action: 'REJECT',
      entityType: 'InstitutionApplication',
      entityId: id,
      summary: `Rejected institution application ${app.name}`,
    });
    return { application: updated, institution: null };
  }

  const pack = opts.capabilityPack ?? 'foundation';
  const inst = await createInstitution({
    name: app.name,
    slug: app.slugRequested || undefined,
    description: app.description || undefined,
    email: app.officialEmail,
    country: app.country || undefined,
    website: app.website || undefined,
    institutionType: app.institutionType,
    capabilityPack: pack,
    deploymentModel: app.requestedDeployment,
    ownerEmail: undefined,
    actorEmail: opts.actorEmail,
  });

  if (inst && app.applicantId) {
    await prisma.institution.update({
      where: { id: inst.id },
      data: { ownerUserId: app.applicantId },
    });
    await prisma.institutionMembership.upsert({
      where: {
        institutionId_userId: { institutionId: inst.id, userId: app.applicantId },
      },
      create: {
        institutionId: inst.id,
        userId: app.applicantId,
        role: MembershipRole.INSTITUTION_OWNER,
      },
      update: { role: MembershipRole.INSTITUTION_OWNER, isActive: true },
    });
    await provisionInstitution(inst.id, { actorEmail: opts.actorEmail });
  }

  const updated = await prisma.institutionApplication.update({
    where: { id },
    data: {
      status: 'APPROVED',
      reviewerId: reviewerId ?? undefined,
      reviewNotes: opts.reviewNotes,
      reviewedAt: new Date(),
      provisionedInstitutionId: inst?.id,
    },
  });

  await writeAudit({
    actorEmail: opts.actorEmail,
    institutionId: inst?.id,
    action: 'APPROVE',
    entityType: 'InstitutionApplication',
    entityId: id,
    summary: `Approved & provisioned ${app.name}`,
  });

  return { application: updated, institution: inst };
}

/** Remove imported / Udemy-style Mongo catalogue courses. Keeps only Intellex-origin if any. */
export async function purgeImportedCatalogue() {
  const db = await getDb();
  const col = db.collection('courses');
  const before = await col.countDocuments();
  const result = await col.deleteMany({
    $or: [
      { courseOrigin: { $nin: ['Intellex', 'InTelleX'] } },
      { courseOrigin: { $exists: false } },
      { courseOrigin: null },
    ],
  });
  // Also wipe any leftover static seed that was inserted with numeric id / Udemy fields
  const leftover = await col.deleteMany({
    courseOrigin: { $regex: /udemy/i },
  });
  const after = await col.countDocuments();
  return {
    before,
    deleted: result.deletedCount + leftover.deletedCount,
    after,
  };
}

export async function purgeAllMongoCatalogue() {
  const db = await getDb();
  const col = db.collection('courses');
  const before = await col.countDocuments();
  const result = await col.deleteMany({});
  return { before, deleted: result.deletedCount, after: 0 };
}

/** Intellex Admin: view / update organization PostgreSQL strategy. */
export async function getInstitutionInfrastructure(institutionId: string) {
  return getTenantDatabaseConfig(institutionId);
}

export async function updateInstitutionInfrastructure(
  input: SetTenantDatabaseInput & { actorEmail?: string | null },
) {
  const health = await setTenantDatabaseStrategy(input);
  await writeAudit({
    actorEmail: input.actorEmail,
    institutionId: input.institutionId,
    action: 'UPDATE',
    entityType: 'InstitutionInfrastructure',
    entityId: input.institutionId,
    summary: `Set database mode to ${input.databaseMode}`,
    metadata: {
      databaseMode: input.databaseMode,
      credentialRefPresent: Boolean(input.credentialRef),
    },
  });
  return health;
}

export async function checkInstitutionDatabase(institutionId: string, actorEmail?: string | null) {
  const result = await testTenantDatabaseConnection(institutionId);
  await writeAudit({
    actorEmail,
    institutionId,
    action: 'ADMIN',
    entityType: 'InstitutionInfrastructure',
    entityId: institutionId,
    summary: result.ok ? 'Database health check passed' : 'Database health check failed',
    metadata: result as never,
  });
  return result;
}

export async function getPlatformCatalogPlans() {
  await ensureDefaultCatalogPlans();
  return {
    student: await listCatalogPlans('STUDENT_RESOURCE'),
    organization: await listCatalogPlans('ORGANIZATION'),
  };
}

export async function patchCatalogPlan(
  code: string,
  patch: {
    priceMonthly?: number;
    priceYearly?: number | null;
    name?: string;
    summary?: string | null;
    features?: string[];
  },
  actorEmail?: string | null,
) {
  const plan = await updateCatalogPlanPrice({ code, ...patch });
  await writeAudit({
    actorEmail,
    action: 'UPDATE',
    entityType: 'CatalogPlan',
    entityId: plan.id,
    summary: `Updated catalog plan ${code}`,
    metadata: patch as never,
  });
  return plan;
}

