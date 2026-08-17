import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

/** OTP login/signup was replaced by email verification links + password sign-in. */
export async function POST() {
  return NextResponse.json(
    {
      error: 'Use the verification link in your email, then sign in with your password.',
    },
    { status: 410 },
  );
}
