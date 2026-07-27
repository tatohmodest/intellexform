# InTelleX EduOS — Governance & Federated Architecture

> **Golden rule:** Nothing important in InTelleX is created by accident, accessed without permission, or managed without accountability. Every institution, role, resource, and action has a clear owner, a defined approval process, and auditable permissions.

InTelleX is **education infrastructure** — an Education Cloud / Education Operating System. Institutions **connect to the network**; they do not dump all academic data into one giant multi-tenant sack.

## Two layers

### Layer 1 — InTelleX Core

Owns only what belongs to the network:

- Institution registry, status, verification badges
- Global identity & authentication
- Applications & approval queues
- Platform permissions & subscriptions
- API credentials & gateway
- Global search index, AI routing, marketplace
- Audit coordination

**Academic records do not live here.**

### Layer 2 — Institution infrastructure

Each campus owns:

- Teachers, students, departments, courses
- Grades, attendance, exams
- Finance, research, internal announcements

Deployment options (provisioned by Platform Owner / Admin — never by end users):

| Model | Meaning |
|-------|---------|
| Shared SaaS | Row isolation on managed Postgres |
| Managed Cloud | Dedicated DB/storage provisioned by InTelleX |
| Customer-Hosted | Institution infra + secure API link |
| Hybrid | Mix of both |
| External SIS | Connect existing SIS via gateway |

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

Capabilities are defined in `lib/eduos/permissions.ts`. Roles are collections of permissions.

## Nothing important is self-serve

| Action | Required flow |
|--------|----------------|
| Create institution | Application → Platform review → Provisioning |
| Become instructor | Application → Institution admin approval |
| Become mentor | Application → Review → Verified badge + tier |
| Join private campus | Invite / domain / enrollment code |
| Transfer ownership | Dual + platform approval |
| Delete courses / remove staff / billing | Sensitive confirmation (password / 2FA / dual) |

## Institution isolation

An admin of Institution A must never view or mutate Institution B’s students, courses, analytics, or private announcements. Cross-institution needs go through the **API gateway** as verification requests — never direct database access.

## AI inherits permissions

If a caller lacks `view_analytics` for a department, the AI must refuse. The model never escalates.

## Code map

| Concern | Location |
|---------|----------|
| Golden rule & hierarchy | `lib/eduos/governance.ts` |
| Permission catalog | `lib/eduos/permissions.ts` |
| Federation layers | `lib/eduos/federation.ts` |
| Audit writer | `lib/eduos/audit.ts` |
| Schema | `prisma/schema.prisma` |

## Resource test

Every object must answer:

1. Who owns it?
2. Who can see it?
3. Who can modify it?
4. Who approved its creation?

If any answer is missing, the feature is incomplete.
