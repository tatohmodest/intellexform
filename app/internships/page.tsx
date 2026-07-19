import EcosystemPage from '@/components/landing/EcosystemPage';
import { getEcosystem } from '@/lib/ecosystem';

export const metadata = {
  title: 'Internships — Looping Binary × Intellex',
  description: 'Looping Binary internship programs that turn Intellex skills into real work.',
};

export default function InternshipsPage() {
  const item = getEcosystem('internships')!;
  return <EcosystemPage item={item} />;
}
