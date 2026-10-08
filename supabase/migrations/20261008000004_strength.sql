-- Migration: strength
-- S&C program structure.
--
-- programs: one row per program type ('base' or 'peak').
-- weeks: each program has 1-N weeks of content.
-- member_peak_start: records when a member chose to start the peak program.
--   Only one active row per member (no end date — the 8-week window is
--   computed in application code, not stored).

create type program_type as enum ('base', 'peak');

create table strength_programs (
  id          uuid primary key default gen_random_uuid(),
  type        program_type not null unique,
  title       text         not null,
  description text,
  total_weeks integer      not null check (total_weeks between 1 and 12),
  updated_at  timestamptz  not null default now()
);

create trigger strength_programs_updated_at
  before update on strength_programs
  for each row execute procedure set_updated_at();

create table strength_weeks (
  id          uuid primary key default gen_random_uuid(),
  program_id  uuid    not null references strength_programs(id) on delete cascade,
  week_number integer not null check (week_number >= 1),
  title       text    not null,
  content     text    not null, -- markdown / plain text written by the coach
  unique (program_id, week_number)
);

create index on strength_weeks (program_id, week_number);

-- Tracks when an active member chose to start the peak program.
-- Upsert on (member_id) so a member can restart by picking a new date.
create table member_peak_start (
  member_id   uuid primary key references profiles(id) on delete cascade,
  started_at  date not null default current_date
);

-- ── Row Level Security ────────────────────────────────────────────────────────

alter table strength_programs enable row level security;
alter table strength_weeks     enable row level security;
alter table member_peak_start  enable row level security;

-- All active members can read program metadata and week content.
create policy "active members read programs"
  on strength_programs for select
  using (
    auth.uid() in (select id from profiles where status = 'active')
  );

create policy "active members read weeks"
  on strength_weeks for select
  using (
    auth.uid() in (select id from profiles where status = 'active')
  );

-- Coaches and admins can create/update/delete program content.
create policy "coaches manage programs"
  on strength_programs for all
  using (
    auth.uid() in (
      select id from profiles
      where role in ('coach', 'admin') and status = 'active'
    )
  );

create policy "coaches manage weeks"
  on strength_weeks for all
  using (
    auth.uid() in (
      select id from profiles
      where role in ('coach', 'admin') and status = 'active'
    )
  );

-- Members manage only their own peak start date.
create policy "member owns peak start"
  on member_peak_start for all
  using (auth.uid() = member_id)
  with check (auth.uid() = member_id);
