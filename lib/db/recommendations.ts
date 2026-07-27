import { prisma } from "@/lib/db/prisma";

/**
 * Platform-curated YouTube / external media recommendations based on learner field.
 * Tutor-authored paid books live in the Book model — not here.
 */
export async function getRecommendedMediaForField(
  fieldOfInterest?: string | null,
  limit = 12,
) {
  const tags = fieldToTags(fieldOfInterest);

  if (tags.length === 0) {
    return prisma.mediaRecommendation.findMany({
      where: { isFeatured: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      take: limit,
    });
  }

  return prisma.mediaRecommendation.findMany({
    where: {
      OR: [
        { fieldTags: { hasSome: tags } },
        { isFeatured: true },
      ],
    },
    orderBy: [{ isFeatured: "desc" }, { sortOrder: "asc" }],
    take: limit,
  });
}

export async function getTutorBooks(opts?: {
  field?: string | null;
  institutionId?: string;
  limit?: number;
}) {
  const tags = fieldToTags(opts?.field);
  return prisma.book.findMany({
    where: {
      status: "PUBLISHED",
      ...(opts?.institutionId ? { institutionId: opts.institutionId } : {}),
      ...(tags.length ? { fieldTags: { hasSome: tags } } : {}),
    },
    include: {
      author: { select: { id: true, name: true, image: true } },
      chapters: {
        where: { isPreview: true },
        orderBy: { sortOrder: "asc" },
        take: 1,
      },
    },
    orderBy: { publishedAt: "desc" },
    take: opts?.limit ?? 20,
  });
}

function fieldToTags(field?: string | null): string[] {
  if (!field) return [];
  return field
    .toLowerCase()
    .split(/[\s,/|]+/)
    .map((t) => t.trim())
    .filter(Boolean);
}
