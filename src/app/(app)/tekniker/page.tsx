import { Suspense } from "react";
import Link from "next/link";
import { getTechniques } from "@/features/techniques/queries";
import { TechniqueFilters } from "@/features/techniques/TechniqueFilters";
import { categoryLabels, levelLabels } from "@/features/techniques/labels";
import { ChevronRightIcon } from "@/components/icons";
import { listRow, meta } from "@/components/ui";
import type { TechniqueCategory } from "@/lib/supabase/types";

interface PageProps {
  searchParams: Promise<{
    category?: string;
    search?: string;
  }>;
}

export default async function TeknikerMemberPage({ searchParams }: PageProps) {
  const filters = await searchParams;
  const techniques = await getTechniques({
    category: filters.category as TechniqueCategory | undefined,
    search: filters.search,
  });

  return (
    <div className="space-y-6">
      <header className="space-y-3">
        <p className="eyebrow">Teknikarkiv</p>
        <h1 className="page-title">Tekniker</h1>
      </header>

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
              <Link
                href={`/tekniker/${t.id}`}
                className={`${listRow} focus-visible:outline-2 focus-visible:outline-red-text`}
              >
                <span className="min-w-0 flex-1">
                  <span className="block text-[17px] font-semibold">
                    {t.title}
                  </span>
                  <span className={meta}>
                    {categoryLabels[t.category]} · {levelLabels[t.level]}
                  </span>
                </span>
                <ChevronRightIcon className="h-6 w-6 shrink-0 text-muted" />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
