import { NextRequest, NextResponse } from 'next/server';
import { verifyLoginOtp, verifySignupOtp, type AuthOtpPurpose } from '@/lib/auth/credentials';
import { SESSION_COOKIE, sessionCookieOptions } from '@/lib/auth/session';
import { getCampusBrand } from '@/lib/campus/brand';
import { enterCampusContext } from '@/lib/campus/session';

export const dynamic = 'force-dynamic';

/**
 * POST /api/auth/verify-otp
 * Body: { email, code, purpose, next?, campus? }
 *
 * Campus login/signup always binds activeContext to that institution and
 * redirects to the institution dashboard (unless first-time onboarding).
 */
export async function POST(req: NextRequest) {
  let body: {
    email?: string;
    code?: string;
    purpose?: string;
    next?: string;
    campus?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  const purpose = (body.purpose === 'signup' ? 'signup' : 'login') as AuthOtpPurpose;
  const email = String(body.email || '');
  const code = String(body.code || '');
  const campusSlug = String(body.campus || '')
    .trim()
    .toLowerCase()
    .slice(0, 64);

  const result =
    purpose === 'signup'
      ? await verifySignupOtp({ email, code })
      : await verifyLoginOtp({ email, code });

  if ('error' in result) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  let nextPath = result.nextPath;
  const requested = String(body.next || '').trim();
  const needsOnboarding =
    nextPath === '/dashboard/onboarding' || nextPath.startsWith('/dashboard/onboarding?');

  if (campusSlug) {
    try {
      const brand = await getCampusBrand(campusSlug);
      if (brand) {
        const entry = await enterCampusContext({
          userId: result.user.uid,
          userName: result.user.name,
          userEmail: result.user.email || email,
          slug: campusSlug,
          // Public / code campuses: join on signup (and login if not yet a member).
          allowJoin: brand.enrollmentOpen,
        });

        const campusHome = entry?.portalHref || brand.portalHref;
        const adminHome = entry?.adminHref || brand.adminHref;

        // Prefer explicit next when it stays on this campus (or onboarding).
        const requestedIsCampus =
          requested.startsWith(`/dashboard/institutions/${campusSlug}`) ||
          requested.startsWith(`/site/${campusSlug}`);

        if (needsOnboarding) {
          const after = requestedIsCampus
            ? requested
            : entry?.isStaff && requested.includes('/admin')
              ? adminHome
              : campusHome;
          nextPath = `/dashboard/onboarding?next=${encodeURIComponent(after)}`;
        } else if (requestedIsCampus) {
          nextPath = requested;
        } else if (entry?.isStaff && requested.includes('/admin')) {
          nextPath = adminHome;
        } else {
          // Default: institution student/admin dashboard for this campus.
          nextPath = campusHome;
        }
      }
    } catch (err) {
      console.error('campus attach on auth failed:', err);
    }
  } else if (requested.startsWith('/') && !requested.startsWith('//')) {
    if (needsOnboarding) {
      nextPath = `/dashboard/onboarding?next=${encodeURIComponent(requested)}`;
    } else {
      nextPath = requested;
    }
  }

  const res = NextResponse.json({
    ok: true,
    next: nextPath,
    user: result.user,
  });
  res.cookies.set(SESSION_COOKIE, result.session, sessionCookieOptions());
  return res;
}
