"use client";

import { useActionState } from "react";
import { buttonPrimary, card, input, label } from "@/components/ui";
import { sendMagicLink, type LoginResult } from "./actions";

const initialState: LoginResult | null = null;

export function LoginForm() {
  const [result, action, pending] = useActionState(
    async (_prev: LoginResult | null, formData: FormData) =>
      sendMagicLink(formData),
    initialState
  );

  if (result?.success) {
    return (
      <div role="status" className={`${card} space-y-1`}>
        <p className="font-semibold">Kolla din e-post!</p>
        <p className="text-text-soft">
          Vi har skickat en inloggningslänk till dig. Länken är giltig i 60
          minuter.
        </p>
      </div>
    );
  }

  return (
    <form action={action} className="space-y-4">
      <div>
        <label htmlFor="email" className={label}>
          E-postadress
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="namn@exempel.se"
          className={input}
        />
      </div>

      {result?.success === false && (
        <p role="alert" className="text-sm text-red-text">
          {result.error}
        </p>
      )}

      <button type="submit" disabled={pending} className={buttonPrimary}>
        {pending ? "Skickar…" : "Skicka inloggningslänk"}
      </button>
    </form>
  );
}
