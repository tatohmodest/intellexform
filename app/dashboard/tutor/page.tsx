import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/auth/getUser';
import PageHeader from '@/components/dashboard/PageHeader';
import TutorChat from '@/components/dashboard/TutorChat';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'InTelleX AI · Tutor',
  description: 'Interactive InTelleX AI tutor - quiz, plans, explanations, and debugging help.',
};

export default function TutorPage() {
  const session = getSessionUser();
  if (!session) redirect('/login?next=/dashboard/tutor');

  return (
    <div className="mx-auto max-w-[1100px]">
      <PageHeader
        art="/illustrations/teaching.png"
        tone="lilac"
        title="AI Tutor"
        description="Ask anything, get quizzes, study plans and step-by-step explanations."
      />
      <Suspense>
        <TutorChat />
      </Suspense>
    </div>
  );
}
