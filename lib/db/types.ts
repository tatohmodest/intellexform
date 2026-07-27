/**
 * Domain notes for the EduOS data model
 *
 * Golden rule - see lib/eduos/governance.ts and docs/EDUOS_ARCHITECTURE.md
 *
 * Books vs media recommendations
 * - Book: tutor/instructor authored digital books with optional XAF price.
 * - MediaRecommendation: platform-curated YouTube/external learning links
 *   matched to a learner's fieldOfInterest. Not a tutor storefront.
 *
 * Federated multi-tenancy
 * - Layer 1 (Core): identity, institution registry, applications, API gateway.
 * - Layer 2 (Institution): academic records owned by each campus.
 * - User is a global identity; InstitutionMembership attaches roles per campus.
 * - Institutions are never self-created - application → review → provision.
 * - Switching campuses is modeled by User.currentInstitutionId.
 */

export type LearnerField =
  | "programming"
  | "ai"
  | "cybersecurity"
  | "ui-ux"
  | "graphics"
  | "video-editing"
  | "digital-marketing"
  | "cloud"
  | "linux"
  | "data-analysis"
  | "business"
  | "soft-skills"
  | "languages"
  | "mathematics"
  | "science";

export const PLATFORM_HOME_SLUG = "intellex" as const;
export const BRAND_PRIMARY = "#00B369" as const;
export { GOLDEN_RULE } from "@/lib/eduos/governance";
