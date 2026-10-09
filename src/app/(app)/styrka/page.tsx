import Link from "next/link";
import { requireActiveProfile } from "@/lib/auth";
import {
  getProgram,
  getProgramWeeks,
  getMemberPeakStart,
  type StrengthWeek,
} from "@/features/strength/queries";
import { currentBaseWeek, currentPeakWeek } from "@/features/strength/weekCalc";
import {
  CancelPeakButton,
  PeakStartForm,
} from "@/features/strength/PeakStartForm";
import { formatDayLabel } from "@/lib/date";
import { todayIso } from "@/lib/today";

interface PageProps {
  searchParams: Promise<{ flik?: string }>;
}

// Base and peak are shown separately (CLAUDE.md), as two tabs.
// The tab is a URL param so it works without client JS and survives refresh.
export default async function StyrkaMemberPage({ searchParams }: PageProps) {
  const [{ flik }, profile] = await Promise.all([
    searchParams,
    requireActiveProfile(),
  ]);
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

      {tab === "grund" ? <BaseTab /> : <PeakTab memberId={profile.id} />}
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

async function PeakTab({ memberId }: { memberId: string }) {
  const [program, startDate, today] = await Promise.all([
    getProgram("peak"),
    getMemberPeakStart(memberId),
    todayIso(),
  ]);

  if (!program) {
    return (
      <p className="text-muted">Toppningsprogrammet är inte publicerat än.</p>
    );
  }

  // Not started: explain and offer the start form.
  if (!startDate) {
    return (
      <section className="space-y-5">
        <p className="text-text-soft">
          Ett {program.total_weeks} veckors program inför tävling. Du kan hoppa
          på när som helst — det körs vid sidan av grundprogrammet.
        </p>
        <PeakStartForm />
      </section>
    );
  }

  // Start date chosen but still in the future.
  if (startDate > today) {
    return (
      <section className="space-y-5">
        <p className="text-text-soft">
          Toppningen startar {formatDayLabel(startDate)}.
        </p>
        <CancelPeakButton />
      </section>
    );
  }

  const weekNumber = currentPeakWeek(startDate, program.total_weeks);

  // Past the last week: finished, allow a restart.
  if (weekNumber === null) {
    return (
      <section className="space-y-5">
        <p className="text-text-soft">
          Programmet är avslutat. Välj ett nytt startdatum om du vill köra det
          igen.
        </p>
        <PeakStartForm />
      </section>
    );
  }

  const weeks = await getProgramWeeks(program.id);
  const week = weeks.find((w) => w.week_number === weekNumber);

  return (
    <section className="space-y-5">
      <div className="space-y-3">
        <p className="eyebrow">
          Vecka {weekNumber} av {program.total_weeks}
        </p>
        <PeakProgress current={weekNumber} total={program.total_weeks} />
      </div>
      <WeekContent week={week} />
      <CancelPeakButton />
    </section>
  );
}

// DESIGN.md "Progress": past = faint, current = red, future = line.
function PeakProgress({ current, total }: { current: number; total: number }) {
  return (
    <div
      role="progressbar"
      aria-label="Vecka i toppningsprogrammet"
      aria-valuemin={1}
      aria-valuemax={total}
      aria-valuenow={current}
      className="flex gap-1.5"
    >
      {Array.from({ length: total }, (_, i) => {
        const n = i + 1;
        const color =
          n < current ? "bg-faint" : n === current ? "bg-red" : "bg-line";
        return <span key={n} className={`h-2 flex-1 rounded-full ${color}`} />;
      })}
    </div>
  );
}

function WeekContent({ week }: { week: StrengthWeek | undefined }) {
  if (!week) {
    return <p className="text-muted">Inget innehåll för denna vecka.</p>;
  }
  return (
    <div className="space-y-3">
      <h2 className="section-title">{week.title}</h2>
      <p className="whitespace-pre-line text-text-soft">{week.content}</p>
    </div>
  );
}
