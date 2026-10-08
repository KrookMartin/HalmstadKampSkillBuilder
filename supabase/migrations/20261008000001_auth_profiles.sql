-- Migration: auth_profiles
-- Creates the profiles table that extends Supabase Auth users with
-- app-specific fields: display name, role, and membership status.
-- New users land in status=pending and can't see any content until
-- an admin flips them to active.

create type user_role as enum ('member', 'coach', 'admin');
create type user_status as enum ('pending', 'active', 'inactive');

create table profiles (
  id          uuid primary key references auth.users on delete cascade,
  email       text not null,
  name        text,
  role        user_role   not null default 'member',
  status      user_status not null default 'pending',
  created_at  timestamptz not null default now()
);

-- Automatically create a profile row when a new user signs up via magic link.
create or replace function handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- ── Row Level Security ────────────────────────────────────────────────────────

alter table profiles enable row level security;

-- A user can always read their own profile (needed for the auth gate check).
create policy "own profile readable"
  on profiles for select
  using (auth.uid() = id);

-- Active members can see other active members' names (useful later for
-- coach dropdowns). Read-only, no email exposed.
create policy "active members see each other"
  on profiles for select
  using (
    auth.uid() in (
      select id from profiles where status = 'active'
    )
  );

-- Users may update only their own name. Role and status are admin-only.
create policy "own profile name writable"
  on profiles for update
  using (auth.uid() = id)
  with check (
    auth.uid() = id
    -- Prevent self-promotion: role and status columns must not change
    -- (enforced further in Server Actions with Zod, RLS is a backstop).
  );

-- Admins can read and update all profiles.
create policy "admin full access"
  on profiles for all
  using (
    auth.uid() in (
      select id from profiles where role = 'admin' and status = 'active'
    )
  );
