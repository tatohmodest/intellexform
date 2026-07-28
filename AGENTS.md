# AGENTS.md

## Cursor Cloud specific instructions

### What this is
<<<<<<< HEAD
Single Next.js 14 (App Router, TypeScript) app - the "Intellex Early Access Platform". It has a landing page (`/`), a registration form (`/register`) that persists to MongoDB via `POST /api/register`, and an email-OTP admin dashboard (`/admin`) backed by `/api/admin/*` routes. Standard scripts live in `package.json` (`dev`, `build`, `start`, `lint`).
=======
Single Next.js 14 (App Router, TypeScript) app — "Intellex" (LoopingBinary education platform). Surfaces include a landing page (`/`), a course catalogue/checkout, a learner dashboard (`/dashboard/*`, behind LoopingBinary OAuth), self-paced tutorials, and a password-protected admin dashboard (`/admin`) backed by `/api/admin/*`. Standard scripts live in `package.json` (`dev`, `build`, `start`, `lint`, `db:*`).

The public `/register` wizard (`components/landing/JoinWizard.tsx`) submits to `POST /api/requests` and persists to the MongoDB `requests` collection (NOT `/api/register`). A separate `POST /api/register` route also exists and writes to the `registrations` collection; both show up in the admin dashboard.
>>>>>>> origin/cursor/setup-dev-environment-17e5

### Required runtime dependencies (non-obvious)
- **MongoDB is required to run the app at all.** `lib/mongodb.ts` throws at import time if `MONGODB_URL` is unset, so any API route (and the admin/register pages) will 500 without a reachable MongoDB. A local `mongod` is installed; start it (it is not managed by systemd here) with:
  `mongod --dbpath /var/lib/mongodb --bind_ip 127.0.0.1 --port 27017`
- **`ADMIN_SECRET` is required for admin auth routes** (`lib/adminAuth.ts` throws if unset).
- **SMTP env vars** (`SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `EMAIL_FROM`) are required to email admin OTP codes.
- These env vars are provided via an untracked `.env.local` (gitignored, loaded by Next with priority over the committed `.env`). The committed `.env` only has unused Supabase keys and does NOT contain `MONGODB_URL`/`ADMIN_SECRET`, so recreate `.env.local` if it is missing:
  ```
  MONGODB_URL="mongodb://127.0.0.1:27017"
  ADMIN_SECRET="dev-local-admin-secret-change-me"
  ```

### Admin login
Open `/admin`. Authorized emails (default: `modestwilton@gmail.com`, `tatohmodest@gmail.com`, plus optional `ADMIN_EMAILS`) can:
1. Request a 6-digit OTP emailed via Resend SMTP, or
2. Skip OTP if already signed in to InTelleX with that same allowlisted email (Looping Binary OAuth session).

Password login is disabled. DB name is `intellex`; OTP codes live in `admin_otps`.

### Prisma / Postgres (optional)
- `npm run build` runs `prisma generate` first; the generated client is also imported by `/api/eduos/health`. The update script runs `npx prisma generate` so the client exists for `next dev` too.
- Postgres/Supabase (`DATABASE_URL`, `DIRECT_URL`) is only used by `/api/eduos/health` and the `db:seed`/`db:push` scripts — it is NOT required to run the app or the main MongoDB-backed flows. Skip it unless testing the EduOS schema.

### Notes
<<<<<<< HEAD
- App serves on port 3000 (`npm run dev`).
- The README is outdated: it claims "no server required", but the app in fact needs MongoDB + API routes.
- `SUPABASE_*` env vars in `.env` are dead config - not referenced anywhere.
- There is no automated test suite; verify changes via `npm run lint`, `npm run build`, and the `/register` → `/admin` flow.
=======
- App serves on port 3000 (`npm run dev`). `mongod` is a separate service and is not started by the update script — start it as shown above before running the app.
- The README is outdated: it describes an older registration-only app; the real app is much larger and needs MongoDB + API routes.
- Many env vars in `.env.example` (Supabase, NextAuth, Google/GitHub, Cloudinary, SMTP) are dead config today. PayUnit, Agora, and OpenAI are optional; without them checkout uses a mock page, live video needs an Agora app id, and the AI tutor falls back to static answers.
- There is no automated test suite; verify changes via `npm run lint`, `npm run build`, and the `/register` → `/admin` flow (learner flows also need LoopingBinary OAuth + `SESSION_SECRET`).
>>>>>>> origin/cursor/setup-dev-environment-17e5
