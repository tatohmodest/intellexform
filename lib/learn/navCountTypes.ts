export const NAV_BADGE_HREFS = [
  '/dashboard/notifications',
  '/dashboard/messages',
  '/dashboard/announcements',
  '/dashboard/community',
  '/dashboard/study-groups',
  '/dashboard/calendar',
  '/dashboard/assignments',
  '/dashboard/todos',
  '/dashboard/library',
  '/dashboard/notes',
  '/dashboard/opportunities',
  '/dashboard/fees',
] as const;

export type NavBadgeHref = (typeof NAV_BADGE_HREFS)[number];
export type NavCounts = Record<NavBadgeHref, number>;

export const NAV_SEEN_HREFS = [
  '/dashboard/announcements',
  '/dashboard/community',
  '/dashboard/library',
  '/dashboard/notes',
  '/dashboard/opportunities',
] as const;

export type NavSeenHref = (typeof NAV_SEEN_HREFS)[number];

export const ZERO_NAV_COUNTS: NavCounts = {
  '/dashboard/notifications': 0,
  '/dashboard/messages': 0,
  '/dashboard/announcements': 0,
  '/dashboard/community': 0,
  '/dashboard/study-groups': 0,
  '/dashboard/calendar': 0,
  '/dashboard/assignments': 0,
  '/dashboard/todos': 0,
  '/dashboard/library': 0,
  '/dashboard/notes': 0,
  '/dashboard/opportunities': 0,
  '/dashboard/fees': 0,
};

export function isNavBadgeHref(href: string): href is NavBadgeHref {
  return (NAV_BADGE_HREFS as readonly string[]).includes(href);
}

export function isNavSeenHref(href: string): href is NavSeenHref {
  return (NAV_SEEN_HREFS as readonly string[]).includes(href);
}
