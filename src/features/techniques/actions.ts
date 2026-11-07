"use server";

import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { parseTechniqueForm } from "./schema";
import type { Technique } from "./queries";

// `technique` is set on create, so the pass builder can add the new
// technique to the pass it's building.
export type TechniqueFormResult =
  { success: true; technique?: Technique } | { success: false; error: string };

export async function createTechnique(
  formData: FormData
): Promise<TechniqueFormResult> {
  const profile = await requireRole(["coach", "admin"]);

  const parsed = parseTechniqueForm(formData);

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("techniques")
    .insert({ ...parsed.data, created_by: profile.id })
    .select(
      "id, title, category, level, youtube_url, notes, created_by, created_at"
    )
    .single();

  if (error) {
    return { success: false, error: "Kunde inte spara tekniken." };
  }

  revalidatePath("/traning/arkiv");
  revalidatePath("/traning/pass");
  revalidatePath("/tekniker");
  return { success: true, technique: data as Technique };
}

export async function updateTechnique(
  id: string,
  formData: FormData
): Promise<TechniqueFormResult> {
  await requireRole(["coach", "admin"]);

  const parsed = parseTechniqueForm(formData);

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const supabase = await createClient();
  // Zero rows means the technique is gone (e.g. another coach deleted it)
  // or RLS blocked the update; neither is reported as an error, so ask for
  // the updated row back and treat "no row" as a failure.
  const { data, error } = await supabase
    .from("techniques")
    .update(parsed.data)
    .eq("id", id)
    .select("id");

  if (error) {
    return { success: false, error: "Kunde inte uppdatera tekniken." };
  }
  if (data.length === 0) {
    return {
      success: false,
      error: "Tekniken finns inte längre. Ladda om sidan.",
    };
  }

  revalidatePath("/traning/arkiv");
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

  revalidatePath("/traning/arkiv");
  revalidatePath("/tekniker");
  return { success: true };
}
