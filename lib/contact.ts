import { buildWhatsappLink, WHATSAPP_NUMBER } from '@/lib/whatsapp';

/** Public Platform Team contact (WhatsApp + email). */
export const PLATFORM_CONTACT = {
  email: 'intellexplatform@gmail.com',
  emailAlt: 'loopingbinary@gmail.com',
  phoneDisplay: '+237 650 318 856',
  whatsappNumber: WHATSAPP_NUMBER,
  whatsappInstitutionMessage:
    'Hello InTelleX Platform Team — we want to register our institution on the InTelleX network. Please share how the platform works and how integration / onboarding works.',
  whatsappOrientationMessage:
    'Hello InTelleX! I am a student and I would like an orientation on which learning path to follow. Please help me choose.',
  whatsappGeneralMessage:
    'Hello InTelleX! I have a question about the platform.',
  whatsappIntegrationMessage:
    'Hello InTelleX Platform Team — our organization wants to understand how InTelleX works and how we can integrate (campus, LMS, SSO, or capabilities). Please share next steps.',
} as const;

export function institutionWhatsappLink(): string {
  return buildWhatsappLink(PLATFORM_CONTACT.whatsappInstitutionMessage);
}

export function orientationWhatsappLink(): string {
  return buildWhatsappLink(PLATFORM_CONTACT.whatsappOrientationMessage);
}

export function integrationWhatsappLink(): string {
  return buildWhatsappLink(PLATFORM_CONTACT.whatsappIntegrationMessage);
}

export function generalWhatsappLink(message = PLATFORM_CONTACT.whatsappGeneralMessage): string {
  return buildWhatsappLink(message);
}

export function institutionMailto(subject = 'Register our institution on InTelleX'): string {
  return `mailto:${PLATFORM_CONTACT.email}?subject=${encodeURIComponent(subject)}`;
}

export function orientationMailto(): string {
  return `mailto:${PLATFORM_CONTACT.email}?subject=${encodeURIComponent('Student path orientation')}`;
}

export function integrationMailto(): string {
  return `mailto:${PLATFORM_CONTACT.email}?subject=${encodeURIComponent('Organization / platform integration')}`;
}

export function platformMailto(subject = 'Question about InTelleX'): string {
  return `mailto:${PLATFORM_CONTACT.email}?subject=${encodeURIComponent(subject)}`;
}
