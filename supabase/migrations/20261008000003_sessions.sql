-- Migration: sessions
-- A "pass" (session) has a date, a time slot string, a class type label,
-- optional coach notes, and a published flag. Multiple sessions can exist
-- on the same day (e.g. morning BJJ + evening wrestling).
--
-- session_techniques is the ordered list of techniques in a session.
-- position drives the display order; coaches can reorder freely.

create table sessions (
  id           uuid primary key default gen_random_uuid(),
  session_date date        not null,
  time_slot    text        not null, -- e.g. "18:00"
  class_type   text        not null, -- e.g. "BJJ Avancerat"
  notes        text,
  published    boolean     not null default false,
  created_by   uuid        not null references profiles(id),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create trigger sessions_updated_at
  before update on sessions
  for each row execute procedure set_updated_at();

create table session_techniques (
  id           uuid primary key default gen_random_uuid(),
  session_id   uuid not null references sessions(id) on delete cascade,
  technique_id uuid not null references techniques(id) on delete cascade,
  position     integer not null,
  unique (session_id, position)
);

create index on session_techniques (session_id, position);

-- ── Row Level Security ────────────────────────────────────────────────────────

alter table sessions enable row level security;
alter table session_techniques enable row level security;

-- Members see only published sessions.
create policy "members read published sessions"
  on sessions for select
  using (
    published = true
    and auth.uid() in (
      select id from profiles where status = 'active'
    )
  );

-- Coaches can see all sessions (including drafts) to edit them.
create policy "coaches read all sessions"
  on sessions for select
  using (
    auth.uid() in (
      select id from profiles
      where role in ('coach', 'admin') and status = 'active'
    )
  );

create policy "coaches insert sessions"
  on sessions for insert
  with check (
    auth.uid() in (
      select id from profiles
      where role in ('coach', 'admin') and status = 'active'
    )
  );

create policy "coaches update own sessions"
  on sessions for update
  using (
    created_by = auth.uid()
    or auth.uid() in (
      select id from profiles where role = 'admin' and status = 'active'
    )
  );

create policy "coaches delete own sessions"
  on sessions for delete
  using (
    created_by = auth.uid()
    or auth.uid() in (
      select id from profiles where role = 'admin' and status = 'active'
    )
  );

-- session_techniques mirrors the session's visibility.
create policy "members read published session techniques"
  on session_techniques for select
  using (
    session_id in (
      select id from sessions where published = true
    )
    and auth.uid() in (
      select id from profiles where status = 'active'
    )
  );

create policy "coaches read all session techniques"
  on session_techniques for select
  using (
    auth.uid() in (
      select id from profiles
      where role in ('coach', 'admin') and status = 'active'
    )
  );

create policy "coaches manage session techniques"
  on session_techniques for all
  using (
    session_id in (
      select id from sessions
      where created_by = auth.uid()
    )
    or auth.uid() in (
      select id from profiles where role = 'admin' and status = 'active'
    )
  );
