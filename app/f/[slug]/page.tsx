import PublicFormClient from '@/components/staff/PublicFormClient';

export const dynamic = 'force-dynamic';

export default function PublicFormPage({ params }: { params: { slug: string } }) {
  return (
    <main className="min-h-screen bg-paper text-ink">
      <PublicFormClient slug={params.slug} />
    </main>
  );
}
