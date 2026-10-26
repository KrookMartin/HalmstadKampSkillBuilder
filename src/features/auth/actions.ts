"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { z } from "zod";

// Coach login with email + password. Accounts are created by an admin in
// the Supabase dashboard, so no emails are ever sent by the app.
const loginSchema = z.object({
  email: z.email("Ange en giltig e-postadress"),
  password: z.string().min(1, "Ange ditt lösenord"),
});

export type LoginResult = { success: false; error: string };

export async function signIn(formData: FormData): Promise<LoginResult> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) {
    // Same message for wrong email and wrong password, so the form can't be
    // used to find out which emails have accounts.
    console.error("Login error:", error.message);
    return { success: false, error: "Fel e-post eller lösenord." };
  }

  // redirect() throws, so nothing after this runs.
  redirect("/traning/pass");
}

export async function signOut(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/idag");
}
