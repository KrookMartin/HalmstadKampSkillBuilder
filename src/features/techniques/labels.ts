import type { TechniqueCategory, TechniqueLevel } from "@/lib/supabase/types";

export const categoryLabels: Record<TechniqueCategory, string> = {
  guards: "Guards",
  passing: "Passering",
  takedowns: "Nedtagningar",
  upper_body_submissions: "Överkroppsgrepp",
  lower_body_submissions: "Benkroppsgrepp",
  sweeps: "Svep",
};

export const levelLabels: Record<TechniqueLevel, string> = {
  beginner: "Nybörjare",
  intermediate: "Medel",
  advanced: "Avancerad",
};

export const categories = Object.entries(categoryLabels) as [
  TechniqueCategory,
  string,
][];

export const levels = Object.entries(levelLabels) as [TechniqueLevel, string][];
