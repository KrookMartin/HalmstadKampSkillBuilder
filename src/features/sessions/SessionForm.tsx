"use client";

import { useActionState } from "react";
import { createSession, updateSession } from "./actions";
import type { SessionResult } from "./actions";

interface Session {
  id: string;
  session_date: string;
  time_slot: string;
  class_type: string;
  notes: string | null;
}

interface SessionFormProps {
  existing?: Session;
  onSuccess?: (id: string) => void;
}

export function SessionForm({ existing, onSuccess }: SessionFormProps) {
  const action = existing
    ? (_prev: SessionResult | null, fd: FormData) =>
        updateSession(existing.id, fd)
    : (_prev: SessionResult | null, fd: FormData) => createSession(fd);

  const [result, dispatch, pending] = useActionState(action, null);

  if (result?.success && onSuccess) {
    onSuccess(result.id);
  }

  const today = new Date().toISOString().split("T")[0];

  return (
    <form action={dispatch} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label
            htmlFor="session_date"
            className="block text-sm font-medium text-gray-700"
          >
            Datum
          </label>
          <input
            id="session_date"
            name="session_date"
            type="date"
            required
            defaultValue={existing?.session_date ?? today}
            className="mt-1 block w-full min-h-[44px] rounded-lg border border-gray-300 px-3 py-2 text-base focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 disabled:opacity-50"
          />
        </div>
        <div>
          <label
            htmlFor="time_slot"
            className="block text-sm font-medium text-gray-700"
          >
            Tid
          </label>
          <input
            id="time_slot"
            name="time_slot"
            type="time"
            required
            defaultValue={existing?.time_slot ?? ""}
            placeholder="18:00"
            className="mt-1 block w-full min-h-[44px] rounded-lg border border-gray-300 px-3 py-2 text-base focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 disabled:opacity-50"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="class_type"
          className="block text-sm font-medium text-gray-700"
        >
          Typ av pass
        </label>
        <input
          id="class_type"
          name="class_type"
          type="text"
          required
          defaultValue={existing?.class_type ?? ""}
          placeholder="t.ex. BJJ Avancerat"
          className="mt-1 block w-full min-h-[44px] rounded-lg border border-gray-300 px-3 py-2 text-base focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 disabled:opacity-50"
        />
      </div>

      <div>
        <label
          htmlFor="notes"
          className="block text-sm font-medium text-gray-700"
        >
          Anteckningar{" "}
          <span className="font-normal text-gray-400">(valfritt)</span>
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={3}
          defaultValue={existing?.notes ?? ""}
          placeholder="Tema för passet, vad du vill fokusera på…"
          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-base focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 disabled:opacity-50"
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
        className="flex min-h-[44px] w-full items-center justify-center rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-700 disabled:opacity-60"
      >
        {pending ? "Sparar…" : existing ? "Spara ändringar" : "Skapa pass"}
      </button>
    </form>
  );
}
