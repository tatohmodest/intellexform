/**
 * Domain notes for the EduOS data model
 *
 * Books vs media recommendations
 * - Book: tutor/instructor authored digital books with optional XAF price.
 * - MediaRecommendation: platform-curated YouTube/external learning links
 *   matched to a learner's fieldOfInterest. Not a tutor storefront.
 *
 * Multi-tenancy
 * - Institution is the campus/tenant boundary.
 * - User is a global identity; InstitutionMembership attaches roles per campus.
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
