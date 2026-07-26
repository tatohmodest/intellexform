import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

/** Lightweight EduOS schema smoke-check against Supabase. */
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
    ] = await Promise.all([
      prisma.institution.count(),
      prisma.user.count(),
      prisma.category.count(),
      prisma.course.count(),
      prisma.book.count(),
      prisma.mediaRecommendation.count(),
      prisma.institutionMembership.count(),
      prisma.badge.count(),
    ]);

    const home = await prisma.institution.findFirst({
      where: { isPlatformHome: true },
      select: { id: true, slug: true, name: true, primaryColor: true },
    });

    return NextResponse.json({
      ok: true,
      platform: "InTelleX EduOS",
      database: "supabase-postgres",
      home,
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
