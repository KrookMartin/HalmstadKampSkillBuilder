import Link from "next/link";
import { ChevronLeftIcon, ChevronRightIcon } from "@/components/icons";
import { iconButton, meta } from "@/components/ui";
import {
  addDays,
  formatWeekRange,
  isoWeekNumber,
  weekStart,
  type MonthEntry,
} from "@/lib/week";

interface WeekNavProps {
  monday: string;
  today: string;
  basePath: string; // e.g. "/idag" — the week is added as ?vecka=
  months: MonthEntry[];
}

// ‹ Vecka 43 · 19–25 okt ›  plus "Idag" and "Hoppa till månad".
// Plain links (no client JS): the week lives in the URL, so the browser's
// back button and shared links work.
export function WeekNav({ monday, today, basePath, months }: WeekNavProps) {
  const thisWeek = weekStart(today);
  const href = (week: string) =>
    week === thisWeek ? basePath : `${basePath}?vecka=${week}`;
  // scroll={false}: stay at the week list instead of jumping to the top.
  const linkProps = { scroll: false } as const;

  return (
    <nav aria-label="Välj vecka" className="space-y-3">
      <div className="flex items-center gap-2">
        <Link
          {...linkProps}
          href={href(addDays(monday, -7))}
          aria-label="Föregående vecka"
          className={iconButton}
        >
          <ChevronLeftIcon className="h-5 w-5" />
        </Link>
        <p className="min-w-0 flex-1 text-center">
          <span className="block font-display text-xl font-bold uppercase">
            Vecka {isoWeekNumber(monday)}
          </span>
          <span className={meta}>{formatWeekRange(monday)}</span>
        </p>
        <Link
          {...linkProps}
          href={href(addDays(monday, 7))}
          aria-label="Nästa vecka"
          className={iconButton}
        >
          <ChevronRightIcon className="h-5 w-5" />
        </Link>
      </div>

      <div className="flex items-start justify-center gap-2">
        {monday !== thisWeek && (
          <Link
            {...linkProps}
            href={basePath}
            className="flex min-h-[44px] items-center rounded-full border border-line-strong px-4 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-red-text"
          >
            Idag
          </Link>
        )}
        {months.length > 0 && (
          // key resets the open state after picking a month.
          <details key={monday} className="group relative">
            <summary className="flex min-h-[44px] cursor-pointer list-none items-center gap-1 rounded-full border border-line-strong px-4 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-red-text [&::-webkit-details-marker]:hidden">
              Hoppa till månad
              <ChevronRightIcon className="h-4 w-4 rotate-90 transition-transform group-open:-rotate-90" />
            </summary>
            <ul className="absolute left-1/2 z-10 mt-2 max-h-72 w-60 -translate-x-1/2 overflow-y-auto rounded-card border border-line-strong bg-surface py-1 shadow-lg">
              {months.map((m) => (
                <li key={m.key}>
                  <Link
                    {...linkProps}
                    href={href(m.firstWeek)}
                    className="flex min-h-[44px] items-center justify-between px-4 capitalize hover:bg-surface-2 focus-visible:outline-2 focus-visible:outline-red-text"
                  >
                    {m.label}
                    <span className={meta}>{m.count} pass</span>
                  </Link>
                </li>
              ))}
            </ul>
          </details>
        )}
      </div>
    </nav>
  );
}
