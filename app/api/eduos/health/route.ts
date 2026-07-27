import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { GOLDEN_RULE, AUTHORITY_HIERARCHY } from "@/lib/eduos/governance";
import { FEDERATION_LAYERS } from "@/lib/eduos/federation";

/** EduOS smoke-check + governance posture. */
export async function GET() {
  try {
    const [
      institutions,
      users,
      categories,
      courses,
      books,
      mediaRecommendations,
      memberships,
      badges,
      institutionApplications,
      mentorApplications,
      auditLogs,
      platformOwners,
    ] = await Promise.all([
      prisma.institution.count(),
      prisma.user.count(),
      prisma.category.count(),
      prisma.course.count(),
      prisma.book.count(),
      prisma.mediaRecommendation.count(),
      prisma.institutionMembership.count(),
      prisma.badge.count(),
      prisma.institutionApplication.count(),
      prisma.mentorApplication.count(),
      prisma.auditLog.count(),
      prisma.user.count({ where: { globalRole: "PLATFORM_OWNER" } }),
    ]);

    const home = await prisma.institution.findFirst({
      where: { isPlatformHome: true },
      select: {
        id: true,
        slug: true,
        name: true,
        primaryColor: true,
        status: true,
        verified: true,
        ownerUserId: true,
        deploymentModel: true,
      },
    });

    return NextResponse.json({
      ok: true,
      platform: "InTelleX EduOS",
      architecture: "federated",
      goldenRule: GOLDEN_RULE,
      authorityHierarchy: AUTHORITY_HIERARCHY,
      layers: {
        coreOwns: FEDERATION_LAYERS.core.owns,
        coreNeverOwns: FEDERATION_LAYERS.core.neverOwns,
      },
      database: "supabase-postgres",
      home,
      governance: {
        platformOwnerCount: platformOwners,
        institutionApplications,
        mentorApplications,
        auditLogs,
      },
      counts: {
        institutions,
        users,
        categories,
        courses,
        books,
        mediaRecommendations,
        memberships,
        badges,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown database error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
