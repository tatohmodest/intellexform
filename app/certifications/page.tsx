import EcosystemPage from '@/components/landing/EcosystemPage';
import { getEcosystem } from '@/lib/ecosystem';

export const metadata = {
  title: 'Certifications — Intellex',
  description: 'Earn a certificate of completion for every Intellex course you finish.',
};

export default function CertificationsPage() {
  const item = getEcosystem('certifications')!;
  return <EcosystemPage item={item} />;
}
