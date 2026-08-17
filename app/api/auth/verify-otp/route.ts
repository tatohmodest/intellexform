import { NextRequest, NextResponse } from 'next/server';
import { verifyLoginOtp, verifySignupOtp, type AuthOtpPurpose } from '@/lib/auth/credentials';
import { SESSION_COOKIE, sessionCookieOptions } from '@/lib/auth/session';
import { getCampusBrand } from '@/lib/campus/brand';
import { joinInstitution } from '@/lib/learn/ecosystem';
import { upsertAffiliation } from '@/lib/learn/repo';
import { prisma } from '@/lib/db/prisma';

export const dynamic = 'force-dynamic';

/**
 * POST /api/auth/verify-otp
 * Body: { email, code, purpose, next?, campus? }
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

  // Attach learner to campus when signing up/in from a campus-branded auth page.
  if (campusSlug) {
    try {
      const brand = await getCampusBrand(campusSlug);
      if (brand) {
        if (brand.enrollmentOpen) {
          await joinInstitution(campusSlug, result.user.uid, result.user.name).catch(() => {});
          await upsertAffiliation(result.user.uid, {
            institutionSlug: campusSlug,
            institutionName: brand.platformName,
            role: 'student',
            status: 'verified',
            profileComplete: false,
            joinedAt: new Date(),
            verifiedAt: new Date(),
          }).catch(() => {});

          const inst = await prisma.institution.findUnique({
            where: { slug: campusSlug },
            select: { id: true },
          });
          if (inst) {
            await prisma.institutionMembership
              .upsert({
                where: {
                  institutionId_userId: {
                    institutionId: inst.id,
                    userId: result.user.uid,
                  },
                },
                create: {
                  institutionId: inst.id,
                  userId: result.user.uid,
                  role: 'STUDENT',
                  isActive: true,
                },
                update: { isActive: true },
              })
              .catch(() => {});
          }
        }

        if (!requested || requested === '/dashboard') {
          if (nextPath !== '/dashboard/onboarding') {
            nextPath = brand.portalHref;
          } else {
            nextPath = `/dashboard/onboarding?next=${encodeURIComponent(brand.portalHref)}`;
          }
        }
      }
    } catch (err) {
      console.error('campus attach on auth failed:', err);
    }
  }

  if (requested.startsWith('/') && !requested.startsWith('//') && nextPath !== '/dashboard/onboarding') {
    nextPath = requested;
  } else if (
    requested.startsWith('/') &&
    !requested.startsWith('//') &&
    (nextPath === '/dashboard/onboarding' || nextPath.startsWith('/dashboard/onboarding?'))
  ) {
    nextPath = `/dashboard/onboarding?next=${encodeURIComponent(requested)}`;
  }

  const res = NextResponse.json({
    ok: true,
    next: nextPath,
    user: result.user,
  });
  res.cookies.set(SESSION_COOKIE, result.session, sessionCookieOptions());
  return res;
}
