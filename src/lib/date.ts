const CLUB_TZ = "Europe/Stockholm";

// Date helpers in the club's timezone. Safe on both server and client.
// (For "today" in a Server Component, use todayIso() from ./today.)

// YYYY-MM-DD in Swedish time. Using the club's timezone avoids showing
// yesterday's session between 00:00 and 02:00, which `toISOString()`
// (UTC) would do.
export function toIsoDate(date: Date): string {
  // sv-SE formats as YYYY-MM-DD.
  return date.toLocaleDateString("sv-SE", { timeZone: CLUB_TZ });
}

// "onsdag 9 oktober" from a YYYY-MM-DD string.
export function formatDayLabel(isoDate: string): string {
  return new Date(`${isoDate}T12:00:00Z`).toLocaleDateString("sv-SE", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: CLUB_TZ,
  });
}
