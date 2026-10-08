"use client";

import { useActionState } from "react";
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
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Namn
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          defaultValue={existing?.title}
          placeholder="t.ex. Armhävstång från guard"
          className="mt-1 block w-full min-h-[44px] rounded-lg border border-gray-300 px-3 py-2 text-base focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 disabled:opacity-50"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">
            Kategori
          </label>
          <select
            id="category"
            name="category"
            required
            defaultValue={existing?.category}
            className="mt-1 block w-full min-h-[44px] rounded-lg border border-gray-300 px-3 py-2 text-base focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 disabled:opacity-50"
          >
            <option value="">Välj…</option>
            {categories.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="level" className="block text-sm font-medium text-gray-700">
            Nivå
          </label>
          <select
            id="level"
            name="level"
            required
            defaultValue={existing?.level}
            className="mt-1 block w-full min-h-[44px] rounded-lg border border-gray-300 px-3 py-2 text-base focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 disabled:opacity-50"
          >
            <option value="">Välj…</option>
            {levels.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="youtube_url" className="block text-sm font-medium text-gray-700">
          YouTube-länk
        </label>
        <input
          id="youtube_url"
          name="youtube_url"
          type="url"
          required
          defaultValue={existing?.youtube_url}
          placeholder="https://youtu.be/..."
          className="mt-1 block w-full min-h-[44px] rounded-lg border border-gray-300 px-3 py-2 text-base focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 disabled:opacity-50"
        />
      </div>

      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
          Anteckningar <span className="font-normal text-gray-400">(valfritt)</span>
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={3}
          defaultValue={existing?.notes ?? ""}
          placeholder="Nyckeldetaljer, vanliga misstag…"
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
        className="flex min-h-[44px] w-full items-center justify-center rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 disabled:opacity-60"
      >
        {pending ? "Sparar…" : existing ? "Spara ändringar" : "Lägg till teknik"}
      </button>
    </form>
  );
}
