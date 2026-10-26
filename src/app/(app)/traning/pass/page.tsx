import { requireRole } from "@/lib/auth";
import { getSessionDates, getSessionsInRange } from "@/features/sessions/queries";
import { getTechniques } from "@/features/techniques/queries";
import { SessionEditor } from "@/features/sessions/SessionEditor";
import { PublishToggle } from "@/features/sessions/PublishToggle";
import { WeekNav } from "@/features/sessions/WeekNav";
import { ChevronRightIcon, PlusIcon } from "@/components/icons";
import { tag } from "@/components/ui";
import { formatDayLabel } from "@/lib/date";
import { todayIso } from "@/lib/today";
import { addDays, groupByMonth, parseWeekParam } from "@/lib/week";

interface PageProps {
  searchParams: Promise<{ vecka?: string }>;
}

// Passbyggare.
// Shows one week at a time (?vecka=<monday>) so the list stays short as the
// archive grows. Each session is a <details> so the coach expands only the
// one they're building.
export default async function PassCoachPage({ searchParams }: PageProps) {
  // Also checked in traning/layout.tsx; layouts don't always re-run on
  // client navigation, so pages check too.
  await requireRole(["coach", "admin"]);
  const [{ vecka }, today] = await Promise.all([searchParams, todayIso()]);
  const monday = parseWeekParam(vecka, today);
  const [sessions, allTechniques, dates] = await Promise.all([
    getSessionsInRange(monday, addDays(monday, 6)),
    getTechniques(),
    getSessionDates(),
  ]);

  return (
    <div className="space-y-8">
      <header className="space-y-3">
        <p className="eyebrow">Passbyggare</p>
        <h1 className="page-title">Pass</h1>
      </header>

      <details className="group rounded-card border border-line-strong">
        <summary className="flex min-h-[54px] cursor-pointer list-none items-center gap-2 px-4 font-semibold focus-visible:outline-2 focus-visible:outline-red-text [&::-webkit-details-marker]:hidden">
          <PlusIcon className="h-5 w-5 text-red-text" />
          Nytt pass
        </summary>
        <div className="border-t border-line p-4">
          <SessionEditor allTechniques={allTechniques} />
        </div>
      </details>

      <WeekNav
        monday={monday}
        today={today}
        basePath="/traning/pass"
        months={groupByMonth(dates)}
      />

      {sessions.length === 0 ? (
        <p className="text-muted">Inga pass den här veckan.</p>
      ) : (
        <ul className="border-t border-line">
          {sessions.map((s) => (
            <li key={s.id} className="border-b border-line">
              <details className="group">
                <summary className="flex min-h-[80px] cursor-pointer list-none items-center gap-4 py-3 focus-visible:outline-2 focus-visible:outline-red-text [&::-webkit-details-marker]:hidden">
                  <span className="min-w-0 flex-1 space-y-1">
                    <span className="block text-[13px] capitalize text-muted">
                      {formatDayLabel(s.session_date)} · {s.time_slot.slice(0, 5)}
                    </span>
                    <span className="block text-[17px] font-semibold">
                      {s.class_type}
                    </span>
                    <span
                      className={
                        s.published
                          ? "inline-flex rounded-full bg-red px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-white"
                          : tag
                      }
                    >
                      {s.published ? "Publicerat" : "Utkast"}
                    </span>
                  </span>
                  <ChevronRightIcon className="h-6 w-6 shrink-0 text-muted transition-transform group-open:rotate-90" />
                </summary>

                <div className="space-y-6 pb-6 pt-2">
                  <SessionEditor existing={s} allTechniques={allTechniques} />
                  <PublishToggle sessionId={s.id} published={s.published} />
                </div>
              </details>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
