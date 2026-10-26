-- Migration: fix_rls_recursion
-- The original policies checked the caller's role with
--   auth.uid() in (select id from profiles where ...)
-- Policies on `profiles` that query `profiles` recurse forever (Postgres error
-- 42P17), and every other table's policies hit the same loop because reading
-- `profiles` triggers its policies. Result: no logged-in user could read anything.
--
-- Fix: small helper functions marked `security definer`. They run as the
-- function owner, which bypasses RLS, so the role lookup can't loop.
-- They only ever answer questions about the *current* user (auth.uid()).
--
-- Also fixed here:
-- - Users could change their own role/status via the API (self-promotion).
--   A trigger now blocks that for everyone except admins.
-- - "active members see each other" exposed every member's email. Unused, removed.

-- ── Helper functions ──────────────────────────────────────────────────────────

create or replace function public.is_active()
returns boolean
language sql
stable
security definer set search_path = public
as $$
  select exists (
    select 1 from profiles
    where id = auth.uid() and status = 'active'
  );
$$;

create or replace function public.has_role(roles user_role[])
returns boolean
language sql
stable
security definer set search_path = public
as $$
  select exists (
    select 1 from profiles
    where id = auth.uid() and status = 'active' and role = any (roles)
  );
$$;

-- Only logged-in users need these; anonymous visitors get nothing.
revoke execute on function public.is_active() from public, anon;
revoke execute on function public.has_role(user_role[]) from public, anon;
grant execute on function public.is_active() to authenticated;
grant execute on function public.has_role(user_role[]) to authenticated;

-- ── profiles ──────────────────────────────────────────────────────────────────

drop policy "active members see each other" on profiles;
drop policy "admin full access" on profiles;

create policy "admin full access"
  on profiles for all
  using (has_role('{admin}'));

-- Block role/status changes unless the caller is an admin.
-- auth.uid() is null for the dashboard/SQL editor/service role, so those
-- (and the signup trigger, which only inserts) are still allowed.
create or replace function public.protect_profile_role_status()
returns trigger
language plpgsql
as $$
begin
  if (new.role is distinct from old.role or new.status is distinct from old.status)
     and auth.uid() is not null
     and not has_role('{admin}') then
    raise exception 'Only admins can change role or status';
  end if;
  return new;
end;
$$;

create trigger profiles_protect_role_status
  before update on profiles
  for each row execute procedure protect_profile_role_status();

-- ── techniques ────────────────────────────────────────────────────────────────

drop policy "active members read techniques" on techniques;
drop policy "coaches insert techniques" on techniques;
drop policy "coaches update own techniques" on techniques;
drop policy "coaches delete own techniques" on techniques;

create policy "active members read techniques"
  on techniques for select
  using (is_active());

create policy "coaches insert techniques"
  on techniques for insert
  with check (has_role('{coach,admin}'));

create policy "coaches update own techniques"
  on techniques for update
  using ((created_by = auth.uid() and has_role('{coach,admin}')) or has_role('{admin}'));

create policy "coaches delete own techniques"
  on techniques for delete
  using ((created_by = auth.uid() and has_role('{coach,admin}')) or has_role('{admin}'));

-- ── sessions ──────────────────────────────────────────────────────────────────

drop policy "members read published sessions" on sessions;
drop policy "coaches read all sessions" on sessions;
drop policy "coaches insert sessions" on sessions;
drop policy "coaches update own sessions" on sessions;
drop policy "coaches delete own sessions" on sessions;

create policy "members read published sessions"
  on sessions for select
  using (published = true and is_active());

create policy "coaches read all sessions"
  on sessions for select
  using (has_role('{coach,admin}'));

create policy "coaches insert sessions"
  on sessions for insert
  with check (has_role('{coach,admin}'));

create policy "coaches update own sessions"
  on sessions for update
  using ((created_by = auth.uid() and has_role('{coach,admin}')) or has_role('{admin}'));

create policy "coaches delete own sessions"
  on sessions for delete
  using ((created_by = auth.uid() and has_role('{coach,admin}')) or has_role('{admin}'));

-- ── session_techniques ────────────────────────────────────────────────────────

drop policy "members read published session techniques" on session_techniques;
drop policy "coaches read all session techniques" on session_techniques;
drop policy "coaches manage session techniques" on session_techniques;

create policy "members read published session techniques"
  on session_techniques for select
  using (
    is_active()
    and session_id in (select id from sessions where published = true)
  );

create policy "coaches read all session techniques"
  on session_techniques for select
  using (has_role('{coach,admin}'));

create policy "coaches manage session techniques"
  on session_techniques for all
  using (
    (has_role('{coach,admin}')
      and session_id in (select id from sessions where created_by = auth.uid()))
    or has_role('{admin}')
  );

-- ── strength ──────────────────────────────────────────────────────────────────

drop policy "active members read programs" on strength_programs;
drop policy "coaches manage programs" on strength_programs;
drop policy "active members read weeks" on strength_weeks;
drop policy "coaches manage weeks" on strength_weeks;

create policy "active members read programs"
  on strength_programs for select
  using (is_active());

create policy "coaches manage programs"
  on strength_programs for all
  using (has_role('{coach,admin}'));

create policy "active members read weeks"
  on strength_weeks for select
  using (is_active());

create policy "coaches manage weeks"
  on strength_weeks for all
  using (has_role('{coach,admin}'));
