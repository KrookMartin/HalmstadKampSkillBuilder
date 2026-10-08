"use client";

import { useActionState } from "react";
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
      <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-800">
        <p className="font-medium">Kolla din e-post!</p>
        <p className="mt-1 text-green-700">
          Vi har skickat en inloggningslänk till dig. Länken är giltig i
          60 minuter.
        </p>
      </div>
    );
  }

  return (
    <form action={action} className="space-y-4">
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700"
        >
          E-postadress
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="namn@exempel.se"
          className="mt-1 block w-full min-h-[44px] rounded-lg border border-gray-300 px-3 py-2 text-base shadow-sm placeholder:text-gray-400 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 disabled:opacity-50"
        />
      </div>

      {result?.success === false && (
        <p role="alert" className="text-sm text-red-600">
          {result.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="flex min-h-[44px] w-full items-center justify-center rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 disabled:opacity-60"
      >
        {pending ? "Skickar…" : "Skicka inloggningslänk"}
      </button>
    </form>
  );
}
