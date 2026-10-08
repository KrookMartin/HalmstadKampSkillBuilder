-- Migration: techniques
-- The technique archive. Coaches create entries with a YouTube link,
-- a category, and a difficulty level. Members browse read-only.

create type technique_category as enum (
  'guards',
  'passing',
  'takedowns',
  'upper_body_submissions',
  'lower_body_submissions',
  'sweeps'
);

create type technique_level as enum ('beginner', 'intermediate', 'advanced');

create table techniques (
  id           uuid primary key default gen_random_uuid(),
  title        text not null,
  category     technique_category not null,
  level        technique_level    not null,
  youtube_url  text not null,
  notes        text,
  created_by   uuid not null references profiles(id),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- Keep updated_at current automatically.
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger techniques_updated_at
  before update on techniques
  for each row execute procedure set_updated_at();

-- ── Row Level Security ────────────────────────────────────────────────────────

alter table techniques enable row level security;

-- All active members can read all techniques.
create policy "active members read techniques"
  on techniques for select
  using (
    auth.uid() in (
      select id from profiles where status = 'active'
    )
  );

-- Coaches and admins can insert.
create policy "coaches insert techniques"
  on techniques for insert
  with check (
    auth.uid() in (
      select id from profiles
      where role in ('coach', 'admin') and status = 'active'
    )
  );

-- Coaches can update their own techniques; admins can update any.
create policy "coaches update own techniques"
  on techniques for update
  using (
    created_by = auth.uid()
    or auth.uid() in (
      select id from profiles where role = 'admin' and status = 'active'
    )
  );

-- Same rule for delete.
create policy "coaches delete own techniques"
  on techniques for delete
  using (
    created_by = auth.uid()
    or auth.uid() in (
      select id from profiles where role = 'admin' and status = 'active'
    )
  );
