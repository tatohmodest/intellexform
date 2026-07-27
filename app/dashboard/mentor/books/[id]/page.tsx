import { notFound, redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/auth/getUser';
import { getBook } from '@/lib/learn/ecosystem';
import BookEditor from '@/components/dashboard/BookEditor';

export const dynamic = 'force-dynamic';

export default async function BookEditorPage({ params }: { params: { id: string } }) {
  const session = getSessionUser();
  if (!session) redirect('/login?next=/dashboard/mentor');

  const book = await getBook(params.id);
  if (!book) notFound();
  if (book.authorId !== session.uid) redirect('/dashboard/mentor');

  return <BookEditor book={book} />;
}
