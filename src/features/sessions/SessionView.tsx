import Link from "next/link";
import { categoryLabels, levelLabels } from "@/features/techniques/labels";
import { PlayIcon } from "@/components/icons";
import { card, listRow, meta } from "@/components/ui";
import { formatDayLabel } from "@/lib/date";
import type { SessionWithTechniques } from "./queries";

interface SessionViewProps {
  session: SessionWithTechniques;
  // Passed on to the technique page so its back link returns here.
  fran: string;
}

// A published pass as members see it: header, coach notes, ordered videos.
// Used by /idag (today) and /pass/[id] (any other day).
export function SessionView({ session, fran }: SessionViewProps) {
  return (
    <article className="space-y-6">
      <header className="space-y-3">
        <p className="eyebrow">
          {formatDayLabel(session.session_date)} · {session.time_slot.slice(0, 5)}
        </p>
        <h1 className="page-title text-[68px]">{session.class_type}</h1>
      </header>

      {session.notes && (
        <section className={card}>
          <h2 className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-muted">
            Tränarens fokus
          </h2>
          <p className="whitespace-pre-line text-text-soft">{session.notes}</p>
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
                href={`/tekniker/${t.id}?fran=${fran}`}
                className={`${listRow} group focus-visible:outline-2 focus-visible:outline-red-text`}
              >
                <span className="w-9 shrink-0 font-display text-[32px] font-bold leading-none text-faint">
                  {i + 1}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[17px] font-semibold">{t.title}</span>
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
  );
}
