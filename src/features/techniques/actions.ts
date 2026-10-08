"use server";

import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import type { TechniqueCategory, TechniqueLevel } from "@/lib/supabase/types";

const techniqueSchema = z.object({
  title: z.string().min(2, "Titeln måste vara minst 2 tecken"),
  category: z.enum([
    "guards",
    "passing",
    "takedowns",
    "upper_body_submissions",
    "lower_body_submissions",
    "sweeps",
  ]),
  level: z.enum(["beginner", "intermediate", "advanced"]),
  youtube_url: z.string().url("Ange en giltig YouTube-länk"),
  notes: z.string().optional(),
});

export type TechniqueFormResult =
  | { success: true }
  | { success: false; error: string };

export async function createTechnique(
  formData: FormData
): Promise<TechniqueFormResult> {
  const profile = await requireRole(["coach", "admin"]);

  const parsed = techniqueSchema.safeParse({
    title: formData.get("title"),
    category: formData.get("category"),
    level: formData.get("level"),
    youtube_url: formData.get("youtube_url"),
    notes: formData.get("notes") || undefined,
  });

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("techniques").insert({
    ...parsed.data,
    created_by: profile.id,
  });

  if (error) {
    return { success: false, error: "Kunde inte spara tekniken." };
  }

  revalidatePath("/arkiv");
  revalidatePath("/tekniker");
  return { success: true };
}

export async function updateTechnique(
  id: string,
  formData: FormData
): Promise<TechniqueFormResult> {
  await requireRole(["coach", "admin"]);

  const parsed = techniqueSchema.safeParse({
    title: formData.get("title"),
    category: formData.get("category"),
    level: formData.get("level"),
    youtube_url: formData.get("youtube_url"),
    notes: formData.get("notes") || undefined,
  });

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const supabase = await createClient();
  // RLS policy allows coaches to only update their own techniques.
  const { error } = await supabase
    .from("techniques")
    .update(parsed.data as { title: string; category: TechniqueCategory; level: TechniqueLevel; youtube_url: string; notes?: string })
    .eq("id", id);

  if (error) {
    return { success: false, error: "Kunde inte uppdatera tekniken." };
  }

  revalidatePath("/arkiv");
  revalidatePath("/tekniker");
  return { success: true };
}

export async function deleteTechnique(
  id: string
): Promise<TechniqueFormResult> {
  await requireRole(["coach", "admin"]);

  const supabase = await createClient();
  const { error } = await supabase.from("techniques").delete().eq("id", id);

  if (error) {
    return { success: false, error: "Kunde inte ta bort tekniken." };
  }

  revalidatePath("/arkiv");
  revalidatePath("/tekniker");
  return { success: true };
}
