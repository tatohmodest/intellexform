/**
 * Organization LMS — Prisma-backed people, courses, enrollments.
 * Preferred data plane for tenant operations (replacing Mongo campus reads gradually).
 */

import { MembershipRole, type Prisma } from '@prisma/client';
import { prisma } from '@/lib/db/prisma';
import { getTenantPrisma } from '@/lib/eduos/tenantDb';
import { slugify } from '@/lib/learn/ecosystem';

const STAFF_ROLES: MembershipRole[] = [
  MembershipRole.INSTRUCTOR,
  MembershipRole.MENTOR,
  MembershipRole.TEACHING_ASSISTANT,
  MembershipRole.DEPARTMENT_ADMIN,
  MembershipRole.ORG_ADMIN,
  MembershipRole.INSTITUTION_OWNER,
  MembershipRole.STAFF,
];

const STUDENT_ROLES: MembershipRole[] = [MembershipRole.STUDENT, MembershipRole.GUEST];

export async function resolveInstitutionId(slug: string): Promise<string | null> {
  const inst = await prisma.institution.findUnique({
    where: { slug },
    select: { id: true },
  });
  return inst?.id ?? null;
}

export async function assertOrgStaff(opts: {
  slug: string;
  userId?: string | null;
  email?: string | null;
}): Promise<{ institutionId: string; role: MembershipRole } | { error: string }> {
  const institutionId = await resolveInstitutionId(opts.slug);
  if (!institutionId) return { error: 'not_found' };

  let prismaUserId = opts.userId || null;
  if (!prismaUserId && opts.email) {
    const u = await prisma.user.findUnique({
      where: { email: opts.email.trim().toLowerCase() },
      select: { id: true },
    });
    prismaUserId = u?.id ?? null;
  }
  if (!prismaUserId) return { error: 'unauthorized' };

  // Also try loopingBinaryId match when userId is LB id from session.
  let membership = await prisma.institutionMembership.findUnique({
    where: {
      institutionId_userId: { institutionId, userId: prismaUserId },
    },
    select: { role: true, isActive: true, suspendedAt: true },
  });

  if (!membership && opts.userId) {
    const byLb = await prisma.user.findFirst({
      where: { loopingBinaryId: opts.userId },
      select: { id: true },
    });
    if (byLb) {
      membership = await prisma.institutionMembership.findUnique({
        where: {
          institutionId_userId: { institutionId, userId: byLb.id },
        },
        select: { role: true, isActive: true, suspendedAt: true },
      });
      prismaUserId = byLb.id;
    }
  }

  if (!membership || !membership.isActive || membership.suspendedAt) {
    return { error: 'forbidden' };
  }

  const allowed: MembershipRole[] = [
    MembershipRole.INSTITUTION_OWNER,
    MembershipRole.ORG_ADMIN,
    MembershipRole.DEPARTMENT_ADMIN,
    MembershipRole.INSTRUCTOR,
    MembershipRole.MENTOR,
    MembershipRole.STAFF,
  ];
  if (!allowed.includes(membership.role)) {
    return { error: 'forbidden' };
  }

  return { institutionId, role: membership.role };
}

export async function listOrgMembers(opts: {
  slug: string;
  roleFilter?: 'students' | 'instructors' | 'all';
  q?: string;
  take?: number;
}) {
  const institutionId = await resolveInstitutionId(opts.slug);
  if (!institutionId) return [];

  const { client } = await getTenantPrisma(institutionId);
  const roles =
    opts.roleFilter === 'students'
      ? STUDENT_ROLES
      : opts.roleFilter === 'instructors'
        ? STAFF_ROLES.filter((r) => r !== MembershipRole.INSTITUTION_OWNER)
        : undefined;

  const where: Prisma.InstitutionMembershipWhereInput = {
    institutionId,
    ...(roles ? { role: { in: roles } } : {}),
  };
  if (opts.q?.trim()) {
    const q = opts.q.trim();
    where.user = {
      OR: [
        { email: { contains: q, mode: 'insensitive' } },
        { name: { contains: q, mode: 'insensitive' } },
        { firstName: { contains: q, mode: 'insensitive' } },
        { lastName: { contains: q, mode: 'insensitive' } },
      ],
    };
  }

  return client.institutionMembership.findMany({
    where,
    take: opts.take ?? 200,
    orderBy: { joinedAt: 'desc' },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          name: true,
          firstName: true,
          lastName: true,
          image: true,
          bannedAt: true,
        },
      },
    },
  });
}

export async function addOrgMember(opts: {
  institutionId: string;
  email: string;
  role: MembershipRole;
  title?: string;
  name?: string;
}) {
  const { client } = await getTenantPrisma(opts.institutionId);
  const email = opts.email.trim().toLowerCase();
  if (!email.includes('@')) throw new Error('Valid email required');

  const user = await client.user.upsert({
    where: { email },
    create: {
      email,
      name: opts.name || email.split('@')[0],
      emailVerified: new Date(),
    },
    update: opts.name ? { name: opts.name } : {},
  });

  return client.institutionMembership.upsert({
    where: {
      institutionId_userId: { institutionId: opts.institutionId, userId: user.id },
    },
    create: {
      institutionId: opts.institutionId,
      userId: user.id,
      role: opts.role,
      title: opts.title || null,
      isActive: true,
    },
    update: {
      role: opts.role,
      title: opts.title || undefined,
      isActive: true,
      suspendedAt: null,
    },
    include: {
      user: { select: { id: true, email: true, name: true } },
    },
  });
}

