import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/auth/getUser';
import { isVerifiedAdminSession } from '@/lib/adminAuth';
import VideoLibrary from '@/components/dashboard/VideoLibrary';
import PageHeader from '@/components/dashboard/PageHeader';

export const dynamic = 'force-dynamic';

export default function VideosPage() {
  const session = getSessionUser();
  if (!session) redirect('/login?next=/dashboard/videos');

  return (
    <div className="mx-auto max-w-[1100px]">
      <PageHeader
        art="/illustrations/reading.png"
        tone="peach"
        title="Video Hall"
        description="Hand-picked video tutorials to watch alongside your courses."
      />
      <VideoLibrary isAdmin={isVerifiedAdminSession(session)} />
    </div>
  );
}
