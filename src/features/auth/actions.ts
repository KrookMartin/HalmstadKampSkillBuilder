"use server";

import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

const emailSchema = z.object({
  email: z.string().email("Ange en giltig e-postadress"),
});

export type LoginResult =
  | { success: true }
  | { success: false; error: string };

export async function sendMagicLink(
  formData: FormData
): Promise<LoginResult> {
  const parsed = emailSchema.safeParse({ email: formData.get("email") });

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithOtp({
    email: parsed.data.email,
    options: {
      // After clicking the link the user lands on /auth/callback which
      // exchanges the token and redirects them to /idag.
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  });

  if (error) {
    // Don't leak whether the email exists – return a generic message.
    console.error("Magic link error:", error.message);
    return {
      success: false,
      error: "Något gick fel. Försök igen om en stund.",
    };
  }

  return { success: true };
}
