import { z } from "zod";
import { parseYoutubeUrl } from "@/lib/youtube";
import { Constants } from "@/lib/supabase/types";

// Lives outside actions.ts because a "use server" file may only export async
// functions; here both the actions and the tests can import it.

const { technique_category, technique_level } = Constants.public.Enums;

export const techniqueSchema = z.object({
  title: z.string().trim().min(2, "Titeln måste vara minst 2 tecken"),
  // Built from the generated DB enums, so the parsed type matches the
  // database exactly and needs no cast.
  category: z.enum(technique_category, "Välj en kategori"),
  level: z.enum(technique_level, "Välj en nivå"),
  // Use the same parser the video player uses: if it can't find a video ID
  // here, the video would never play for members either.
  youtube_url: z
    .string("Ange en giltig YouTube-länk")
    .trim()
    .refine(
      (url) => parseYoutubeUrl(url) !== null,
      "Ange en giltig YouTube-länk, t.ex. https://youtu.be/…"
    ),
  // Empty textarea → null, so clearing the notes on edit actually clears them
  // (undefined would make Supabase skip the column and keep the old text).
  notes: z
    .string()
    .trim()
    .transform((v) => v || null),
});

export type TechniqueInput = z.infer<typeof techniqueSchema>;

// Shared by create and update so both read the form the same way.
export function parseTechniqueForm(formData: FormData) {
  return techniqueSchema.safeParse({
    title: formData.get("title"),
    category: formData.get("category"),
    level: formData.get("level"),
    youtube_url: formData.get("youtube_url"),
    notes: formData.get("notes") ?? "",
  });
}
