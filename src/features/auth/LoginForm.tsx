"use client";

import { useActionState, startTransition } from "react";
import { buttonPrimary, input, label } from "@/components/ui";
import { signIn, type LoginResult } from "./actions";

export function LoginForm() {
  const [result, dispatch, pending] = useActionState(
    async (_prev: LoginResult | null, formData: FormData) => signIn(formData),
    null
  );

  return (
    <form
      // onSubmit instead of action={…}: React resets forms passed to
      // `action`, which would clear the email after a wrong password.
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        startTransition(() => dispatch(fd));
      }}
      className="space-y-4"
    >
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

      <div>
        <label htmlFor="password" className={label}>
          Lösenord
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className={input}
        />
      </div>

      {result?.success === false && (
        <p role="alert" className="text-sm text-red-text">
          {result.error}
        </p>
      )}

      <button type="submit" disabled={pending} className={buttonPrimary}>
        {pending ? "Loggar in…" : "Logga in"}
      </button>
    </form>
  );
}
