# InTelleX repositioning (November 2026)

> **One line:** Tutorials show you how. InTelleX makes sure you can.

## 1. Diagnosis: what is wrong today

The product is stronger than the story. The site lists everything InTelleX has (programmes, a 1,999 XAF library, AI tutor, tutorials, books, Junior Dev, internships, campuses, EduOS) and leaves the visitor to work out why any of it is worth paying for. A first-time visitor sees "another EdTech site" because the page is built like one: hero, feature cards, course grid, testimonials.

Five specific problems:

1. **We never answer the only question that matters.** "Why pay you when YouTube is free?" The current homepage never says it out loud, so the visitor answers it themselves, usually with "I'll just watch YouTube".
2. **Price looks arbitrary.** 1,999 XAF/month and 320,000 XAF sit on the same site with no explanation of why one is 160x the other. Without that explanation, the big number looks expensive instead of looking like a different product.
3. **The membership undercuts the programmes.** `lib/learn/studentMembership.ts` tells 1,999 XAF members they get "AI tutor & live learning … join live classes, and use mentorship tools". If live classes and mentorship are in the 1,999 XAF plan, the 320,000 XAF programme has no reason to exist. **Decision needed:** the membership must be clearly "learn on your own" (library, tutorials, books, AI tutor, completion certificates). Live teaching, reviews and mentorship belong to programmes only.
4. **"Learning Operating System for every discipline" is ahead of the evidence.** Every programme today is tech or digital marketing. Saying "technology, business, creative and more" before there are instructors and graduates in those directions makes InTelleX look like it does everything and masters nothing. Lead with *tech and digital careers*; add a direction only when it has a programme, an instructor and a first cohort. The OS story is right for institutions (EduOS), not for a learner deciding where to spend 300,000 XAF.
5. **We have no low-risk first step.** Preply converts because the first step is a single trial lesson. Maven reports that adding a "What's included" section, connected reviews and a satisfaction guarantee lifted conversion. Asking a Cameroonian student to commit 150,000 to 380,000 XAF from a web page, with no free class, no guarantee and no taste of the teaching, is asking a lot. See "Decisions for you" below.

## 2. Positioning

**Category:** a teaching school for tech and digital careers. Not a course library, not a tutor marketplace.

**The enemy is not other platforms. It is learning alone.** Free content is not the problem; we publish free tutorials too. The problem is that nobody decides what you learn next, nobody checks your work, nobody notices when you stop.

**What a learner actually buys (the "fresh lemonade"):**

| They think they are buying | What they are actually buying |
|---|---|
| A course | A path someone else has sequenced for them |
| Videos | A person who knows their name and checks their work |
| A certificate | Proof: projects that were reviewed and finished |
| Access | Accountability: a cohort, a schedule, someone who notices |

**Messaging rules**
- Say the uncomfortable thing first ("Why pay when YouTube is free?") and answer it honestly.
- Describe what happens, not what it means. "Your instructor leaves comments on your pull request" beats "personalised guidance".
- Every benefit must be something a learner could check after enrolling.
- No job guarantees, no invented numbers, no stock photos of people pretending to study.
- Say who InTelleX is *not* for. It is the fastest way to be believed about who it *is* for.

## 3. The offer ladder (priced by how much human attention you get)

| Level | Product | Price | What you get | What you don't get |
|---|---|---|---|---|
| Learn on your own | Library membership | 1,999 XAF/mo | Self-paced library, free tutorials, books, AI tutor, completion certificates | An instructor, reviews, a cohort |
| Learn with a teacher | Foundations programmes | 35,000–50,000 XAF, 4–6 weeks | Live beginner classes, materials, a first small project | Long mentorship, portfolio-level projects |
| Get trained | Career programmes | 150,000–380,000 XAF, 3–6 months, monthly from 50,000 | Live classes, mentorship, reviewed projects, portfolio, certificate on completion | A job guarantee |

The pricing page shows this as one ladder so the price gap becomes a support gap, not a markup. It is live at `/pricing`.

