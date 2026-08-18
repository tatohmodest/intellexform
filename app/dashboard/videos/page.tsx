import { redirect } from 'next/navigation';
import { Youtube } from 'lucide-react';
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
        <div className="tab mb-2 inline-flex items-center gap-1.5">
          <Youtube size={11} />
          Video hall
        </div>
        <h1 className="font-display text-[30px] leading-tight">Video Tutorials</h1>
        <p className="mt-1 max-w-xl text-[14.5px]" style={{ color: 'var(--ink-soft)' }}>
          Hand-picked courses plus YouTube search — watch everything here without leaving InTelleX.
        </p>
      </div>
      <VideoLibrary isAdmin={isAdminEmail(session.email)} />
    </div>
  );
}
