import OrgCoursePlayer from '@/components/dashboard/OrgCoursePlayer';
import { getSessionUser } from '@/lib/auth/getUser';
import { prisma } from '@/lib/db/prisma';
import { redirect, notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function OrgLearnCoursePage({
  params,
}: {
  params: { slug: string; courseId: string };
}) {
  const session = getSessionUser();
  if (!session) {
    redirect(
      `/login?next=/dashboard/institutions/${params.slug}/learn/${params.courseId}`,
    );
  }

  const inst = await prisma.institution.findUnique({
    where: { slug: params.slug },
    select: { id: true, slug: true, primaryColor: true, name: true, status: true },
  });
  if (!inst || inst.status === 'SUSPENDED' || inst.status === 'ARCHIVED') {
    notFound();
  }

  return (
    <div className="mx-auto max-w-[1100px] px-4 py-8 sm:px-6">
      <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.16em]" style={{ color: 'var(--ink-soft)' }}>
        {inst.name} · Learning engine
      </p>
      <OrgCoursePlayer
        slug={inst.slug}
        courseId={params.courseId}
        accent={inst.primaryColor || '#00B369'}
      />
    </div>
  );
}
