import { requireRole } from "@/lib/auth";
import { Suspense } from "react";
import { getTechniques } from "@/features/techniques/queries";
import { TechniqueCard } from "@/features/techniques/TechniqueCard";
import { TechniqueForm } from "@/features/techniques/TechniqueForm";
import { TechniqueFilters } from "@/features/techniques/TechniqueFilters";
import { PlusIcon } from "@/components/icons";
import type { TechniqueCategory } from "@/lib/supabase/types";

interface PageProps {
  searchParams: Promise<{
    category?: string;
    search?: string;
  }>;
}

// Coach technique editor.
export default async function ArkivCoachPage({ searchParams }: PageProps) {
  // Also checked in traning/layout.tsx; layouts don't always re-run on
  // client navigation, so pages check too.
  await requireRole(["coach", "admin"]);
  const filters = await searchParams;
  const techniques = await getTechniques({
    category: filters.category as TechniqueCategory | undefined,
    search: filters.search,
  });

  return (
    <div className="space-y-8">
      <header className="space-y-3">
        <p className="eyebrow">Teknikarkiv</p>
        <h1 className="page-title">Arkiv</h1>
      </header>

      <details className="rounded-card border border-line-strong">
        <summary className="flex min-h-[54px] cursor-pointer list-none items-center gap-2 px-4 font-semibold focus-visible:outline-2 focus-visible:outline-red-text [&::-webkit-details-marker]:hidden">
          <PlusIcon className="h-5 w-5 text-red-text" />
          Lägg till teknik
        </summary>
        <div className="border-t border-line p-4">
          <TechniqueForm />
        </div>
      </details>

      <section className="space-y-4">
        <Suspense>
          <TechniqueFilters />
        </Suspense>

        {techniques.length === 0 ? (
          <p className="py-8 text-center text-muted">
            Inga tekniker matchar filtret.
          </p>
        ) : (
          <ul className="border-t border-line">
            {techniques.map((t) => (
              <li key={t.id}>
                <TechniqueCard technique={t} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
