/**
 * InTelleX identity architecture
 *
 * Identity is global. Permissions are contextual. Data is local.
 *
 * Users belong to InTelleX — not to universities.
 * Institutions are affiliations on one passport, like GitHub orgs.
 */

export type PrimaryIntent = 'learn' | 'teach' | 'institution';
export type JoinPath = 'exploring' | 'institution' | 'both';

/** Role within a specific institution affiliation (not the global account). */
export type AffiliationRole =
  | 'student'
  | 'instructor'
  | 'mentor'
  | 'admin'
  | 'owner'
  | 'member';

export type AffiliationStatus = 'pending' | 'verified';

export interface Affiliation {
  institutionSlug: string;
  institutionName: string;
  role: AffiliationRole;
  status: AffiliationStatus;
  /** External campus id (e.g. matricule) — never a password. */
  externalStudentId?: string | null;
  department?: string | null;
  faculty?: string | null;
  program?: string | null;
  year?: string | null;
  verifiedAt?: Date | string | null;
  joinedAt: Date | string;
}

/**
 * UI context — switching contexts never creates a new account.
 * personal  = learner's InTelleX home
 * intellex  = InTelleX academy flavour of the same home
 * institution = campus workspace
 * teaching / mentorship = role workspaces
 */
export type ContextKind =
  | 'personal'
  | 'intellex'
  | 'institution'
  | 'teaching'
  | 'mentorship';

export interface ActiveContext {
  kind: ContextKind;
  institutionSlug?: string | null;
}

export type InstitutionAuthMethod =
  | 'open'
  | 'matricule'
  | 'enrollment_code'
  | 'google'
  | 'microsoft'
  | 'sso'
  | 'ldap';

export const PERSONAL_CONTEXT: ActiveContext = { kind: 'personal', institutionSlug: null };

export function isOnboardingComplete(learner: {
  onboardingComplete?: boolean;
} | null | undefined): boolean {
  if (!learner) return false;
  // Explicit false = first-run still open. Missing field = legacy account (skip trap).
  if (learner.onboardingComplete === false) return false;
  return true;
}
