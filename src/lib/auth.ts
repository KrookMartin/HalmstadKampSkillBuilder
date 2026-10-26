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

// Only coaches/admins have accounts; members use the app without logging in.

// The logged-in user's profile, or null for anonymous visitors. No redirects,
// so public pages can use it to decide whether to show coach links.
export async function getProfile(): Promise<Profile | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();
  return (profile as Profile | null) ?? null;
}

// For coach/admin pages and Server Actions.
// Redirects to /login if not authenticated, /vantar if not yet activated.
export async function requireActiveProfile(): Promise<Profile> {
  const profile = await getProfile();

  if (!profile) redirect("/login");
  if (profile.status === "pending") redirect("/vantar");
  if (profile.status === "inactive") redirect("/login");

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
