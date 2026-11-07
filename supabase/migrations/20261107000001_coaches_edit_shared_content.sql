-- Migration: coaches_edit_shared_content
-- The technique archive and the passes are shared by all coaches: any active
-- coach may edit or delete any technique or pass, not just their own.
-- Previously only the creator (or an admin) could. Inserts and reads are
-- unchanged. created_by is still set, so we know who added what.

-- ── techniques ────────────────────────────────────────────────────────────────

drop policy "coaches update own techniques" on techniques;
drop policy "coaches delete own techniques" on techniques;

create policy "coaches update techniques"
  on techniques for update
  using (has_role('{coach,admin}'))
  with check (has_role('{coach,admin}'));

create policy "coaches delete techniques"
  on techniques for delete
  using (has_role('{coach,admin}'));

-- ── sessions ──────────────────────────────────────────────────────────────────

drop policy "coaches update own sessions" on sessions;
drop policy "coaches delete own sessions" on sessions;

create policy "coaches update sessions"
  on sessions for update
  using (has_role('{coach,admin}'))
  with check (has_role('{coach,admin}'));

create policy "coaches delete sessions"
  on sessions for delete
  using (has_role('{coach,admin}'));

-- ── session_techniques ────────────────────────────────────────────────────────
-- The ordered video list belongs to the pass, so it follows the same rule.

drop policy "coaches manage session techniques" on session_techniques;

create policy "coaches manage session techniques"
  on session_techniques for all
  using (has_role('{coach,admin}'))
  with check (has_role('{coach,admin}'));
