# Halmstad Kampsport – club app

A mobile-first PWA for a martial arts club (BJJ, wrestling, MMA, ~300 members).
The UI is in Swedish; code and docs are in English.

- **Teknikarkiv** – coaches save techniques with a YouTube link, category and level.
- **Passbyggare** – coaches build a session (pass) from the archive and publish it.
- **Idag** – members see today's published sessions with videos in the coach's order.
- **Styrka** – a looping base S&C program for everyone, plus an optional peak
  program before competitions.

Conventions, scope and domain rules live in [CLAUDE.md](CLAUDE.md); the visual
design in [DESIGN.md](DESIGN.md). Read both before changing things.

## Stack

Next.js (App Router, TypeScript strict) · Supabase (Postgres, Auth, Row Level
Security) · Tailwind CSS · Vitest · hosted on Vercel.

## How access works

- **Members don't log in.** Techniques, published sessions and S&C programs are
  readable by anyone with the link (the `anon` role in RLS). The site is `noindex`.
- **Coaches and admins** log in with email + password. There is no self sign-up
  and the app sends no email. (An early migration still mentions "magic link" in
  a comment; that's history; migrations are never edited.)
- Permissions are enforced by RLS in the database, using `has_role(...)`. Server
  Actions check the role as well, but RLS is what actually protects the data.
- The **peak program start date** is stored in the member's browser
  (`localStorage`). It's lost if they clear site data or switch phone, and they
  simply pick the date again. No member data is stored on the server.

## Setup

Requires Node.js 22+.

1. Install dependencies:
   ```sh
   npm install
   ```
2. Create a project at [supabase.com](https://supabase.com). Under
   **Authentication → Sign In / Providers**, turn off *Allow new users to sign up*.
3. Copy the env file and fill in the values from **Settings → API Keys**
   (project URL and the *publishable* key):
   ```sh
   cp .env.example .env.local
   ```
   Never commit `.env.local`. No secret/service-role key is needed.
4. Link the project and apply the migrations:
   ```sh
   npx supabase login
   npx supabase link --project-ref <your-project-ref>
   npm run db:push
   ```
   With Docker installed you can instead run a local database with
   `npm run db:start` and `npm run db:reset` (re-creates it from the migrations).
5. Start the app on http://localhost:3000:
   ```sh
   npm run dev
   ```

### Creating the first admin

1. In the Supabase dashboard: **Authentication → Users → Add user**, enter email
   and password, tick **Auto Confirm User**. A profile with status `pending` is
   created automatically.
2. In the **SQL Editor**, make that user an active admin:
   ```sql
   update profiles set role = 'admin', status = 'active'
   where email = 'you@example.com';
   ```
   This is allowed because the `protect_profile_role_status` trigger only blocks
   logged-in non-admins, and in the SQL editor there is no logged-in user
   (`auth.uid()` is null).

After that, new coaches are added the same way (step 1), then activated and
given a role in the app under **/admin/konton**.

## Scripts

| Script | What it does |
|---|---|
| `npm run dev` | Dev server |
| `npm run build` / `start` | Production build / run it |
| `npm test` | Vitest, once (`test:watch` to keep running) |
| `npm run typecheck` | TypeScript check, no output files |
| `npm run lint` | ESLint |
| `npm run db:push` | Apply new migrations to the linked Supabase project |
| `npm run db:types` | Regenerate `src/lib/supabase/types.ts` from the linked project |
| `npm run db:start` / `db:stop` / `db:reset` | Local Supabase (needs Docker) |

## Changing the database

All schema changes go in a **new** file in `supabase/migrations/`, never in the
dashboard and never by editing an old migration. Then:

```sh
npm run db:push    # apply it
npm run db:types   # regenerate the TypeScript types
```

`db:types` reads the linked (hosted) project, so push the migration first.
Because production builds from `main`, push a migration before merging code that
depends on it. Keep migrations additive so the live code keeps working meanwhile.

## Deployment

Vercel builds production from `main` and a preview for every other branch.
The Vercel project needs two environment variables, the same as `.env.local`:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` (the publishable key)

Test a branch on its preview URL (on a phone) before merging it.
