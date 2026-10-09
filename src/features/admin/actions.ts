"use server";

import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth";
import { z } from "zod";
import { revalidatePath } from "next/cache";

const updateProfileSchema = z.object({
  memberId: z.string().uuid(),
  status: z.enum(["pending", "active", "inactive"]).optional(),
  role: z.enum(["member", "coach", "admin"]).optional(),
});

export type AdminResult =
  | { success: true }
  | { success: false; error: string };

export async function updateMemberStatus(
  memberId: string,
  status: "pending" | "active" | "inactive"
): Promise<AdminResult> {
  await requireRole(["admin"]);

  const parsed = updateProfileSchema.safeParse({ memberId, status });
  if (!parsed.success) {
    return { success: false, error: "Ogiltiga parametrar." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("profiles")
    .update({ status })
    .eq("id", memberId);

  if (error) return { success: false, error: "Kunde inte uppdatera status." };

  revalidatePath("/admin/medlemmar");
  return { success: true };
}

export async function updateMemberRole(
  memberId: string,
  role: "member" | "coach" | "admin"
): Promise<AdminResult> {
  await requireRole(["admin"]);

  const parsed = updateProfileSchema.safeParse({ memberId, role });
  if (!parsed.success) {
    return { success: false, error: "Ogiltiga parametrar." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("profiles")
    .update({ role })
    .eq("id", memberId);

  if (error) return { success: false, error: "Kunde inte uppdatera roll." };

  revalidatePath("/admin/medlemmar");
  return { success: true };
}
