"use client";

import { useState } from "react";
import { categoryLabels } from "@/features/techniques/labels";
import type { Technique } from "@/features/techniques/queries";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  CloseIcon,
  PlusIcon,
  SearchIcon,
} from "@/components/icons";
import { iconButton, input, meta } from "@/components/ui";

interface TechniquePickerProps {
  idPrefix: string;
  allTechniques: Technique[];
  selected: Technique[];
  onChange: (next: Technique[]) => void;
}

// Lets a coach build the ordered video list for a session.
// Controlled: the parent SessionEditor owns the list and saves it together
// with the rest of the pass. Reorder uses up/down buttons on purpose —
// drag-and-drop is unreliable on phones (DESIGN.md).
export function TechniquePicker({
  idPrefix,
  allTechniques,
  selected,
  onChange,
}: TechniquePickerProps) {
  const [query, setQuery] = useState("");

  const selectedIds = new Set(selected.map((t) => t.id));
  const q = query.trim().toLowerCase();
  const available = allTechniques.filter(
    (t) => !selectedIds.has(t.id) && (!q || t.title.toLowerCase().includes(q))
  );

  function move(index: number, delta: -1 | 1) {
    const target = index + delta;
    if (target < 0 || target >= selected.length) return;
    const next = [...selected];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  }

  return (
    <div className="space-y-6">
      {/* Current order */}
      <section className="space-y-2">
        <h3 className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">
          Videor i passet ({selected.length})
        </h3>
        <p className={meta}>
          Medlemmarna ser dem i den här ordningen – för att förbereda sig eller
          ta igen ett missat pass.
        </p>
        {selected.length === 0 ? (
          <p className="py-2 text-muted">Lägg till videor från arkivet nedan.</p>
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
                    onClick={() => onChange(selected.filter((s) => s.id !== t.id))}
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
      </section>

      {/* Archive to add from */}
      <section className="space-y-3">
        <h3 className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">
          Lägg till från arkivet
        </h3>
        <div className="relative">
          <label htmlFor={`${idPrefix}-search`} className="sr-only">
            Sök i arkivet
          </label>
          <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" />
          <input
            id={`${idPrefix}-search`}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            // The picker sits inside the pass form; Enter here should only
            // search, not submit the whole pass.
            onKeyDown={(e) => {
              if (e.key === "Enter") e.preventDefault();
            }}
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
                onClick={() => onChange([...selected, t])}
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
