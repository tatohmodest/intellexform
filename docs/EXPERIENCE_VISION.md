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

| Surface | Path | Behavior |
|---------|------|----------|
| Student Today command center | `/dashboard` | Greeting, focus count, Attention required, Today timeline with actions, Continue learning, weekly progress, assignment snapshot, recommended |
| Assignment center | `/dashboard/assignments` | Buckets: due today / overdue / this week / upcoming / submitted / graded |
| My Learning | `/dashboard/my-learning` | Currently / upcoming / completed / recommended |
| Academic calendar | `/dashboard/calendar` | Day / week / month views |
| Tasks | `/dashboard/todos` | Academic todos + personal CRUD tasks (`/api/learn/tasks`) |
| Teaching home | `/dashboard/teach` | Instructor Today + Attention required + Needs grading |
| Navigation | `DashboardShell` | Grouped: Home → Learn → Academic → Community → Career → Personal (+ Teaching) |

### Slice 2 — Player, messaging, career, grading

| Surface | Path | Behavior |
|---------|------|----------|
| Drive course player | `/dashboard/drive-player/[slug]` | Mark complete → progress API, resume incomplete lesson, study notes + resources rail |
| Org course player | learn player | Notes / resources / discussion rail |
| Lesson study notes | `/api/learn/lesson-notes` | Per-lesson personal notes |
| Messages inbox | `/dashboard/messages` | 1:1 threads, send/receive, notification on new message |
| Message student | My Students / Monitoring | Starts thread with course context |
| Portfolio | `/dashboard/portfolio` | Skills, in-progress, certificates from learning activity |
| Opportunities | `/dashboard/opportunities` | Career opportunities board |
| Grading center | `/dashboard/teach/grading` | Queue of assignments needing grades |
| Student monitoring | `/dashboard/teach/monitoring` | Inactive / at-risk signals + contact |

### Slice 3 — Notifications, discussions, career polish, player/AI, grading & early-warning

| Surface | Path | Behavior |
|---------|------|----------|
| Categorized notifications | `/dashboard/notifications` | Filters: academic / social / institution / system; mute categories in Settings |
| Study groups | `/dashboard/study-groups` | Create/join groups |
| Lesson discussions | player rail | Upvote, pin (instructors), official answers |
| Skills & goals editor | `/dashboard/portfolio` | Editable bio/skills/goals + public share toggle |
| Public portfolio | `/p/[slug]` | Shareable career profile |
| Certificate verify | `/verify/cert/[id]` | Validate completion certificates |
| Video timestamp resume | progress API `positionSec` | HTML5 players seek to last position; notes link timestamp |
| Rapid grade | `/dashboard/teach/grading` | Keyboard queue (j/k/Enter) + studio Enter-to-save |
| Early-warning | monitoring | High/medium/low: inactivity, missing assignments, low progress |
| In-course AI | player AI tab | Context-aware tutor for current lesson |

Data engines: `commandCenter.ts`, `messaging.ts`, `lessonNotes.ts`, `portfolio.ts`, `studentMonitoring.ts`, `discussions.ts`, `notifications.ts`.

## Roadmap (next slices)

1. Course player excellence — captions, in-lesson quizzes, Drive seek when API allows
2. ~~Inbox / messaging~~
3. ~~Notifications categories~~
4. ~~Study groups & course discussions~~
5. Academic overview & journey — program/cohort/GPA/credits when org enables
6. ~~Skills profile & goals~~
7. ~~Career / opportunities / portfolio~~ (+ public share / verify)
8. ~~Grading center UX / rapid-grade~~
9. ~~Student monitoring & early warning~~
10. ~~AI assistant in-course~~
11. Content builder + versioning — professional authoring
12. Mobile-native flows — not compressed desktop

## Feature flags

Tenant configuration (org modules / feature flags) should gate Community, Career, Mentorship, Live, Analytics, etc. Core Academic + Learn remain on for every learner.

## Design principle

Every statistic leads to an action:

```
18 Assignments pending → [View Assignments]
7 Students falling behind → [View Students]
82% Course progress → [Continue Learning]
```
