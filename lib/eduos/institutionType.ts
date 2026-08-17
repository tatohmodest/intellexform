import type { InstitutionType } from '@prisma/client';

export const INSTITUTION_TYPE_OPTIONS: { value: InstitutionType; label: string }[] = [
  { value: 'UNIVERSITY', label: 'University' },
  { value: 'SCHOOL', label: 'School' },
  { value: 'ACADEMY', label: 'Academy' },
  { value: 'BOOTCAMP', label: 'Bootcamp / Training center' },
  { value: 'COMPANY', label: 'Company / Corporate training' },
  { value: 'NGO', label: 'NGO' },
  { value: 'GOVERNMENT', label: 'Government organization' },
  { value: 'OTHER', label: 'Other / Professional institution' },
];

const VALID = new Set<string>(INSTITUTION_TYPE_OPTIONS.map((o) => o.value));

/**
 * Map UI labels / free-text invite types onto Prisma InstitutionType.
 * Accepts enum values (ACADEMY) or human labels ("Academy", "Training Center").
 */
export function normalizeInstitutionType(
  raw: string | null | undefined,
): InstitutionType | null {
  if (!raw) return null;
  const trimmed = raw.trim();
  if (!trimmed) return null;

  const upper = trimmed.toUpperCase().replace(/[\s-]+/g, '_');
  if (VALID.has(upper)) return upper as InstitutionType;

  const key = trimmed.toLowerCase().replace(/[_-]+/g, ' ').replace(/\s+/g, ' ').trim();

  const aliases: Record<string, InstitutionType> = {
    university: 'UNIVERSITY',
    school: 'SCHOOL',
    academy: 'ACADEMY',
    bootcamp: 'BOOTCAMP',
    'training center': 'BOOTCAMP',
    'training centre': 'BOOTCAMP',
    company: 'COMPANY',
    'corporate training': 'COMPANY',
    corporate: 'COMPANY',
    ngo: 'NGO',
    government: 'GOVERNMENT',
    'government organization': 'GOVERNMENT',
    'government organisation': 'GOVERNMENT',
    'professional institution': 'OTHER',
    other: 'OTHER',
  };

  if (aliases[key]) return aliases[key];

  // Partial contains (e.g. "Private Academy")
  if (key.includes('universit')) return 'UNIVERSITY';
  if (key.includes('school')) return 'SCHOOL';
  if (key.includes('academ')) return 'ACADEMY';
  if (key.includes('bootcamp') || key.includes('training')) return 'BOOTCAMP';
  if (key.includes('compan') || key.includes('corporate')) return 'COMPANY';
  if (key.includes('ngo') || key.includes('non profit') || key.includes('nonprofit')) return 'NGO';
  if (key.includes('govern')) return 'GOVERNMENT';

  return 'OTHER';
}
