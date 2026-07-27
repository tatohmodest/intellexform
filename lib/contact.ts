import { buildWhatsappLink, WHATSAPP_NUMBER } from '@/lib/whatsapp';

/** Public contact for curated institution onboarding (never self-serve create). */
export const PLATFORM_CONTACT = {
  email: 'intellex@loopingbinary.com',
  emailAlt: 'tatohmodest@gmail.com',
  phoneDisplay: '+237 650 318 856',
  whatsappNumber: WHATSAPP_NUMBER,
  whatsappInstitutionMessage:
    'Hello InTelleX Platform Team — we want to register our institution on the InTelleX network. Please share the onboarding process.',
} as const;

export function institutionWhatsappLink(): string {
  return buildWhatsappLink(PLATFORM_CONTACT.whatsappInstitutionMessage);
}

export function institutionMailto(subject = 'Register our institution on InTelleX'): string {
  return `mailto:${PLATFORM_CONTACT.email}?subject=${encodeURIComponent(subject)}`;
}
