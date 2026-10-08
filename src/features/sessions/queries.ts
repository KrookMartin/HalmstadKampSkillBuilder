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

// Fetches all sessions for a given date (published only for members,
// all for coaches — RLS enforces this at the DB level).
export async function getSessionsForDate(
  date: string
): Promise<SessionWithTechniques[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("sessions")
    .select(
      `id, session_date, time_slot, class_type, notes, published, created_by,
       session_techniques (
         position,
         techniques (
           id, title, category, level, youtube_url, notes, created_by, created_at
         )
       )`
    )
    .eq("session_date", date)
    .order("time_slot");

  if (error) throw new Error(error.message);

  return (data ?? []).map((s) => ({
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
        ...(st.techniques as unknown as Technique),
        position: st.position,
      })),
  }));
}

// Fetches all sessions for the coach list view (ordered newest first).
export async function getAllSessions(): Promise<
  Omit<SessionWithTechniques, "techniques">[]
> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("sessions")
    .select(
      "id, session_date, time_slot, class_type, notes, published, created_by"
    )
    .order("session_date", { ascending: false })
    .order("time_slot");

  if (error) throw new Error(error.message);
  return data ?? [];
}
