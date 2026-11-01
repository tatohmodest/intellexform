# AGENTS.md

## Cursor Cloud specific instructions

### What this is
Single Next.js 14 (App Router, TypeScript) app - "Intellex" / InTelleX (LoopingBinary education platform). Surfaces include a landing page (`/`), a course catalogue/checkout, a learner dashboard (`/dashboard/*`, behind LoopingBinary OAuth), self-paced tutorials, campus / institution portals, and a password/OTP-protected admin dashboard (`/admin`) backed by `/api/admin/*`. Standard scripts live in `package.json` (`dev`, `build`, `start`, `lint`, `db:*`).

The public `/register` wizard (`components/landing/JoinWizard.tsx`) submits to `POST /api/requests` and persists to the PostgreSQL-backed `requests` collection (NOT `/api/register`). A separate `POST /api/register` route also exists and writes to the PostgreSQL-backed `registrations` collection; both show up in the admin dashboard.

### Required runtime dependencies (non-obvious)
- **PostgreSQL is required for application data.** Set `DATABASE_URL` and `DIRECT_URL` to the same PostgreSQL project; Prisma stores relational EduOS data and app documents in that database. Apply schema changes with `npm run db:push`.
- **`ADMIN_SECRET` is required for admin auth routes** (`lib/adminAuth.ts` throws if unset).
- **SMTP env vars** (`SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `EMAIL_FROM`) are required to email admin OTP codes.
- These env vars are provided via an untracked `.env.local` (gitignored, loaded by Next with priority over the committed `.env`). The committed `.env` may not contain `DATABASE_URL`, `DIRECT_URL`, or `ADMIN_SECRET`, so recreate `.env.local` if it is missing:
  ```
  DATABASE_URL="postgresql://..."
  DIRECT_URL="postgresql://..."
  ADMIN_SECRET="<output of: openssl rand -hex 32>"
  SESSION_SECRET="<output of: openssl rand -hex 32>"
  ```
- Signing secrets (`SESSION_SECRET`, `ADMIN_SECRET`) must be at least 24 characters and not a placeholder. `lib/auth/cookies.ts` ignores values like `[SENSITIVE]` (what `vercel env pull` writes for sensitive variables) or anything containing `change-me`, because a public signing secret lets anyone forge a session.

### Admin login
Open `/admin`. Authorized emails (default: `modestwilton@gmail.com`, `tatohmodest@gmail.com`, plus optional `ADMIN_EMAILS`) can:
1. Request a 6-digit OTP emailed via SMTP, or
2. Skip OTP if already signed in to InTelleX with that same allowlisted email (Looping Binary OAuth session).

OTP codes live in the PostgreSQL-backed `admin_otps` collection.

### PostgreSQL / Prisma
- `npm run build` runs `prisma generate` first. The same PostgreSQL database stores relational EduOS data and application collections in the `app_documents` JSONB table.
- Account credentials and learner data are stored in PostgreSQL. MongoDB is not used by the app.

### Notes
- App serves on port 3000 (`npm run dev`).
- The README is outdated relative to the full product surface.
- PayUnit, Agora, Cloudinary, and OpenAI are optional; without them checkout may use a mock page, live video needs an Agora app id, media uploads need Cloudinary, and the AI tutor falls back to static answers.
- **Video Hall search** uses the YouTube Data API v3 (`YOUTUBE_API_KEY`). Without it, search reports unconfigured and still lets learners paste a YouTube URL. The key is a Cloud Agent environment secret, not something to put in git.
- **Book tutor** (`/dashboard/library/learn`) parses PDF/EPUB/DOCX in memory (no tokens) and discards the original file. PostgreSQL stores only the compact lesson path (not the PDF). Pipeline: reconstruct chapters (drop TOC/front matter) → analyzer → curriculum architect → typed tutor steps (introduction/explanation/example/practice). Text PDFs up to ~4,000 pages / 80 MB; scanned image PDFs will fail. Set `OPENAI_API_KEY` for richer lessons and grading. Default model: `OPENAI_MODEL=gpt-4o-mini`.
- There is no automated test suite; verify changes via `npm run lint`, `npm run build`, and the `/register` → `/admin` flow (learner flows also need credentials auth + `SESSION_SECRET`).
