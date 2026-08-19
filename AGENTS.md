# AGENTS.md

## Cursor Cloud specific instructions

### What this is
Single Next.js 14 (App Router, TypeScript) app - "Intellex" / InTelleX (LoopingBinary education platform). Surfaces include a landing page (`/`), a course catalogue/checkout, a learner dashboard (`/dashboard/*`, behind LoopingBinary OAuth), self-paced tutorials, campus / institution portals, and a password/OTP-protected admin dashboard (`/admin`) backed by `/api/admin/*`. Standard scripts live in `package.json` (`dev`, `build`, `start`, `lint`, `db:*`).

The public `/register` wizard (`components/landing/JoinWizard.tsx`) submits to `POST /api/requests` and persists to the MongoDB `requests` collection (NOT `/api/register`). A separate `POST /api/register` route also exists and writes to the `registrations` collection; both show up in the admin dashboard.

### Required runtime dependencies (non-obvious)
- **MongoDB is required to run the app at all.** `lib/mongodb.ts` throws at import time if `MONGODB_URL` is unset, so any API route (and the admin/register pages) will 500 without a reachable MongoDB. A local `mongod` is installed; start it (it is not managed by systemd here) with:
  `mongod --dbpath /var/lib/mongodb --bind_ip 127.0.0.1 --port 27017`
- **`ADMIN_SECRET` is required for admin auth routes** (`lib/adminAuth.ts` throws if unset).
- **SMTP env vars** (`SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `EMAIL_FROM`) are required to email admin OTP codes.
- These env vars are provided via an untracked `.env.local` (gitignored, loaded by Next with priority over the committed `.env`). The committed `.env` may not contain `MONGODB_URL`/`ADMIN_SECRET`, so recreate `.env.local` if it is missing:
  ```
  MONGODB_URL="mongodb://127.0.0.1:27017"
  ADMIN_SECRET="dev-local-admin-secret-change-me"
  ```

### Admin login
Open `/admin`. Authorized emails (default: `modestwilton@gmail.com`, `tatohmodest@gmail.com`, plus optional `ADMIN_EMAILS`) can:
1. Request a 6-digit OTP emailed via SMTP, or
2. Skip OTP if already signed in to InTelleX with that same allowlisted email (Looping Binary OAuth session).

DB name is `intellex`; OTP codes live in `admin_otps`.

### Prisma / Postgres (optional)
- `npm run build` runs `prisma generate` first; the generated client is also imported by `/api/eduos/health` and platform admin flows.
- Postgres/Supabase (`DATABASE_URL`, `DIRECT_URL`) backs EduOS / Platform Admin institution records. Skip it unless testing those flows; most learner catalogue data still lives in MongoDB.

### Notes
- App serves on port 3000 (`npm run dev`). `mongod` is a separate service and is not started by the update script - start it as shown above before running the app.
- The README is outdated relative to the full product surface.
- PayUnit, Agora, Cloudinary, and Gemini (or OpenAI) are optional; without them checkout may use a mock page, live video needs an Agora app id, media uploads need Cloudinary, and the AI tutor falls back to static answers.
- **Video Hall search** uses the YouTube Data API v3 (`YOUTUBE_API_KEY`). Without it, search reports unconfigured and still lets learners paste a YouTube URL. The key is a Cloud Agent environment secret, not something to put in git.
- **Book tutor** (`/dashboard/library/learn`) parses PDF/EPUB/DOCX in memory (no tokens) and discards the original file. Mongo stores only the compact lesson path (not the PDF). Text PDFs up to ~4,000 pages / 80 MB; scanned image PDFs will fail. Set `GEMINI_API_KEY` (preferred) or `OPENAI_API_KEY` for richer lessons and grading. Default model: `GEMINI_MODEL=gemini-2.5-flash`.
- There is no automated test suite; verify changes via `npm run lint`, `npm run build`, and the `/register` → `/admin` flow (learner flows also need credentials auth + `SESSION_SECRET`).
