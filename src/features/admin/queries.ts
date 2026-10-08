import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/lib/auth";

export async function getAllProfiles(): Promise<Profile[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("id, email, name, role, status")
    .order("status") // pending first
    .order("email");

  if (error) throw new Error(error.message);
  return (data ?? []) as Profile[];
}
