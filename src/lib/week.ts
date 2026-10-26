// Week helpers for browsing sessions. Weeks run Monday–Sunday (Swedish
// standard) and are identified by their Monday as YYYY-MM-DD, e.g. the
// URL param `?vecka=2026-10-19`.
//
// All math is done on UTC noon of the ISO date, so daylight saving changes
// can't shift a date by one.

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

function toDate(iso: string): Date {
  return new Date(`${iso}T12:00:00Z`);
}

function toIso(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function addDays(iso: string, days: number): string {
  const d = toDate(iso);
  d.setUTCDate(d.getUTCDate() + days);
  return toIso(d);
}

// Monday of the week containing `iso`.
export function weekStart(iso: string): string {
  const day = toDate(iso).getUTCDay(); // 0 = Sunday
  return addDays(iso, day === 0 ? -6 : 1 - day);
}

// ISO 8601 week number (the one used in Swedish calendars).
export function isoWeekNumber(iso: string): number {
  // The week belongs to the year its Thursday falls in.
  const thursday = toDate(addDays(weekStart(iso), 3));
  const jan1 = Date.UTC(thursday.getUTCFullYear(), 0, 1, 12);
  return Math.floor((thursday.getTime() - jan1) / (7 * 86_400_000)) + 1;
}

// Reads `?vecka=` safely: any valid date snaps to its Monday; missing or
// garbage input falls back to the week containing today.
export function parseWeekParam(param: string | undefined, today: string): string {
  if (param && ISO_DATE.test(param) && !Number.isNaN(toDate(param).getTime())) {
    // Reject dates like 2026-02-31 that Date silently rolls over.
    if (toIso(toDate(param)) === param) return weekStart(param);
  }
  return weekStart(today);
}

const SHORT_MONTH = new Intl.DateTimeFormat("sv-SE", { month: "short", timeZone: "UTC" });

function shortMonth(date: Date): string {
  // "okt." → "okt"
  return SHORT_MONTH.format(date).replace(".", "");
}

// "20–26 okt", or "27 okt – 2 nov" when the week spans two months.
export function formatWeekRange(monday: string): string {
  const start = toDate(monday);
  const end = toDate(addDays(monday, 6));
  if (start.getUTCMonth() === end.getUTCMonth()) {
    return `${start.getUTCDate()}–${end.getUTCDate()} ${shortMonth(end)}`;
  }
  return `${start.getUTCDate()} ${shortMonth(start)} – ${end.getUTCDate()} ${shortMonth(end)}`;
}

const MONTH_YEAR = new Intl.DateTimeFormat("sv-SE", {
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

export interface MonthEntry {
  key: string; // "2026-10"
  label: string; // "oktober 2026"
  firstWeek: string; // Monday of the week with the month's first session
  count: number;
}

// Groups session dates into months (newest first) for "Hoppa till månad".
export function groupByMonth(dates: string[]): MonthEntry[] {
  const months = new Map<string, { first: string; count: number }>();
  for (const date of dates) {
    const key = date.slice(0, 7);
    const m = months.get(key);
    if (!m) months.set(key, { first: date, count: 1 });
    else {
      m.count += 1;
      if (date < m.first) m.first = date;
    }
  }
  return [...months.entries()]
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([key, { first, count }]) => ({
      key,
      label: MONTH_YEAR.format(toDate(`${key}-01`)),
      firstWeek: weekStart(first),
      count,
    }));
}
