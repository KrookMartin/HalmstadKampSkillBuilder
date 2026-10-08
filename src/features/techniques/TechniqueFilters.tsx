"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useTransition } from "react";
import { categories, levels } from "./labels";

// Filter bar that updates URL search params so filters survive page refresh
// and are shareable. Uses the router instead of form submission so there's
// no full page reload on mobile.
export function TechniqueFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [, startTransition] = useTransition();

  function update(key: string, value: string) {
    const next = new URLSearchParams(params.toString());
    if (value) {
      next.set(key, value);
    } else {
      next.delete(key);
    }
    startTransition(() => {
      router.replace(`${pathname}?${next.toString()}`);
    });
  }

  return (
    <div className="flex flex-wrap gap-2">
      <select
        value={params.get("category") ?? ""}
        onChange={(e) => update("category", e.target.value)}
        className="min-h-[44px] rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
        aria-label="Filtrera kategori"
      >
        <option value="">Alla kategorier</option>
        {categories.map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>

      <select
        value={params.get("level") ?? ""}
        onChange={(e) => update("level", e.target.value)}
        className="min-h-[44px] rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
        aria-label="Filtrera nivå"
      >
        <option value="">Alla nivåer</option>
        {levels.map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>

      <input
        type="search"
        value={params.get("search") ?? ""}
        onChange={(e) => update("search", e.target.value)}
        placeholder="Sök teknik…"
        className="min-h-[44px] min-w-[160px] flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
        aria-label="Sök teknik"
      />
    </div>
  );
}
