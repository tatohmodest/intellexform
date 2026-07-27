# AGENTS.md

## Cursor Cloud specific instructions

### What this is
Single Next.js 14 (App Router, TypeScript) app - the "Intellex Early Access Platform". It has a landing page (`/`), a registration form (`/register`) that persists to MongoDB via `POST /api/register`, and an email-OTP admin dashboard (`/admin`) backed by `/api/admin/*` routes. Standard scripts live in `package.json` (`dev`, `build`, `start`, `lint`).

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

### Notes
- App serves on port 3000 (`npm run dev`).
- The README is outdated: it claims "no server required", but the app in fact needs MongoDB + API routes.
- `SUPABASE_*` env vars in `.env` are dead config - not referenced anywhere.
- There is no automated test suite; verify changes via `npm run lint`, `npm run build`, and the `/register` → `/admin` flow.
