"use client";

import { useActionState, useId } from "react";
import { buttonPrimary, input, label } from "@/components/ui";
import { createTechnique, updateTechnique } from "./actions";
import type { TechniqueFormResult } from "./actions";
import type { Technique } from "./queries";
import { categories, levels } from "./labels";

interface TechniqueFormProps {
  existing?: Technique;
  onSuccess?: () => void;
}

// Single form used for both create and edit.
// When `existing` is provided it binds the update action to that id.
export function TechniqueForm({ existing, onSuccess }: TechniqueFormProps) {
  // The create form and an edit form can be on screen together, so
  // input ids must be unique per form instance for <label htmlFor>.
  const uid = useId();
  const id = (name: string) => `${uid}-${name}`;

  const action = existing
    ? (_prev: TechniqueFormResult | null, fd: FormData) =>
        updateTechnique(existing.id, fd)
    : (_prev: TechniqueFormResult | null, fd: FormData) =>
        createTechnique(fd);

  const [result, dispatch, pending] = useActionState(action, null);

  if (result?.success && onSuccess) {
    onSuccess();
  }

  return (
    <form action={dispatch} className="space-y-4">
      <div>
        <label htmlFor={id("title")} className={label}>
          Namn
        </label>
        <input
          id={id("title")}
          name="title"
          type="text"
          required
          defaultValue={existing?.title}
          placeholder="t.ex. Armbar från closed guard"
          className={input}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor={id("category")} className={label}>
            Position
          </label>
          <select
            id={id("category")}
            name="category"
            required
            defaultValue={existing?.category ?? ""}
            className={input}
          >
            <option value="">Välj…</option>
            {categories.map(([value, text]) => (
              <option key={value} value={value}>
                {text}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor={id("level")} className={label}>
            Nivå
          </label>
          <select
            id={id("level")}
            name="level"
            required
            defaultValue={existing?.level ?? ""}
            className={input}
          >
            <option value="">Välj…</option>
            {levels.map(([value, text]) => (
              <option key={value} value={value}>
                {text}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor={id("youtube_url")} className={label}>
          YouTube-länk
        </label>
        <input
          id={id("youtube_url")}
          name="youtube_url"
          type="url"
          required
          defaultValue={existing?.youtube_url}
          placeholder="https://youtu.be/..."
          className={input}
        />
      </div>

      <div>
        <label htmlFor={id("notes")} className={label}>
          Att tänka på <span className="font-normal text-muted">(valfritt)</span>
        </label>
        <textarea
          id={id("notes")}
          name="notes"
          rows={3}
          defaultValue={existing?.notes ?? ""}
          placeholder="Nyckeldetaljer, vanliga misstag…"
          className={input}
        />
      </div>

      {result?.success === false && (
        <p role="alert" className="text-sm text-red-text">
          {result.error}
        </p>
      )}

      <button type="submit" disabled={pending} className={buttonPrimary}>
        {pending ? "Sparar…" : existing ? "Spara ändringar" : "Lägg till teknik"}
      </button>
    </form>
  );
}
