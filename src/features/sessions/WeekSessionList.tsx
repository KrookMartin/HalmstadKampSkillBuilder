import Link from "next/link";
import { ChevronRightIcon } from "@/components/icons";
import { listRow, meta, tag } from "@/components/ui";
import { formatDayLabel } from "@/lib/date";
import type { SessionWithTechniques } from "./queries";

interface WeekSessionListProps {
  sessions: SessionWithTechniques[];
  today: string;
}

// Compact list of a week's passes for members; each row opens /pass/[id].
export function WeekSessionList({ sessions, today }: WeekSessionListProps) {
  if (sessions.length === 0) {
    return <p className="text-muted">Inga publicerade pass den här veckan.</p>;
  }

  return (
    <ul className="border-t border-line">
      {sessions.map((s) => (
        <li key={s.id}>
          <Link
            href={`/pass/${s.id}`}
            className={`${listRow} focus-visible:outline-2 focus-visible:outline-red-text`}
          >
            <span className="min-w-0 flex-1 space-y-1">
              <span className="flex items-center gap-2 text-[13px] capitalize text-muted">
                {formatDayLabel(s.session_date)} · {s.time_slot.slice(0, 5)}
                {s.session_date === today && <span className={tag}>Idag</span>}
              </span>
              <span className="block text-[17px] font-semibold">{s.class_type}</span>
              <span className={meta}>
                {s.techniques.length === 1 ? "1 video" : `${s.techniques.length} videor`}
              </span>
            </span>
            <ChevronRightIcon className="h-6 w-6 shrink-0 text-muted" />
          </Link>
        </li>
      ))}
    </ul>
  );
}
