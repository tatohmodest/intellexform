import { redirect } from 'next/navigation';

/** Legacy /register enrollment form → Contact (signup is the account path). */
export default function RegisterRedirectPage({
  searchParams,
}: {
  searchParams?: { type?: string };
}) {
  const type = searchParams?.type;
  redirect(type ? `/contact?type=${encodeURIComponent(type)}` : '/contact');
}
