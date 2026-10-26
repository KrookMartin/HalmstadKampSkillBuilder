"use server";

import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth";
import { z } from "zod";
import { revalidatePath } from "next/cache";

// ── Coach actions ─────────────────────────────────────────────────────────────

const weekSchema = z.object({
  week_number: z.coerce.number().int().min(1),
  title: z.string().min(1, "Ange en rubrik"),
  content: z.string().min(1, "Innehållet får inte vara tomt"),
});

export type WeekResult =
  | { success: true }
  | { success: false; error: string };

export async function upsertWeek(
  programId: string,
  formData: FormData
): Promise<WeekResult> {
  await requireRole(["coach", "admin"]);

  const parsed = weekSchema.safeParse({
    week_number: formData.get("week_number"),
    title: formData.get("title"),
    content: formData.get("content"),
  });

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("strength_weeks").upsert(
    { program_id: programId, ...parsed.data },
    { onConflict: "program_id,week_number" }
  );

  if (error) return { success: false, error: "Kunde inte spara veckan." };

  revalidatePath("/styrka");
  revalidatePath("/traning/styrka");
  return { success: true };
}

export async function deleteWeek(weekId: string): Promise<WeekResult> {
  await requireRole(["coach", "admin"]);

  const supabase = await createClient();
  const { error } = await supabase
    .from("strength_weeks")
    .delete()
    .eq("id", weekId);

  if (error) return { success: false, error: "Kunde inte ta bort veckan." };

  revalidatePath("/styrka");
  revalidatePath("/traning/styrka");
  return { success: true };
}
