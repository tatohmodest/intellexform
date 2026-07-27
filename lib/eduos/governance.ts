/**
 * InTelleX EduOS - governance constants & golden rule.
 *
 * Golden rule: Nothing important in InTelleX is created by accident,
 * accessed without permission, or managed without accountability.
 * Every institution, role, resource, and action has a clear owner,
 * a defined approval process, and auditable permissions.
 */

export const GOLDEN_RULE =
  'Nothing important in InTelleX is created by accident, accessed without permission, or managed without accountability. Every institution, role, resource, and action has a clear owner, a defined approval process, and auditable permissions.';

/** Authority hierarchy (high → low). Each level inherits only what it needs. */
export const AUTHORITY_HIERARCHY = [
  'PLATFORM_OWNER',
  'PLATFORM_ADMIN',
  'INSTITUTION_OWNER',
  'ORG_ADMIN',
  'DEPARTMENT_ADMIN',
  'INSTRUCTOR',
  'MENTOR',
  'TEACHING_ASSISTANT',
  'STUDENT',
  'GUEST',
] as const;

export type AuthorityLevel = (typeof AUTHORITY_HIERARCHY)[number];

/** Four questions every object must answer. */
export const RESOURCE_GOVERNANCE_QUESTIONS = [
  'Who owns it?',
  'Who can see it?',
  'Who can modify it?',
  'Who approved its creation?',
] as const;

export function answersGovernanceQuestions(meta: {
  ownerId?: string | null;
  viewers?: string[];
  editors?: string[];
  approvedById?: string | null;
}): boolean {
  return Boolean(meta.ownerId && meta.approvedById);
}
