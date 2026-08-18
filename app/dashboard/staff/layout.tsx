import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/auth/getUser';
import { getStaffPost, hasPermission, permissionsOf } from '@/lib/staff/store';
import StaffSubnav from '@/components/staff/StaffSubnav';

export const dynamic = 'force-dynamic';

export default async function StaffLayout({ children }: { children: React.ReactNode }) {
  const session = getSessionUser();
  if (!session) redirect('/login?next=/dashboard/staff');

  const post = await getStaffPost(session.uid);
  if (!post || !hasPermission(post, 'staff.access')) {
    redirect('/dashboard');
  }

  return (
    <div className="mx-auto w-full max-w-[1080px]">
      <StaffSubnav desks={post.desks} permissions={permissionsOf(post)} campusSlugs={post.campusSlugs} />
      {children}
    </div>
  );
}