**Business model notes**
- Programmes are the business. The library is the top of the funnel; it should end every lesson with "want someone to check this? Foundations starts at 35,000 XAF".
- Foundations is the trial. Treat it as the paid equivalent of Preply's trial lesson, and give Foundations graduates a credit against a career programme (decision below).
- Too many programmes in Software (Full Stack, MERN, PERN, Django, Python, JavaScript, Flutter, React Native). A beginner cannot choose between MERN and PERN. Show 4 *directions* on the homepage and let `/programmes` hold the long list, or merge MERN/PERN into one "JavaScript full-stack" programme with a database choice.

## 4. The journey, page by page

| Stage | Page | Job | Status |
|---|---|---|---|
| Discover | `/` | Make the difference obvious in one scroll: the question, the week-by-week experience, what you leave with | **Rebuilt** |
| Understand | `/why-intellex` | The full case: what you get, how it works in practice, who it is not for | **New** |
| Compare | `/pricing` | The ladder, what your fee pays for, every programme price, payment options | **New** |
| Choose | `/programmes` | Directions first, then programmes; filter by level and duration | Next: add "Start here if you are a complete beginner" |
| Decide | `/programmes/[id]` | Add: "A week in this programme", the projects you will build, who teaches it, cohort start date, what the certificate requires | Next |
| Enrol | `/programmes/[id]/enrol` | Add a step that asks about goal + level + availability so the advisor call is already informed | Next |
| Learn | `/dashboard` | Lead with "this week": next live class, open review, project deadline | Already partly shipped (Today command center) |
| Finish | Certificate + portfolio | Public portfolio page per graduate, linked from the certificate | Next |
| Teach | `/dashboard/mentor` | "Apply to teach", not "list yourself". Instructors are hired, not discovered | Keep; never a public tutor directory |

## 5. Evidence we need to start documenting

We cannot be believed with claims. We can be believed with records. Start collecting now:

1. **Cohort log:** for every cohort, start/end date, learners enrolled, learners finished. Publish completion only once there are 3+ cohorts.
2. **Project gallery:** with permission, screenshot + link + one-line brief for every finished capstone. This is the strongest proof we can have.
3. **Review samples:** 5 real (anonymised) instructor review comments. "Here is what feedback looks like" sells better than "personalised feedback".
4. **Video testimonials with structure:** before (what they could do), during (one moment that helped), after (what they can do now). We already have three videos; ask the next ones these three questions.
5. **The Ireland story:** who, what programme, how it was delivered across time zones, a quote with consent. "We have trained learners in Ireland" with no story behind it reads as a claim.
6. **Instructor profiles:** real photo, what they have shipped or done professionally, what they teach. Not star ratings.
7. **Outcome notes:** freelance work, internships, jobs, promotions, with the learner's permission and the date. Never turned into a percentage until the sample is large.

## 6. Decisions for you

1. **Membership scope:** remove "live classes" and "mentorship" from the 1,999 XAF membership copy? (Recommended: yes.)
2. **First step:** pick one: a free 60-minute orientation class per direction each month, Foundations as a paid trial with its fee credited to a career programme, or a refund window ("leave in the first 2 weeks, get your fee back minus registration"). The site does not promise any of these until you choose.
3. **Directions:** confirm the homepage shows only tech and digital directions until business/creative programmes have an instructor and a cohort.
4. **Programme count:** merge or hide overlapping Software programmes (MERN/PERN, Flutter/React Native)?
5. **Onsite:** where is onsite learning available today, and for which programmes? The site says "where available, ask us" until we can name places.

## Sources consulted

- Maven landing page guidance and "What's Included" conversion note: https://maven.com/resources/whats-included-satisfaction-guarantee, https://help.maven.com/en/articles/5597113-overview-new-landing-page-builder
- Maven course design breakdown: https://drphilippahardman.substack.com/p/maven-a-masterclass-in-great-online
- Codecademy Plus vs Pro (skill paths vs career paths): https://help.codecademy.com/hc/en-us/articles/221084307-Codecademy-Pro-and-Plus
- Preply trial-lesson flow: https://preply.com/en/blog/what-is-preply, https://screensdesign.com/showcase/preply-language-learning-app