export async function setOrgMemberStatus(opts: {
  institutionId: string;
  membershipId: string;
  suspend: boolean;
  reason?: string;
}) {
  const { client } = await getTenantPrisma(opts.institutionId);
  return client.institutionMembership.update({
    where: { id: opts.membershipId },
    data: opts.suspend
      ? { suspendedAt: new Date(), suspendReason: opts.reason || 'Suspended by org admin' }
      : { suspendedAt: null, suspendReason: null, isActive: true },
  });
}

export async function listOrgCourses(opts: {
  slug: string;
  status?: string;
  publishedOnly?: boolean;
  take?: number;
}) {
  const institutionId = await resolveInstitutionId(opts.slug);
  if (!institutionId) return [];
  const { client } = await getTenantPrisma(institutionId);

  return client.course.findMany({
    where: {
      institutionId,
      ...(opts.publishedOnly ? { status: 'PUBLISHED' } : {}),
      ...(opts.status ? { status: opts.status as never } : {}),
    },
    take: opts.take ?? 100,
    orderBy: { updatedAt: 'desc' },
    include: {
      _count: { select: { enrollments: true, sections: true } },
      enrollments: {
        take: 0,
      },
    },
  });
}

export async function createOrgCourse(opts: {
  institutionId: string;
  title: string;
  description?: string;
  instructorUserId?: string | null;
  priceXaf?: number;
  status?: 'DRAFT' | 'PUBLISHED';
}) {
  const { client } = await getTenantPrisma(opts.institutionId);
  const title = opts.title.trim().slice(0, 200);
  if (title.length < 2) throw new Error('Title required');

  let slug = slugify(title) || `course-${Date.now().toString(36)}`;
  const taken = await client.course.findUnique({
    where: { institutionId_slug: { institutionId: opts.institutionId, slug } },
  });
  if (taken) slug = `${slug}-${Date.now().toString(36).slice(-4)}`;

  return client.course.create({
    data: {
      institutionId: opts.institutionId,
      title,
      slug,
      description: opts.description?.slice(0, 8000) || null,
      instructorId: opts.instructorUserId || null,
      priceXaf: opts.priceXaf ?? 0,
      status: opts.status || 'DRAFT',
      publishedAt: opts.status === 'PUBLISHED' ? new Date() : null,
    },
  });
}

export async function enrollUserInCourse(opts: {
  institutionId: string;
  courseId: string;
  userEmail: string;
  userName?: string;
}) {
  const { client } = await getTenantPrisma(opts.institutionId);
  const course = await client.course.findFirst({
    where: { id: opts.courseId, institutionId: opts.institutionId },
    select: { id: true },
  });
  if (!course) throw new Error('Course not found in this organization');

  const email = opts.userEmail.trim().toLowerCase();
  const user = await client.user.upsert({
    where: { email },
    create: {
      email,
      name: opts.userName || email.split('@')[0],
      emailVerified: new Date(),
    },
    update: {},
  });

  await client.institutionMembership.upsert({
    where: {
      institutionId_userId: { institutionId: opts.institutionId, userId: user.id },
    },
    create: {
      institutionId: opts.institutionId,
      userId: user.id,
      role: MembershipRole.STUDENT,
      isActive: true,
    },
    update: { isActive: true },
  });

  return client.enrollment.upsert({
    where: { userId_courseId: { userId: user.id, courseId: course.id } },
    create: {
      userId: user.id,
      courseId: course.id,
      status: 'ACTIVE',
      source: 'org_admin',
    },
    update: { status: 'ACTIVE' },
    include: {
      user: { select: { id: true, email: true, name: true } },
      course: { select: { id: true, title: true, slug: true } },
    },
  });
}

export async function listCourseEnrollments(opts: {
  institutionId: string;
  courseId: string;
}) {
  const { client } = await getTenantPrisma(opts.institutionId);
  return client.enrollment.findMany({
    where: {
      courseId: opts.courseId,
      course: { institutionId: opts.institutionId },
    },
    orderBy: { enrolledAt: 'desc' },
    include: {
      user: { select: { id: true, email: true, name: true, image: true } },
    },
  });
}

export async function getOrgLmsSummary(slug: string) {
  const institutionId = await resolveInstitutionId(slug);
  if (!institutionId) return null;
  const { client } = await getTenantPrisma(institutionId);

  const [students, instructors, courses, enrollments, published] = await Promise.all([
    client.institutionMembership.count({
      where: { institutionId, role: { in: STUDENT_ROLES }, isActive: true },
    }),
    client.institutionMembership.count({
      where: {
        institutionId,
        role: { in: [MembershipRole.INSTRUCTOR, MembershipRole.MENTOR] },
        isActive: true,
      },
    }),
    client.course.count({ where: { institutionId } }),
    client.enrollment.count({
      where: { course: { institutionId }, status: 'ACTIVE' },
    }),
    client.course.count({ where: { institutionId, status: 'PUBLISHED' } }),
  ]);

  return { students, instructors, courses, enrollments, published };
}

/** Search global Intellex users to add as instructors (no duplicate accounts). */
export async function searchIntellexUsers(q: string, take = 20) {
  const query = q.trim();
  if (query.length < 2) return [];
  return prisma.user.findMany({
    where: {
      OR: [
        { email: { contains: query, mode: 'insensitive' } },
        { name: { contains: query, mode: 'insensitive' } },
        { firstName: { contains: query, mode: 'insensitive' } },
        { lastName: { contains: query, mode: 'insensitive' } },
      ],
      bannedAt: null,
    },
    take,
    select: {
      id: true,
      email: true,
      name: true,
      image: true,
      mentorProfile: { select: { verified: true, expertise: true, tier: true } },
    },
    orderBy: { updatedAt: 'desc' },
  });
}
