"use client";

import { useState, useTransition } from "react";
import { setSessionTechniques } from "./actions";
import { categoryLabels } from "@/features/techniques/labels";
import type { Technique } from "@/features/techniques/queries";

interface TechniquePickerProps {
  sessionId: string;
  allTechniques: Technique[];
  initialSelected: Technique[];
}

// Lets a coach build the ordered technique list for a session.
// Left column = archive to pick from; right column = current session order.
// Reorder by moving items up/down; remove with ✕.
export function TechniquePicker({
  sessionId,
  allTechniques,
  initialSelected,
}: TechniquePickerProps) {
  const [selected, setSelected] = useState<Technique[]>(initialSelected);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const selectedIds = new Set(selected.map((t) => t.id));

  function add(technique: Technique) {
    if (selectedIds.has(technique.id)) return;
    setSelected((prev) => [...prev, technique]);
    setSaved(false);
  }

  function remove(id: string) {
    setSelected((prev) => prev.filter((t) => t.id !== id));
    setSaved(false);
  }

  function moveUp(index: number) {
    if (index === 0) return;
    setSelected((prev) => {
      const next = [...prev];
      [next[index - 1], next[index]] = [next[index], next[index - 1]];
      return next;
    });
    setSaved(false);
  }

  function moveDown(index: number) {
    if (index === selected.length - 1) return;
    setSelected((prev) => {
      const next = [...prev];
      [next[index], next[index + 1]] = [next[index + 1], next[index]];
      return next;
    });
    setSaved(false);
  }

  function save() {
    setError(null);
    startTransition(async () => {
      const result = await setSessionTechniques(
        sessionId,
        selected.map((t) => t.id)
      );
      if (result.success) {
        setSaved(true);
      } else {
        setError(result.error ?? "Något gick fel.");
      }
    });
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        {/* Archive — pick from here */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">Arkiv</p>
          <div className="h-72 overflow-y-auto rounded-xl border border-gray-200 bg-white divide-y divide-gray-100">
            {allTechniques.length === 0 && (
              <p className="p-3 text-sm text-gray-400">
                Inga tekniker i arkivet än.
              </p>
            )}
            {allTechniques.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => add(t)}
                disabled={selectedIds.has(t.id)}
                className="flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-sm hover:bg-gray-50 disabled:opacity-40"
              >
                <span className="min-w-0">
                  <span className="block truncate font-medium text-gray-900">
                    {t.title}
                  </span>
                  <span className="text-xs text-gray-500">
                    {categoryLabels[t.category]}
                  </span>
                </span>
                {!selectedIds.has(t.id) && (
                  <span className="shrink-0 text-gray-400">+</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Selected — session order */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">
            Dagens pass{" "}
            <span className="font-normal text-gray-400">
              ({selected.length} tekniker)
            </span>
          </p>
          <div className="h-72 overflow-y-auto rounded-xl border border-gray-200 bg-white divide-y divide-gray-100">
            {selected.length === 0 && (
              <p className="p-3 text-sm text-gray-400">
                Välj tekniker från arkivet.
              </p>
            )}
            {selected.map((t, i) => (
              <div
                key={t.id}
                className="flex items-center gap-1 px-3 py-2 text-sm"
              >
                <span className="w-5 shrink-0 text-xs text-gray-400">
                  {i + 1}.
                </span>
                <span className="min-w-0 flex-1 truncate font-medium text-gray-900">
                  {t.title}
                </span>
                <div className="flex shrink-0 gap-1">
                  <button
                    type="button"
                    onClick={() => moveUp(i)}
                    disabled={i === 0}
                    aria-label="Flytta upp"
                    className="min-h-[36px] min-w-[36px] rounded text-gray-400 hover:text-gray-700 disabled:opacity-30"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    onClick={() => moveDown(i)}
                    disabled={i === selected.length - 1}
                    aria-label="Flytta ner"
                    className="min-h-[36px] min-w-[36px] rounded text-gray-400 hover:text-gray-700 disabled:opacity-30"
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(t.id)}
                    aria-label="Ta bort"
                    className="min-h-[36px] min-w-[36px] rounded text-red-400 hover:text-red-600"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="button"
        onClick={save}
        disabled={isPending || saved}
        className="flex min-h-[44px] w-full items-center justify-center rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-700 disabled:opacity-60"
      >
        {isPending ? "Sparar…" : saved ? "Sparat ✓" : "Spara ordning"}
      </button>
    </div>
  );
}
