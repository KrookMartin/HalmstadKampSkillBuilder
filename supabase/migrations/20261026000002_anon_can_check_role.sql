-- Migration: anon_can_check_role
-- Postgres evaluates every policy on a table, so anonymous reads also run
-- the coach policies, which call has_role(). Without execute permission that
-- fails with 42501 instead of just evaluating to false.
--
-- Safe to grant: has_role() only looks at auth.uid(), which is null for
-- anonymous visitors, so it always returns false for them.

grant execute on function public.has_role(user_role[]) to anon;
