import EcosystemPage from '@/components/landing/EcosystemPage';
import { getEcosystem } from '@/lib/ecosystem';

export const metadata = {
  title: 'Online Learning Environment — Intellex',
  description: 'How the Intellex online learning environment helps you finish what you start.',
};

export default function LearningPage() {
  const item = getEcosystem('learning')!;
  return <EcosystemPage item={item} />;
}
