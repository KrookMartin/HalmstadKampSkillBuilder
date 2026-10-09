import Link from "next/link";
import { notFound } from "next/navigation";
import { getTechniqueById } from "@/features/techniques/queries";
import { categoryLabels, levelLabels } from "@/features/techniques/labels";
import { YoutubeEmbed } from "@/components/YoutubeEmbed";
import { ChevronLeftIcon } from "@/components/icons";
import { card, tag } from "@/components/ui";

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ fran?: string }>;
}

// "Teknik och video". Opened from both Idag and Tekniker; `?fran=idag`
// tells the back link where to return to.
export default async function TeknikPage({ params, searchParams }: PageProps) {
  const [{ id }, { fran }] = await Promise.all([params, searchParams]);
  const technique = await getTechniqueById(id);
  if (!technique) notFound();

  const back =
    fran === "idag"
      ? { href: "/idag", label: "Idag" }
      : { href: "/tekniker", label: "Tekniker" };

  return (
    <div className="space-y-6">
      <Link
        href={back.href}
        className="-ml-2 inline-flex min-h-[44px] items-center gap-1 rounded-control pr-3 text-sm font-semibold text-muted hover:text-text focus-visible:outline-2 focus-visible:outline-red-text"
      >
        <ChevronLeftIcon className="h-5 w-5" />
        {back.label}
      </Link>

      <header className="space-y-3">
        <p className="eyebrow">{categoryLabels[technique.category]}</p>
        <h1 className="page-title">{technique.title}</h1>
        <span className={tag}>{levelLabels[technique.level]}</span>
      </header>

      <YoutubeEmbed url={technique.youtube_url} title={technique.title} />

      {technique.notes && (
        <section className={card}>
          <h2 className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-muted">
            Att tänka på
          </h2>
          <p className="whitespace-pre-line text-text-soft">
            {technique.notes}
          </p>
        </section>
      )}
    </div>
  );
}
