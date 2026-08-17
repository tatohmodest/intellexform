import { redirect, notFound } from 'next/navigation';
import { prisma } from '@/lib/db/prisma';

export const dynamic = 'force-dynamic';

/**
 * Short public campus URL on the platform host:
 *   https://intellex.loopingbinary.com/{slug}
 * → redirects to the white-label site at /site/{slug}.
 *
 * Static routes (contact, courses, tutorials, …) take precedence over this.
 */
export default async function CampusShortPathPage({
  params,
}: {
  params: { campusSlug: string };
}) {
  const key = String(params.campusSlug || '')
    .trim()
    .toLowerCase()
    .slice(0, 64);
  if (!key || key.includes('.') || key.includes('/')) notFound();

  let slug: string | null = null;
  try {
    const inst = await prisma.institution.findFirst({
      where: {
        OR: [{ slug: key }, { subdomain: key }],
        status: { notIn: ['ARCHIVED', 'REJECTED'] },
      },
      select: { slug: true },
    });
    slug = inst?.slug || null;
  } catch {
    slug = null;
  }

  if (!slug) notFound();
  redirect(`/site/${slug}`);
}
