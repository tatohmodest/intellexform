import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/auth/getUser';
import { isAdminEmail } from '@/lib/adminAuth';
import VideoLibrary from '@/components/dashboard/VideoLibrary';

export const dynamic = 'force-dynamic';

export default function VideosPage() {
  const session = getSessionUser();
  if (!session) redirect('/login?next=/dashboard/videos');

  return (
    <div className="mx-auto max-w-[1100px]">
      <div className="mb-8">
        <h1 className="font-display text-[26px] leading-[1.1] tracking-tight sm:text-[32px]">Video Tutorials</h1>
      </div>
      <VideoLibrary isAdmin={isAdminEmail(session.email)} />
    </div>
  );
}
