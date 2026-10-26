"use client";

import { useActionState, useId, useRef, useState, startTransition } from "react";
import { buttonSecondary, input, label } from "@/components/ui";
import { toIsoDate } from "@/lib/date";
import type { Technique } from "@/features/techniques/queries";
import type { SessionWithTechniques } from "./queries";
import { saveSession } from "./actions";
import type { SessionResult } from "./actions";
import { TechniquePicker } from "./TechniquePicker";

interface SessionEditorProps {
  existing?: SessionWithTechniques;
  allTechniques: Technique[];
}

// The whole pass in one form: when, type, coach notes and the ordered video
// list. One save button stores everything (see saveSession).
export function SessionEditor({ existing, allTechniques }: SessionEditorProps) {
  // Several editors are on the page at once, so ids must be unique.
  const uid = useId();
  const id = (name: string) => `${uid}-${name}`;

  const formRef = useRef<HTMLFormElement>(null);
  const [selected, setSelected] = useState<Technique[]>(
    existing?.techniques ?? []
  );

  const [result, dispatch, pending] = useActionState(
    async (_prev: SessionResult | null, fd: FormData) => {
      const res = await saveSession(existing?.id ?? null, fd);
      // A new pass was created: clear the form for the next one.
      if (res.success && !existing) {
        formRef.current?.reset();
        setSelected([]);
      }
      return res;
    },
    null
  );

  return (
    <form
      ref={formRef}
      // onSubmit instead of action={…}: React resets forms passed to
      // `action` after every submit, which would wipe input on errors.
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        startTransition(() => dispatch(fd));
      }}
      className="space-y-5"
    >
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor={id("date")} className={label}>
            Datum
          </label>
          <input
            id={id("date")}
            name="session_date"
            type="date"
            required
            defaultValue={existing?.session_date ?? toIsoDate(new Date())}
            className={input}
          />
        </div>
        <div>
          <label htmlFor={id("time")} className={label}>
            Tid
          </label>
          <input
            id={id("time")}
            name="time_slot"
            type="time"
            required
            // DB stores "18:00:00"; the input and validation use "18:00".
            defaultValue={existing?.time_slot.slice(0, 5) ?? ""}
            className={input}
          />
        </div>
      </div>

      <div>
        <label htmlFor={id("type")} className={label}>
          Typ av pass
        </label>
        <input
          id={id("type")}
          name="class_type"
          type="text"
          required
          defaultValue={existing?.class_type ?? ""}
          placeholder="t.ex. BJJ Advanced – K-guard"
          className={input}
        />
      </div>

      <div>
        <label htmlFor={id("notes")} className={label}>
          Tränarens fokus <span className="font-normal text-muted">(valfritt)</span>
        </label>
        <textarea
          id={id("notes")}
          name="notes"
          rows={4}
          defaultValue={existing?.notes ?? ""}
          placeholder="Vad du vill lyfta fram, nyckeldetaljer, vanliga misstag…"
          className={input}
        />
      </div>

      {/* The picker's list is state, so it's sent as hidden inputs in order. */}
      {selected.map((t) => (
        <input key={t.id} type="hidden" name="technique_ids" value={t.id} />
      ))}
      <TechniquePicker
        idPrefix={uid}
        allTechniques={allTechniques}
        selected={selected}
        onChange={setSelected}
      />

      {result?.success === false && (
        <p role="alert" className="text-sm text-red-text">
          {result.error}
        </p>
      )}
      {result?.success && (
        <p role="status" className="text-sm text-text-soft">
          {existing ? "Passet är sparat." : "Passet är skapat."}
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
