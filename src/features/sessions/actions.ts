"use server";

import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth";
import { z } from "zod";
import { revalidatePath } from "next/cache";

const sessionSchema = z.object({
  session_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Ogiltigt datum"),
  time_slot: z
    .string()
    .regex(/^\d{2}:\d{2}$/, "Använd formatet HH:MM, t.ex. 18:00"),
  class_type: z.string().min(2, "Ange typ av pass"),
  notes: z.string().optional(),
});

export type SessionResult =
  | { success: true; id: string }
  | { success: false; error: string };

export async function createSession(
  formData: FormData
): Promise<SessionResult> {
  const profile = await requireRole(["coach", "admin"]);

  const parsed = sessionSchema.safeParse({
    session_date: formData.get("session_date"),
    time_slot: formData.get("time_slot"),
    class_type: formData.get("class_type"),
    notes: formData.get("notes") || undefined,
  });

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("sessions")
    .insert({ ...parsed.data, created_by: profile.id })
    .select("id")
    .single();

  if (error || !data) {
    return { success: false, error: "Kunde inte skapa passet." };
  }

  revalidatePath("/traning/pass");
  revalidatePath("/idag");
  return { success: true, id: data.id };
}

export async function updateSession(
  id: string,
  formData: FormData
): Promise<SessionResult> {
  await requireRole(["coach", "admin"]);

  const parsed = sessionSchema.safeParse({
    session_date: formData.get("session_date"),
    time_slot: formData.get("time_slot"),
    class_type: formData.get("class_type"),
    notes: formData.get("notes") || undefined,
  });

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("sessions")
    .update(parsed.data)
    .eq("id", id);

  if (error) return { success: false, error: "Kunde inte uppdatera passet." };

  revalidatePath("/traning/pass");
  revalidatePath("/idag");
  return { success: true, id };
}

export async function publishSession(
  id: string,
  publish: boolean
): Promise<{ success: boolean; error?: string }> {
  await requireRole(["coach", "admin"]);

  const supabase = await createClient();
  const { error } = await supabase
    .from("sessions")
    .update({ published: publish })
    .eq("id", id);

  if (error) return { success: false, error: "Kunde inte ändra status." };

  revalidatePath("/traning/pass");
  revalidatePath("/idag");
  return { success: true };
}

export async function deleteSession(
  id: string
): Promise<{ success: boolean; error?: string }> {
  await requireRole(["coach", "admin"]);

  const supabase = await createClient();
  const { error } = await supabase.from("sessions").delete().eq("id", id);

  if (error) return { success: false, error: "Kunde inte ta bort passet." };

  revalidatePath("/traning/pass");
  revalidatePath("/idag");
  return { success: true };
}

// Replaces the full ordered technique list for a session in one go.
// Takes an array of technique IDs in the desired display order.
export async function setSessionTechniques(
  sessionId: string,
  techniqueIds: string[]
): Promise<{ success: boolean; error?: string }> {
  await requireRole(["coach", "admin"]);

  const supabase = await createClient();

  // Delete existing entries, then insert the new ordered set.
  const { error: delError } = await supabase
    .from("session_techniques")
    .delete()
    .eq("session_id", sessionId);

  if (delError) return { success: false, error: "Kunde inte uppdatera passet." };

  if (techniqueIds.length === 0) {
    revalidatePath("/traning/pass");
    revalidatePath("/idag");
    return { success: true };
  }

  const rows = techniqueIds.map((tid, i) => ({
    session_id: sessionId,
    technique_id: tid,
    position: i,
  }));

  const { error: insError } = await supabase
    .from("session_techniques")
    .insert(rows);

  if (insError) return { success: false, error: "Kunde inte spara ordningen." };

  revalidatePath("/traning/pass");
  revalidatePath("/idag");
  return { success: true };
}
