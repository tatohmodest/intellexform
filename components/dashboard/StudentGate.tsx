import BecomeStudentBanner, { StudentFeaturePrompt } from '@/components/dashboard/BecomeStudentBanner';
import { getOrgConfig } from '@/lib/org/config';
import { isOfficialStudent } from '@/lib/learn/studentAccess';

export default async function StudentGate({
  userId,
  children,
}: {
  userId: string;
  children: React.ReactNode;
}) {
  const [ok, org] = await Promise.all([isOfficialStudent(userId), getOrgConfig()]);
  if (ok) return <>{children}</>;
  return <StudentFeaturePrompt institutionName={org.name} />;
}

export { BecomeStudentBanner };
