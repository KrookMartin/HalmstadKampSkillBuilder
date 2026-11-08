import Link from "next/link";
import { getProgram, getProgramWeeks } from "@/features/strength/queries";
import { WeekContent } from "@/features/strength/WeekContent";

interface PageProps {
  searchParams: Promise<{ flik?: string; vecka?: string }>;
}

// Base and peak are shown separately (CLAUDE.md), as two tabs.
// The tab is a URL param so it works without client JS and survives refresh.
export default async function StyrkaMemberPage({ searchParams }: PageProps) {
  const { flik, vecka } = await searchParams;
  const tab = flik === "toppning" ? "toppning" : "grund";

  return (
    <div className="space-y-6">
      <header className="space-y-3">
        <p className="eyebrow">Styrka &amp; kondition</p>
        <h1 className="page-title">Styrka</h1>
      </header>

      <nav
        aria-label="Program"
        className="grid grid-cols-2 gap-1 rounded-control bg-surface p-1"
      >
        <TabLink href="/styrka?flik=grund" active={tab === "grund"}>
          Grundprogram
        </TabLink>
        <TabLink href="/styrka?flik=toppning" active={tab === "toppning"}>
          Comp prep
        </TabLink>
      </nav>

      {/* key: reset when switching program so ?vecka doesn't carry over oddly */}
      <ProgramTab
        key={tab}
        type={tab === "grund" ? "base" : "peak"}
        flik={tab}
        vecka={vecka}
      />
    </div>
  );
}

function TabLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`flex min-h-[44px] items-center justify-center rounded-[8px] text-sm font-semibold focus-visible:outline-2 focus-visible:outline-red-text ${
        active ? "bg-surface-2 text-text" : "text-muted hover:text-text-soft"
      }`}
    >
      {children}
    </Link>
  );
}

// Both programs are static: the member picks a week themselves (?vecka=N),
// defaulting to week 1. No start dates, no "current week" calculation.
async function ProgramTab({
  type,
  flik,
  vecka,
}: {
  type: "base" | "peak";
  flik: string;
  vecka: string | undefined;
}) {
  const program = await getProgram(type);
  const weeks = program ? await getProgramWeeks(program.id) : [];
  if (!program || weeks.length === 0) {
    return <p className="text-muted">Programmet är inte publicerat än.</p>;
  }

  const selected =
    weeks.find((w) => String(w.week_number) === vecka) ?? weeks[0];

  return (
    <section className="space-y-5">
      {program.description && (
        <p className="text-text-soft">{program.description}</p>
      )}
      <nav aria-label="Vecka" className="flex flex-wrap gap-2">
        {weeks.map((w) => {
          const active = w.id === selected.id;
          return (
            <Link
              key={w.id}
              href={`/styrka?flik=${flik}&vecka=${w.week_number}`}
              aria-current={active ? "page" : undefined}
              className={`flex min-h-[44px] items-center rounded-control px-4 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-red-text ${
                active
                  ? "bg-red text-white"
                  : "bg-surface text-text-soft hover:text-text"
              }`}
            >
              Vecka {w.week_number}
            </Link>
          );
        })}
      </nav>
      <WeekContent week={selected} />
    </section>
  );
}
