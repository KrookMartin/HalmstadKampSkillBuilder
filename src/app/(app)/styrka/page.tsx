import Link from "next/link";
import { getProgram, getProgramWeeks } from "@/features/strength/queries";
import { currentBaseWeek } from "@/features/strength/weekCalc";
import { PeakTracker } from "@/features/strength/PeakTracker";
import { WeekContent } from "@/features/strength/WeekContent";

interface PageProps {
  searchParams: Promise<{ flik?: string }>;
}

// Base and peak are shown separately (CLAUDE.md), as two tabs.
// The tab is a URL param so it works without client JS and survives refresh.
export default async function StyrkaMemberPage({ searchParams }: PageProps) {
  const { flik } = await searchParams;
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
        <TabLink href="/styrka" active={tab === "grund"}>
          Grundprogram
        </TabLink>
        <TabLink href="/styrka?flik=toppning" active={tab === "toppning"}>
          Toppning
        </TabLink>
      </nav>

      {tab === "grund" ? <BaseTab /> : <PeakTab />}
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

async function BaseTab() {
  const program = await getProgram("base");
  if (!program) {
    return <p className="text-muted">Grundprogrammet är inte publicerat än.</p>;
  }

  const weeks = await getProgramWeeks(program.id);
  const weekNumber = currentBaseWeek(program.total_weeks);
  const week = weeks.find((w) => w.week_number === weekNumber);

  return (
    <section className="space-y-4">
      <p className="eyebrow">
        Vecka {weekNumber} av {program.total_weeks}
      </p>
      <WeekContent week={week} />
    </section>
  );
}

// Program content is fetched here; which week the member is on depends on a
// start date stored in their browser, so PeakTracker works that out client-side.
async function PeakTab() {
  const program = await getProgram("peak");
  if (!program) {
    return (
      <p className="text-muted">Toppningsprogrammet är inte publicerat än.</p>
    );
  }

  const weeks = await getProgramWeeks(program.id);
  return <PeakTracker totalWeeks={program.total_weeks} weeks={weeks} />;
}
