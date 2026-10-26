-- Migration: public_member_content
-- Members no longer log in. Published content is readable by anyone with
-- the link (the `anon` role); only coaches/admins have accounts, and all
-- writes still require has_role(...) from 20261024000002.
--
-- - Techniques, published sessions (+ their videos) and S&C: public read.
-- - member_peak_start: dropped. The peak start date now lives in the
--   member's browser (localStorage), since members have no account.
-- - is_active(): dropped, nothing uses it any more.

-- ── techniques ────────────────────────────────────────────────────────────────

drop policy "active members read techniques" on techniques;

create policy "anyone reads techniques"
  on techniques for select
  to anon, authenticated
  using (true);

-- ── sessions ──────────────────────────────────────────────────────────────────
-- Drafts stay hidden: "coaches read all sessions" still covers those.

drop policy "members read published sessions" on sessions;

create policy "anyone reads published sessions"
  on sessions for select
  to anon, authenticated
  using (published = true);

drop policy "members read published session techniques" on session_techniques;

create policy "anyone reads published session techniques"
  on session_techniques for select
  to anon, authenticated
  using (session_id in (select id from sessions where published = true));

-- ── strength ──────────────────────────────────────────────────────────────────

drop policy "active members read programs" on strength_programs;
drop policy "active members read weeks" on strength_weeks;

create policy "anyone reads programs"
  on strength_programs for select
  to anon, authenticated
  using (true);

create policy "anyone reads weeks"
  on strength_weeks for select
  to anon, authenticated
  using (true);

drop table member_peak_start;

-- ── cleanup ───────────────────────────────────────────────────────────────────

drop function public.is_active();
