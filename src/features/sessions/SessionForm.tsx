"use client";

import { useActionState } from "react";
import { buttonSecondary, input, label } from "@/components/ui";
import { toIsoDate } from "@/lib/date";
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

  return (
    <form action={dispatch} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="session_date" className={label}>
            Datum
          </label>
          <input
            id="session_date"
            name="session_date"
            type="date"
            required
            defaultValue={existing?.session_date ?? toIsoDate(new Date())}
            className={input}
          />
        </div>
        <div>
          <label htmlFor="time_slot" className={label}>
            Tid
          </label>
          <input
            id="time_slot"
            name="time_slot"
            type="time"
            required
            defaultValue={existing?.time_slot ?? ""}
            className={input}
          />
        </div>
      </div>

      <div>
        <label htmlFor="class_type" className={label}>
          Typ av pass
        </label>
        <input
          id="class_type"
          name="class_type"
          type="text"
          required
          defaultValue={existing?.class_type ?? ""}
          placeholder="t.ex. BJJ Advanced"
          className={input}
        />
      </div>

      <div>
        <label htmlFor="notes" className={label}>
          Tränarens fokus <span className="font-normal text-muted">(valfritt)</span>
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={3}
          defaultValue={existing?.notes ?? ""}
          placeholder="Tema för passet, vad du vill fokusera på…"
          className={input}
        />
      </div>

      {result?.success === false && (
        <p role="alert" className="text-sm text-red-text">
          {result.error}
        </p>
      )}

      {/* Secondary: on the Pass screen "Publicera" is the primary action. */}
      <button
        type="submit"
        disabled={pending}
        className={`${buttonSecondary} min-h-[54px] w-full`}
      >
        {pending ? "Sparar…" : existing ? "Spara ändringar" : "Skapa pass"}
      </button>
    </form>
  );
}
