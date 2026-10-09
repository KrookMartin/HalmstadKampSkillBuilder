import Link from "next/link";
import { getSessionsForDate } from "@/features/sessions/queries";
import { categoryLabels, levelLabels } from "@/features/techniques/labels";
import { PlayIcon } from "@/components/icons";
import { card, listRow, meta } from "@/components/ui";
import { formatDayLabel } from "@/lib/date";
import { todayIso } from "@/lib/today";

export default async function IdagPage() {
  const today = await todayIso();
  const sessions = await getSessionsForDate(today);

  return (
    <div className="space-y-12">
      {sessions.length === 0 && (
        <header className="space-y-3">
          <p className="eyebrow">{formatDayLabel(today)}</p>
          <h1 className="page-title text-[68px]">Idag</h1>
          <p className="text-muted">Inget pass publicerat för idag.</p>
        </header>
      )}

      {sessions.map((session) => (
        <article key={session.id} className="space-y-6">
          <header className="space-y-3">
            <p className="eyebrow">
              {formatDayLabel(today)} · {session.time_slot.slice(0, 5)}
            </p>
            <h1 className="page-title text-[68px]">{session.class_type}</h1>
          </header>

          {session.notes && (
            <section className={card}>
              <h2 className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-muted">
                Tränarens fokus
              </h2>
              <p className="whitespace-pre-line text-text-soft">
                {session.notes}
              </p>
            </section>
          )}

          {session.techniques.length === 0 ? (
            <p className="text-muted">Inga tekniker i detta pass.</p>
          ) : (
            <ol className="border-t border-line">
              {session.techniques.map((t, i) => (
                <li key={t.id}>
                  {/* The whole row is the link, so the tap target is large. */}
                  <Link
                    href={`/tekniker/${t.id}?fran=idag`}
                    className={`${listRow} group focus-visible:outline-2 focus-visible:outline-red-text`}
                  >
                    <span className="w-9 shrink-0 font-display text-[32px] font-bold leading-none text-faint">
                      {i + 1}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[17px] font-semibold">
                        {t.title}
                      </span>
                      <span className={meta}>
                        {categoryLabels[t.category]} · {levelLabels[t.level]}
                      </span>
                    </span>
                    <span
                      aria-hidden="true"
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-red text-white group-hover:brightness-110"
                    >
                      <PlayIcon className="h-5 w-5" />
                    </span>
                  </Link>
                </li>
              ))}
            </ol>
          )}
        </article>
      ))}
    </div>
  );
}
