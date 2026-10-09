"use client";

import { useState, useTransition } from "react";
import { setSessionTechniques } from "./actions";
import { categoryLabels } from "@/features/techniques/labels";
import type { Technique } from "@/features/techniques/queries";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  CloseIcon,
  PlusIcon,
  SearchIcon,
} from "@/components/icons";
import { buttonSecondary, iconButton, input, meta } from "@/components/ui";

interface TechniquePickerProps {
  sessionId: string;
  allTechniques: Technique[];
  initialSelected: Technique[];
}

// Lets a coach build the ordered technique list for a session.
// Reorder uses up/down buttons on purpose — drag-and-drop is unreliable
// on phones (DESIGN.md). Changes are local until "Spara ordning".
export function TechniquePicker({
  sessionId,
  allTechniques,
  initialSelected,
}: TechniquePickerProps) {
  const [selected, setSelected] = useState<Technique[]>(initialSelected);
  const [query, setQuery] = useState("");
  const [saved, setSaved] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const selectedIds = new Set(selected.map((t) => t.id));
  const q = query.trim().toLowerCase();
  const available = allTechniques.filter(
    (t) => !selectedIds.has(t.id) && (!q || t.title.toLowerCase().includes(q))
  );

  function change(next: Technique[]) {
    setSelected(next);
    setSaved(false);
  }

  function move(index: number, delta: -1 | 1) {
    const target = index + delta;
    if (target < 0 || target >= selected.length) return;
    const next = [...selected];
    [next[index], next[target]] = [next[target], next[index]];
    change(next);
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
    <div className="space-y-6">
      {/* Current order */}
      <section className="space-y-2">
        <h3 className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">
          Ordning ({selected.length})
        </h3>
        {selected.length === 0 ? (
          <p className="py-2 text-muted">Lägg till tekniker från arkivet nedan.</p>
        ) : (
          <ol className="border-t border-line">
            {selected.map((t, i) => (
              <li
                key={t.id}
                className="flex min-h-[64px] items-center gap-3 border-b border-line py-2"
              >
                <span className="w-7 shrink-0 font-display text-[30px] font-bold leading-none text-faint">
                  {i + 1}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-semibold">{t.title}</span>
                  <span className={meta}>{categoryLabels[t.category]}</span>
                </span>
                <span className="flex shrink-0 gap-1">
                  <button
                    type="button"
                    onClick={() => move(i, -1)}
                    disabled={i === 0}
                    aria-label={`Flytta upp ${t.title}`}
                    className={iconButton}
                  >
                    <ArrowUpIcon className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => move(i, 1)}
                    disabled={i === selected.length - 1}
                    aria-label={`Flytta ner ${t.title}`}
                    className={iconButton}
                  >
                    <ArrowDownIcon className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      change(selected.filter((s) => s.id !== t.id))
                    }
                    aria-label={`Ta bort ${t.title}`}
                    className={`${iconButton} hover:text-red-text`}
                  >
                    <CloseIcon className="h-5 w-5" />
                  </button>
                </span>
              </li>
            ))}
          </ol>
        )}

        {error && (
          <p role="alert" className="text-sm text-red-text">
            {error}
          </p>
        )}
        <button
          type="button"
          onClick={save}
          disabled={isPending || saved}
          className={`${buttonSecondary} w-full`}
        >
          {isPending ? "Sparar…" : saved ? "Ordningen är sparad" : "Spara ordning"}
        </button>
      </section>

      {/* Archive to add from */}
      <section className="space-y-3">
        <h3 className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">
          Lägg till från arkivet
        </h3>
        <div className="relative">
          <label htmlFor={`picker-search-${sessionId}`} className="sr-only">
            Sök i arkivet
          </label>
          <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" />
          <input
            id={`picker-search-${sessionId}`}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Sök teknik…"
            className={`${input} pl-12`}
          />
        </div>
        <ul className="max-h-80 overflow-y-auto border-t border-line">
          {available.length === 0 && (
            <li className="py-3 text-muted">
              {allTechniques.length === 0
                ? "Inga tekniker i arkivet än."
                : "Inga fler tekniker att lägga till."}
            </li>
          )}
          {available.map((t) => (
            <li
              key={t.id}
              className="flex min-h-[64px] items-center gap-3 border-b border-line py-2"
            >
              <span className="min-w-0 flex-1">
                <span className="block font-semibold">{t.title}</span>
                <span className={meta}>{categoryLabels[t.category]}</span>
              </span>
              <button
                type="button"
                onClick={() => change([...selected, t])}
                aria-label={`Lägg till ${t.title}`}
                className={iconButton}
              >
                <PlusIcon className="h-5 w-5" />
              </button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
