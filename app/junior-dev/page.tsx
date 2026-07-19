import EcosystemPage from '@/components/landing/EcosystemPage';
import { getEcosystem } from '@/lib/ecosystem';

export const metadata = {
  title: 'Junior Dev Tournaments — Intellex',
  description: 'Compete in Looping Binary Junior Dev tournaments and earn Intellex access and discounts.',
};

export default function JuniorDevPage() {
  const item = getEcosystem('junior-dev')!;
  return <EcosystemPage item={item} />;
}
