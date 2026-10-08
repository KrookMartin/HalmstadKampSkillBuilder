import { createClient } from "@/lib/supabase/server";
import type { TechniqueCategory, TechniqueLevel } from "@/lib/supabase/types";

export type Technique = {
  id: string;
  title: string;
  category: TechniqueCategory;
  level: TechniqueLevel;
  youtube_url: string;
  notes: string | null;
  created_by: string;
  created_at: string;
};

export async function getTechniques(filters?: {
  category?: TechniqueCategory;
  level?: TechniqueLevel;
  search?: string;
}): Promise<Technique[]> {
  const supabase = await createClient();

  let query = supabase
    .from("techniques")
    .select("id, title, category, level, youtube_url, notes, created_by, created_at")
    .order("title");

  if (filters?.category) {
    query = query.eq("category", filters.category);
  }
  if (filters?.level) {
    query = query.eq("level", filters.level);
  }
  if (filters?.search) {
    query = query.ilike("title", `%${filters.search}%`);
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return (data ?? []) as Technique[];
}

export async function getTechniqueById(id: string): Promise<Technique | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("techniques")
    .select("id, title, category, level, youtube_url, notes, created_by, created_at")
    .eq("id", id)
    .single();

  if (error) return null;
  return data as Technique;
}
