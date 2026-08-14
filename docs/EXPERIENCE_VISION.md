# Intellex Experience Vision

> **North star:** When a student opens Intellex they should think *“Intellex knows what I need to do next.”* When an instructor opens it they should think *“Intellex has organized my teaching day.”*

This document is the product philosophy for the world-class student & instructor experience. Implementation lands in phases; the first slices are already in the product.

## Product philosophy

Intellex is not a traditional LMS card grid. It combines:

- university student portal
- modern learning platform
- academic workspace
- career surface
- personal productivity
- learning community
- instructor teaching workspace

Every major screen answers: **What can the user do next?**

## Shipped

### Slice 1 — Today command center
### Slice 2 — Player, messaging, career, grading
### Slice 3 — Notifications, discussions, career polish, player/AI, grading & early-warning

See prior tables in git history for full Slice 1–3 surface maps.

### Slice 4 — Player excellence, academic overview, versioning, mobile

| Surface | Path | Behavior |
|---------|------|----------|
| Captions | HTML5 players | Optional VTT `captionsUrl` on lessons; Course Studio field |
| In-lesson quizzes | player Quiz tab | Checkpoint quiz; gates Mark complete until passed |
| Academic overview | `/dashboard/academic` | Program/cohort/GPA/credits + journey links + soft prefs |
| Content versioning | Course / Assessment studios | Snapshot on publish; restore as draft |
| Mobile More sheet | `MobileBottomNav` | Messages, Academic, Portfolio, Teaching, Settings |
| PWA | `manifest.ts` | `start_url: /dashboard`, flexible orientation |

Data engines added: `lessonQuizzes.ts`, `academicOverview.ts`, `contentRevisions.ts`.

## Roadmap (later)

1. ~~Course player excellence — captions, in-lesson quizzes~~ (Drive iframe seek still limited)
2. ~~Inbox / messaging~~
3. ~~Notifications categories~~
4. ~~Study groups & course discussions~~
5. ~~Academic overview & journey~~ (official transcript sync when campus enables)
6. ~~Skills profile & goals~~
7. ~~Career / opportunities / portfolio~~
8. ~~Grading center UX / rapid-grade~~
9. ~~Student monitoring & early warning~~
10. ~~AI assistant in-course~~
11. ~~Content builder + versioning~~ (Prisma org course revisions next)
12. ~~Mobile-native flows~~ (deeper offline / teach mobile later)

## Feature flags

Tenant configuration (org modules / feature flags) should gate Community, Career, Mentorship, Live, Analytics, etc. Core Academic + Learn remain on for every learner.

## Design principle

Every statistic leads to an action:

```
18 Assignments pending → [View Assignments]
7 Students falling behind → [View Students]
82% Course progress → [Continue Learning]
```
