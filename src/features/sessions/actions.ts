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
  class_type: z.string().trim().min(2, "Ange typ av pass"),
  // Empty textarea → null, so clearing the notes actually clears them.
  notes: z
    .string()
    .trim()
    .transform((v) => v || null),
  // Ordered list: index in the array = position shown to members.
  technique_ids: z.array(z.uuid()).max(50, "Max 50 videor per pass"),
});

export type SessionResult =
  | { success: true; id: string }
  | { success: false; error: string };

// Creates (sessionId = null) or updates a session together with its ordered
// video list, so the coach saves the whole pass with one button.
export async function saveSession(
  sessionId: string | null,
  formData: FormData
): Promise<SessionResult> {
  const profile = await requireRole(["coach", "admin"]);

  const parsed = sessionSchema.safeParse({
    session_date: formData.get("session_date"),
    time_slot: formData.get("time_slot"),
    class_type: formData.get("class_type"),
    notes: formData.get("notes") ?? "",
    technique_ids: formData.getAll("technique_ids"),
  });

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const { technique_ids, ...fields } = parsed.data;
  const supabase = await createClient();

  let id = sessionId;
  if (id) {
    const { error } = await supabase.from("sessions").update(fields).eq("id", id);
    if (error) return { success: false, error: "Kunde inte spara passet." };
  } else {
    const { data, error } = await supabase
      .from("sessions")
      .insert({ ...fields, created_by: profile.id })
      .select("id")
      .single();
    if (error || !data) {
      return { success: false, error: "Kunde inte skapa passet." };
    }
    id = data.id;
  }

  // Replace the full video list: delete existing rows, insert the new order.
  const { error: delError } = await supabase
    .from("session_techniques")
    .delete()
    .eq("session_id", id);
  if (delError) return { success: false, error: "Kunde inte spara videorna." };

  if (technique_ids.length > 0) {
    const { error: insError } = await supabase.from("session_techniques").insert(
      technique_ids.map((technique_id, position) => ({
        session_id: id,
        technique_id,
        position,
      }))
    );
    if (insError) return { success: false, error: "Kunde inte spara videorna." };
  }

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
