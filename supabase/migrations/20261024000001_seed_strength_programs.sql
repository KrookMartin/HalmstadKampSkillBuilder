-- Migration: seed_strength_programs
-- The app expects exactly one 'base' and one 'peak' program to exist.
-- Coaches can only edit weeks in the UI, not create programs, so the rows
-- are created here. Week content is written by coaches in /traning/styrka.
--
-- total_weeks defaults to 8 for both; change it with a new migration or SQL.
-- `on conflict do nothing` keeps this safe if the rows already exist.

insert into strength_programs (type, title, description, total_weeks)
values
  ('base', 'Grundprogram', 'Styrka och kondition för alla medlemmar. Loopar om när sista veckan är klar.', 8),
  ('peak', 'Toppning inför tävling', 'Valbart program inför tävling. Välj startdatum så visas rätt vecka.', 8)
on conflict (type) do nothing;
