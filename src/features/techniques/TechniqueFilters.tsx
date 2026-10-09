"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useTransition } from "react";
import { SearchIcon } from "@/components/icons";
import { chip, input } from "@/components/ui";
import { categories } from "./labels";

// Search + position (category) filter. State lives in the URL so filters
// survive refresh and the back button. Uses the router instead of form
// submission so there's no full page reload on mobile.
export function TechniqueFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [, startTransition] = useTransition();
  const activeCategory = params.get("category") ?? "";

  function update(key: string, value: string) {
    const next = new URLSearchParams(params.toString());
    if (value) {
      next.set(key, value);
    } else {
      next.delete(key);
    }
    startTransition(() => {
      router.replace(`${pathname}?${next.toString()}`, { scroll: false });
    });
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <label htmlFor="technique-search" className="sr-only">
          Sök teknik
        </label>
        <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" />
        <input
          id="technique-search"
          type="search"
          defaultValue={params.get("search") ?? ""}
          onChange={(e) => update("search", e.target.value)}
          placeholder="Sök teknik…"
          className={`${input} pl-12`}
        />
      </div>

      {/* Horizontal scroll on narrow screens instead of wrapping to 3 rows. */}
      <div
        role="group"
        aria-label="Filtrera på position"
        className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1"
      >
        <button
          type="button"
          aria-pressed={activeCategory === ""}
          onClick={() => update("category", "")}
          className={chip(activeCategory === "")}
        >
          Alla
        </button>
        {categories.map(([value, label]) => (
          <button
            key={value}
            type="button"
            aria-pressed={activeCategory === value}
            onClick={() => update("category", value)}
            className={chip(activeCategory === value)}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
