import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/auth/getUser';
import { BookTutorError, getLearnerSession } from '@/lib/learn/bookTutor';
import BookTutorLearn from '@/components/dashboard/BookTutorLearn';
import BookTutorDeleteButton from '@/components/dashboard/BookTutorDeleteButton';

export const dynamic = 'force-dynamic';

export default async function BookTutorSessionPage({ params }: { params: { id: string } }) {
  const user = getSessionUser();
  if (!user) redirect(`/login?next=/dashboard/library/learn/${params.id}`);

  let session;
  try {
    session = await getLearnerSession(user.uid, params.id);
  } catch (err) {
    if (err instanceof BookTutorError && err.status === 404) notFound();
    if (err instanceof BookTutorError && err.status === 403) {
      return (
        <div className="mx-auto max-w-[640px] py-16 text-center">
          <h1 className="font-display text-[28px]">This tutor is private</h1>
          <p className="mt-3 text-[14px]" style={{ color: 'var(--ink-soft)' }}>
            {err.message}
          </p>
          <Link href="/dashboard/library/learn" className="mt-6 inline-block text-[13px] font-semibold">
            ← Book tutor
          </Link>
        </div>
      );
    }
    throw err;
  }

  return (
    <div className="mx-auto max-w-[720px]">
      <Link href="/dashboard/library/learn" className="text-[13px] font-semibold" style={{ color: 'var(--green-deep)' }}>
        ← Book tutor
      </Link>
      <p className="tab mt-4 mb-2 inline-flex items-center gap-1.5">Step by step</p>
      <h1 className="font-display text-[30px] leading-tight">{session.path.title}</h1>
      <p className="mb-8 mt-1 text-[14px]" style={{ color: 'var(--ink-soft)' }}>
        {session.path.authorName ? `with ${session.path.authorName} · ` : ''}
        {session.path.status === 'ready'
          ? `${session.path.lessonCount} tutor steps`
          : session.path.status === 'failed'
            ? 'Could not prepare this course'
            : 'Preparing the complete course — wait here until it is ready'}
      </p>
      {session.path.canDelete ? (
        <BookTutorDeleteButton pathId={session.path.id} title={session.path.title} />
      ) : null}
      <div className="mt-6">
        <BookTutorLearn initial={session} />
      </div>
    </div>
  );
}
