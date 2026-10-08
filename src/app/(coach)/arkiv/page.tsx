import { Suspense } from "react";
import { getTechniques } from "@/features/techniques/queries";
import { TechniqueCard } from "@/features/techniques/TechniqueCard";
import { TechniqueForm } from "@/features/techniques/TechniqueForm";
import { TechniqueFilters } from "@/features/techniques/TechniqueFilters";
import type { TechniqueCategory, TechniqueLevel } from "@/lib/supabase/types";

interface PageProps {
  searchParams: Promise<{
    category?: string;
    level?: string;
    search?: string;
  }>;
}

export default async function ArkivCoachPage({ searchParams }: PageProps) {
  const filters = await searchParams;
  const techniques = await getTechniques({
    category: filters.category as TechniqueCategory | undefined,
    level: filters.level as TechniqueLevel | undefined,
    search: filters.search,
  });

  return (
    <main className="mx-auto max-w-2xl space-y-6 px-4 py-6">
      <h1 className="text-2xl font-bold text-gray-900">Teknikarkiv</h1>

      {/* Add new technique */}
      <section className="rounded-xl border border-gray-200 bg-white p-4">
        <h2 className="mb-4 text-base font-semibold text-gray-900">
          Lägg till teknik
        </h2>
        <TechniqueForm />
      </section>

      {/* Filter + list */}
      <section className="space-y-3">
        <Suspense>
          <TechniqueFilters />
        </Suspense>

        {techniques.length === 0 ? (
          <p className="py-8 text-center text-sm text-gray-400">
            Inga tekniker matchar filtret.
          </p>
        ) : (
          <ul className="space-y-2">
            {techniques.map((t) => (
              <li key={t.id}>
                <TechniqueCard technique={t} canEdit />
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
