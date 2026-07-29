import NotesStudio from '@/components/dashboard/NotesStudio';

export const dynamic = 'force-dynamic';

export default function TeachNotesPage({
  searchParams,
}: {
  searchParams?: { courseId?: string };
}) {
  const initialCourseId =
    typeof searchParams?.courseId === 'string' && searchParams.courseId.trim()
      ? searchParams.courseId.trim()
      : null;

  return (
    <div className="mx-auto max-w-[1100px]">
      <div className="mb-6">
        <div className="tab mb-2">Teaching</div>
        <h1 className="font-display text-[28px] leading-tight sm:text-[32px]">Notes Studio</h1>
        <p className="mt-1 max-w-2xl text-[14.5px]" style={{ color: 'var(--ink-soft)' }}>
          Send class notes to your students (Cloudinary upload or Google Drive link). They can open
          them on the side or download. Optionally list notes in the Library with a price.
        </p>
      </div>
      <NotesStudio initialCourseId={initialCourseId} />
    </div>
  );
}
