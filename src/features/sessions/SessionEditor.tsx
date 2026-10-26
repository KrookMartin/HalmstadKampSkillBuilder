"use client";

import {
  useActionState,
  useId,
  useRef,
  useState,
  startTransition,
} from "react";
import { buttonSecondary, input, label, meta } from "@/components/ui";
import { PlusIcon } from "@/components/icons";
import { toIsoDate } from "@/lib/date";
import type { Technique } from "@/features/techniques/queries";
import { TechniqueForm } from "@/features/techniques/TechniqueForm";
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
//
// "Ny teknik" lets a coach add a missing clip without leaving the pass: it's
// saved to the archive and appended to this pass. Its form sits *beside* the
// pass form (HTML forbids nested forms); the save button below joins the
// pass form via its `form` attribute.
export function SessionEditor({ existing, allTechniques }: SessionEditorProps) {
  // Several editors are on the page at once, so ids must be unique.
  const uid = useId();
  const id = (name: string) => `${uid}-${name}`;

  const formRef = useRef<HTMLFormElement>(null);
  const newTechniqueRef = useRef<HTMLDetailsElement>(null);
  const [added, setAdded] = useState<string | null>(null);
  const [selected, setSelected] = useState<Technique[]>(
    existing?.techniques ?? []
  );

  const [result, dispatch, pending] = useActionState(
    async (_prev: SessionResult | null, fd: FormData) => {
      const res = await saveSession(existing?.id ?? null, fd);
      if (res.success) setAdded(null);
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
    <div className="space-y-5">
      <form
        id={id("form")}
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
            Tränarens fokus{" "}
            <span className="font-normal text-muted">(valfritt)</span>
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
      </form>

      <details
        ref={newTechniqueRef}
        className="group rounded-card border border-line"
        // Clear the "added" note when reopened (not when we close it below).
        onToggle={(e) => {
          if (e.currentTarget.open) setAdded(null);
        }}
      >
        <summary className="flex min-h-[54px] cursor-pointer list-none items-center gap-2 px-4 font-semibold focus-visible:outline-2 focus-visible:outline-red-text [&::-webkit-details-marker]:hidden">
          <PlusIcon className="h-5 w-5 text-red-text" />
          Ny teknik
        </summary>
        <div className="space-y-4 border-t border-line p-4">
          <p className={meta}>Sparas i arkivet och läggs sist i passet.</p>
          <TechniqueForm
            submitLabel="Spara och lägg till i passet"
            onSuccess={(t) => {
              if (!t) return;
              setSelected((prev) => [...prev, t]);
              setAdded(t.title);
              if (newTechniqueRef.current) newTechniqueRef.current.open = false;
            }}
          />
        </div>
      </details>
      {added && (
        <p role="status" className="text-sm text-text-soft">
          ”{added}” är sparad i arkivet och tillagd i passet. Glöm inte att
          spara passet.
        </p>
      )}

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
        form={id("form")}
        disabled={pending}
        className={`${buttonSecondary} min-h-[54px] w-full`}
      >
        {pending ? "Sparar…" : existing ? "Spara ändringar" : "Skapa pass"}
      </button>
    </div>
  );
}
