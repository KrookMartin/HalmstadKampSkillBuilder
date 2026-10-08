import { Suspense } from "react";
import { getTechniques } from "@/features/techniques/queries";
import { TechniqueCard } from "@/features/techniques/TechniqueCard";
import { TechniqueFilters } from "@/features/techniques/TechniqueFilters";
import type { TechniqueCategory, TechniqueLevel } from "@/lib/supabase/types";

interface PageProps {
  searchParams: Promise<{
    category?: string;
    level?: string;
    search?: string;
  }>;
}

export default async function TechnikerMemberPage({ searchParams }: PageProps) {
  const filters = await searchParams;
  const techniques = await getTechniques({
    category: filters.category as TechniqueCategory | undefined,
    level: filters.level as TechniqueLevel | undefined,
    search: filters.search,
  });

  return (
    <main className="mx-auto max-w-2xl space-y-4 px-4 py-6">
      <h1 className="text-2xl font-bold text-gray-900">Teknikarkiv</h1>

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
              <TechniqueCard technique={t} />
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
