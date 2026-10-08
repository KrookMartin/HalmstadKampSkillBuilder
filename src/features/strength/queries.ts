import { createClient } from "@/lib/supabase/server";

export type StrengthProgram = {
  id: string;
  type: "base" | "peak";
  title: string;
  description: string | null;
  total_weeks: number;
};

export type StrengthWeek = {
  id: string;
  program_id: string;
  week_number: number;
  title: string;
  content: string;
};

export async function getProgram(
  type: "base" | "peak"
): Promise<StrengthProgram | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("strength_programs")
    .select("*")
    .eq("type", type)
    .single();
  return data ?? null;
}

export async function getProgramWeeks(
  programId: string
): Promise<StrengthWeek[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("strength_weeks")
    .select("*")
    .eq("program_id", programId)
    .order("week_number");
  if (error) throw new Error(error.message);
  return data ?? [];
}

// Returns the date the member chose to start the peak program, or null.
export async function getMemberPeakStart(
  memberId: string
): Promise<string | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("member_peak_start")
    .select("started_at")
    .eq("member_id", memberId)
    .single();
  return data?.started_at ?? null;
}
