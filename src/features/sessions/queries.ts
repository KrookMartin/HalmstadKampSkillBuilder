import { createClient } from "@/lib/supabase/server";
import type { Technique } from "@/features/techniques/queries";

export type SessionWithTechniques = {
  id: string;
  session_date: string;
  time_slot: string;
  class_type: string;
  notes: string | null;
  published: boolean;
  created_by: string;
  techniques: (Technique & { position: number })[];
};

const SESSION_SELECT = `id, session_date, time_slot, class_type, notes, published, created_by,
   session_techniques (
     position,
     techniques (
       id, title, category, level, youtube_url, notes, created_by, created_at
     )
   )`;

// Flattens the nested join into an ordered technique list.
function toSession(s: {
  id: string;
  session_date: string;
  time_slot: string;
  class_type: string;
  notes: string | null;
  published: boolean;
  created_by: string;
  session_techniques: { position: number; techniques: unknown }[] | null;
}): SessionWithTechniques {
  return {
    id: s.id,
    session_date: s.session_date,
    time_slot: s.time_slot,
    class_type: s.class_type,
    notes: s.notes,
    published: s.published,
    created_by: s.created_by,
    techniques: (s.session_techniques ?? [])
      .sort((a, b) => a.position - b.position)
      .map((st) => ({
        ...(st.techniques as Technique),
        position: st.position,
      })),
  };
}

// Fetches all sessions for a given date (published only for members,
// all for coaches — RLS enforces this at the DB level).
export async function getSessionsForDate(
  date: string
): Promise<SessionWithTechniques[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("sessions")
    .select(SESSION_SELECT)
    .eq("session_date", date)
    .order("time_slot");

  if (error) throw new Error(error.message);
  return (data ?? []).map(toSession);
}

// Fetches the sessions in a date range (inclusive), e.g. one week, in
// display order. Members only get published ones (RLS).
export async function getSessionsInRange(
  from: string,
  to: string
): Promise<SessionWithTechniques[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("sessions")
    .select(SESSION_SELECT)
    .gte("session_date", from)
    .lte("session_date", to)
    .order("session_date")
    .order("time_slot");

  if (error) throw new Error(error.message);
  return (data ?? []).map(toSession);
}

// Just the dates of all sessions, for the "Hoppa till månad" list.
// One small column per row, so this stays cheap as the archive grows.
export async function getSessionDates(): Promise<string[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("sessions").select("session_date");

  if (error) throw new Error(error.message);
  return (data ?? []).map((r) => r.session_date);
}

export async function getSessionById(
  id: string
): Promise<SessionWithTechniques | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("sessions")
    .select(SESSION_SELECT)
    .eq("id", id)
    .maybeSingle();
  return data ? toSession(data) : null;
}
