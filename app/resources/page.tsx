import EcosystemPage from '@/components/landing/EcosystemPage';
import { getEcosystem } from '@/lib/ecosystem';

export const metadata = {
  title: 'Free Resources — Intellex',
  description: 'Free guides, checklists, and learning tools from Intellex.',
};

export default function ResourcesPage() {
  const item = getEcosystem('resources')!;
  return <EcosystemPage item={item} />;
}
