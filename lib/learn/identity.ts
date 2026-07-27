/**
 * InTelleX identity architecture
 *
 * Identity is global. Permissions are contextual. Data is local.
 *
 * Users belong to InTelleX — not to universities.
 * Institutions are affiliations on one passport, like GitHub orgs.
 * Institutions are never self-created — Platform Team onboards them.
 */

export type PrimaryIntent = 'learn' | 'teach';
/** exploring kept as alias of intellex for legacy docs. */
export type JoinPath = 'intellex' | 'institution' | 'both' | 'exploring';

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
  emergencyContact?: string | null;
  photoUrl?: string | null;
  /** Campus-required profile extras finished after first verify. */
  profileComplete?: boolean;
  verifiedAt?: Date | string | null;
  joinedAt: Date | string;
}

/**
 * UI context — switching contexts never creates a new account.
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

/** Who can see institution-published learning content. */
export type ContentVisibility = 'private' | 'network' | 'public';

export const PERSONAL_CONTEXT: ActiveContext = { kind: 'personal', institutionSlug: null };

export function normalizeJoinPath(path: JoinPath | null | undefined): JoinPath | null {
  if (!path) return null;
  if (path === 'exploring') return 'intellex';
  return path;
}

export function isOnboardingComplete(learner: {
  onboardingComplete?: boolean;
} | null | undefined): boolean {
  if (!learner) return false;
  if (learner.onboardingComplete === false) return false;
  return true;
}

export type CampusBrand = {
  slug: string;
  name: string;
  color: string;
  logoUrl?: string | null;
  tagline?: string;
};
