# EduOS / Multi-Tenant LMS Architecture

> **Product definition:** Intellex is a SaaS platform for creating and operating fully branded, independent Learning Management Systems. Think Shopify — but for learning platforms.

> **Golden rule:** Nothing important in InTelleX is created by accident, accessed without permission, or managed without accountability.

## Vision

Intellex does **not** manually build an LMS for every customer.

1. Intellex admin creates an onboarding invitation.
2. The organization completes a multi-step LMS setup wizard.
3. Intellex automatically provisions their tenant, branding, subdomain, feature flags, and admin access.
4. The organization operates its own LMS on shared Intellex infrastructure.

One application + PostgreSQL + tenant isolation + feature flags + domain routing = many independent LMS platforms.

## Two layers

### Layer 1 — Intellex Platform (Core)

Owns network concerns:

- Organization registry & lifecycle
- Global identity & authentication
- Onboarding invitations
- Subscription / catalog plans
- Feature packs & module flags
- Tenant resolution (domain → organization)
- Database strategy metadata (never raw passwords in the app DB)
- Platform analytics & audit coordination
- Intellex Institution (first-class tenant operated by Intellex)

### Layer 2 — Organization tenants

Each organization owns its LMS surface:

- Public website, branding, courses, students, instructors
- Assignments, quizzes, certificates, analytics
- Domains / subdomains

Academic records are scoped by `organization_id` / `institutionId`. Cross-tenant access is forbidden except through explicit gateway flows.

## PostgreSQL tenancy (flexible)

Intellex is PostgreSQL-only for tenant data. Modes:

| Mode | Meaning |
|------|---------|
| `SHARED` | Default. Row isolation on Intellex-managed Postgres |
| `DEDICATED` | Intellex-managed dedicated Postgres for an organization |
| `CUSTOMER_MANAGED` | Enterprise BYO Postgres — configured only by Intellex Admin via secret references |

Application code asks “which database belongs to this organization?” via `lib/eduos/tenantDb.ts`. The frontend never receives credentials.

See also: `InstitutionFederationLink` (`databaseMode`, `schemaVersion`, `credentialRef`, health fields).

## Custom domains

- Every tenant gets an Intellex subdomain on provision (`{slug}.{platform}`).
- Organization admins connect custom domains from Settings → Domains.
- DNS CNAME instructions are shown; `Verify Domain` checks ownership then activates.
- Middleware resolves Host → campus gateway → organization.
- Guests on custom hosts land on `/site/{slug}` (public LMS website); signed-in users go to the campus dashboard.

## Phase 4 — Organization LMS data plane

Preferred tenant operations for people/courses/enrollments/progress use **Prisma** (`lib/orgLms`, `/api/org/[slug]/*`).

| Surface | Path |
|---------|------|
| Members / instructors | `/api/org/[slug]/members` |
| Courses / enrollments | `/api/org/[slug]/courses` |
| Learning tree + progress | `/api/org/[slug]/learning` |
| Learner player | `/dashboard/institutions/[slug]/learn/[courseId]` |
| Summary metrics | `/api/org/[slug]/summary` |
| Website builder API | `/api/org/[slug]/website` |
| Public website | `/site/[slug]` |
| Dedicated DB secrets | `lib/eduos/secretsDb.ts` (`env:`, `intellex-secret:`, `TENANT_DB_URLS`) |
| Learner dashboard merge | `lib/orgLms/learnerPlane.ts` → `getEnrollments` / `getProgress` |

Mongo `teacher_courses` remains available in Teaching Studio during migration. Catalogue enrollments may still use Mongo; org LMS enrollments/progress prefer Prisma.

## Hierarchy of authority

```
Platform Owner (exactly one)
  → Platform Administrators
    → Institution Owners
      → Institution Administrators (ORG_ADMIN)
        → Department Administrators
          → Instructors / Mentors / TAs
            → Students
              → Guests
```

Capabilities live in `lib/eduos/permissions.ts`.

## Nothing important is self-serve (platform-level)

| Action | Required flow |
|--------|----------------|
| Create organization tenant | Invite → wizard → auto-provision |
| Database strategy | Intellex Admin only |
| Become instructor | Application → institution approval |
| Become mentor | Application → review → verified |
| Join private campus | Invite / domain / enrollment code |
| Transfer ownership | Dual + platform approval |

## Phase 4 — Organization LMS (current)

Preferred tenant data plane for people/courses/enrollments is **Prisma** via `lib/orgLms` and `/api/org/[slug]/*`.

| Surface | Path |
|---------|------|
| Members / instructors | `/api/org/[slug]/members` |
| Courses / enrollments | `/api/org/[slug]/courses` |
| Learning tree | `/api/org/[slug]/learning` |
| Summary | `/api/org/[slug]/summary` |
| Campus UI | Students / Instructors / Courses tabs |
| Public website | `/site/[slug]` (custom domains → guests) |
| Dedicated DB secrets | `lib/eduos/secretsDb.ts` (`env:` / `intellex-secret:` / `TENANT_DB_URLS`) |

Mongo `teacher_courses` / campus docs remain for legacy teach studio during migration.


Subscription prices live in `CatalogPlan` (seeded). Student resource membership defaults to **1,999 XAF / month** — editable from Platform Admin, not hard-coded in checkout long-term (`lib/eduos/subscriptionCatalog.ts`, client fallback in `lib/learn/certPricing.ts`).

## Code map

| Concern | Location |
|---------|----------|
| Product & governance | `docs/EDUOS_ARCHITECTURE.md`, `lib/eduos/governance.ts` |
| Permissions | `lib/eduos/permissions.ts` |
| DB modes / connection manager | `lib/eduos/databaseModes.ts`, `lib/eduos/tenantDb.ts` |
| Tenant context | `lib/eduos/tenantContext.ts` |
| Domain DNS verify | `lib/eduos/domainDns.ts`, `lib/learn/institutionDomains.ts` |
| Onboarding invites | `lib/admin/onboardingInvites.ts`, `/onboard/[token]` |
| Catalog plans | `lib/eduos/subscriptionCatalog.ts` |
| Schema | `prisma/schema.prisma` |

## Resource test

Every object must answer:

1. Who owns it?
2. Who can see it?
3. Who can modify it?
4. Who approved its creation?

If any answer is missing, the feature is incomplete.
