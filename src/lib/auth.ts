import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export type Role = "member" | "coach" | "admin";
export type Status = "pending" | "active" | "inactive";

export interface Profile {
  id: string;
  email: string;
  name: string | null;
  role: Role;
  status: Status;
}

// Call from Server Components / Server Actions to get the current user's profile.
// Redirects to /login if not authenticated or not active.
export async function requireActiveProfile(): Promise<Profile> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile || profile.status !== "active") redirect("/login");

  return profile as Profile;
}

// Use in coach/admin layouts to gate access.
export async function requireRole(
  allowedRoles: Role[]
): Promise<Profile> {
  const profile = await requireActiveProfile();
  if (!allowedRoles.includes(profile.role)) redirect("/idag");
  return profile;
}
