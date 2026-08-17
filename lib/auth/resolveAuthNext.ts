import { getCampusBrand } from '@/lib/campus/brand';
import { enterCampusContext } from '@/lib/campus/session';

/**
 * After a successful password login, bind campus context when requested and
 * pick the dashboard path the learner should land on.
 */
export async function resolveAuthNext(opts: {
  userId: string;
  userName: string;
  userEmail: string;
  defaultNext: string;
  requestedNext?: string;
  campusSlug?: string;
}): Promise<string> {
  let nextPath = opts.defaultNext;
  const requested = String(opts.requestedNext || '').trim();
  const campusSlug = String(opts.campusSlug || '')
    .trim()
    .toLowerCase()
    .slice(0, 64);
  const needsOnboarding =
    nextPath === '/dashboard/onboarding' || nextPath.startsWith('/dashboard/onboarding?');

  if (campusSlug) {
    try {
      const brand = await getCampusBrand(campusSlug);
      if (brand) {
        const entry = await enterCampusContext({
          userId: opts.userId,
          userName: opts.userName,
          userEmail: opts.userEmail,
          slug: campusSlug,
          allowJoin: brand.studentRegistration === 'public',
        });

        const campusHome = entry?.portalHref || brand.portalHref;
        const adminHome = entry?.adminHref || brand.adminHref;
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

  return nextPath;
}
