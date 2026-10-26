import {
  getSessionDates,
  getSessionsForDate,
  getSessionsInRange,
} from "@/features/sessions/queries";
import { SessionView } from "@/features/sessions/SessionView";
import { WeekNav } from "@/features/sessions/WeekNav";
import { WeekSessionList } from "@/features/sessions/WeekSessionList";
import { formatDayLabel } from "@/lib/date";
import { todayIso } from "@/lib/today";
import { addDays, groupByMonth, parseWeekParam } from "@/lib/week";

interface PageProps {
  searchParams: Promise<{ vecka?: string }>;
}

// Today's pass(es) in full, then "Veckans pass" to browse other weeks
// (?vecka=<monday>) so members can prepare or catch up on a missed class.
export default async function IdagPage({ searchParams }: PageProps) {
  const [{ vecka }, today] = await Promise.all([searchParams, todayIso()]);
  const monday = parseWeekParam(vecka, today);
  const [todaySessions, weekSessions, dates] = await Promise.all([
    getSessionsForDate(today),
    getSessionsInRange(monday, addDays(monday, 6)),
    getSessionDates(),
  ]);

  return (
    <div className="space-y-12">
      {todaySessions.length === 0 && (
        <header className="space-y-3">
          <p className="eyebrow">{formatDayLabel(today)}</p>
          <h1 className="page-title text-[68px]">Idag</h1>
          <p className="text-muted">Inget pass publicerat för idag.</p>
        </header>
      )}

      {todaySessions.map((session) => (
        <SessionView key={session.id} session={session} fran="idag" />
      ))}

      <section className="space-y-4 border-t border-line pt-8">
        <h2 className="section-title">Veckans pass</h2>
        <WeekNav
          monday={monday}
          today={today}
          basePath="/idag"
          months={groupByMonth(dates)}
        />
        <WeekSessionList sessions={weekSessions} today={today} />
      </section>
    </div>
  );
}
