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
        <h1 className="font-display text-[26px] leading-[1.1] tracking-tight sm:text-[32px]">Notes Studio</h1>
      </div>
      <NotesStudio initialCourseId={initialCourseId} />
    </div>
  );
}
