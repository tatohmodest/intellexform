import { cookies, headers } from 'next/headers';
import { detectLocale, LOCALE_COOKIE, type Locale } from '@/lib/i18n/locale';

export function getRequestLocale(): Locale {
  return detectLocale({
    cookie: cookies().get(LOCALE_COOKIE)?.value,
    acceptLanguage: headers().get('accept-language'),
  });
}
