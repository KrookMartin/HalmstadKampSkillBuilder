import { requireRole } from "@/lib/auth";
import { getAllSessions } from "@/features/sessions/queries";
import { getTechniques } from "@/features/techniques/queries";
import { SessionForm } from "@/features/sessions/SessionForm";
import { PublishToggle } from "@/features/sessions/PublishToggle";
import { TechniquePicker } from "@/features/sessions/TechniquePicker";
import { ChevronRightIcon, PlusIcon } from "@/components/icons";
import { tag } from "@/components/ui";
import { formatDayLabel } from "@/lib/date";

// Passbyggare.
// Each session is a <details> so the list stays short on a phone and the
// coach expands only the one they're building.
export default async function PassCoachPage() {
  // Also checked in traning/layout.tsx; layouts don't always re-run on
  // client navigation, so pages check too.
  await requireRole(["coach", "admin"]);
  const [sessions, allTechniques] = await Promise.all([
    getAllSessions(),
    getTechniques(),
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
          <SessionForm />
        </div>
      </details>

      {sessions.length === 0 ? (
        <p className="text-muted">Inga pass skapade än.</p>
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
                  {s.notes && (
                    <p className="whitespace-pre-line text-text-soft">
                      {s.notes}
                    </p>
                  )}
                  <TechniquePicker
                    sessionId={s.id}
                    allTechniques={allTechniques}
                    initialSelected={s.techniques}
                  />
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
