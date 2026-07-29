import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth/getUser';
import { getBook, purchaseBook } from '@/lib/learn/ecosystem';
import { hasActiveCertSubscription } from '@/lib/learn/certSubscription';

export const dynamic = 'force-dynamic';

/** POST /api/learn/books/[id]/purchase - add the book to the learner's shelf. */
export async function POST(_req: NextRequest, { params }: { params: { id: string } }) {
  const user = getSessionUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const book = await getBook(params.id);
  if (!book || !book.published) {
    return NextResponse.json({ error: 'not_found' }, { status: 404 });
  }

  // Paid books require InTelleX Student membership (included) unless already free path.
  if (book.priceXAF > 0) {
    const member = await hasActiveCertSubscription(user.uid);
    if (!member) {
      return NextResponse.json(
        {
          error: 'membership_required',
          href: '/membership',
          message: 'Become an InTelleX Student to unlock priced library books.',
        },
        { status: 402 },
      );
    }
  }

  try {
    await purchaseBook(user.uid, {
      ...book,
      // Members adding to shelf do not inflate paid sales.
      priceXAF: book.priceXAF > 0 ? 0 : book.priceXAF,
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('purchaseBook failed:', err);
    return NextResponse.json({ error: 'db_unavailable' }, { status: 503 });
  }
}
