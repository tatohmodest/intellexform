import EcosystemPage from '@/components/landing/EcosystemPage';
import { getEcosystem } from '@/lib/ecosystem';

export const metadata = {
  title: 'Amazon Books — Intellex',
  description: 'Free Amazon book picks to start, plus more when you subscribe with Intellex.',
};

export default function BooksPage() {
  const item = getEcosystem('books')!;
  return <EcosystemPage item={item} />;
}
