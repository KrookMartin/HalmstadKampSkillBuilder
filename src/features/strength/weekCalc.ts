// Calculates which week of a program a member is currently on.
//
// Base program: loops indefinitely. Week = ((daysSinceEpoch / 7) % totalWeeks) + 1
// so all members stay in sync regardless of when they joined — the week
// advances on the same calendar day for everyone.
//
// Peak program: linear from the member's chosen start date.
// Returns null if the peak program has ended (past totalWeeks).

export function currentBaseWeek(totalWeeks: number, today = new Date()): number {
  // Use a fixed epoch (2024-01-01 Monday) so the cycle is stable across
  // deploys and doesn't change when totalWeeks is updated.
  const epoch = new Date("2024-01-01T00:00:00Z");
  const daysSinceEpoch = Math.floor(
    (today.getTime() - epoch.getTime()) / (1000 * 60 * 60 * 24)
  );
  const weekIndex = Math.floor(daysSinceEpoch / 7) % totalWeeks;
  return weekIndex + 1; // 1-indexed
}

export function currentPeakWeek(
  startDate: string,
  totalWeeks: number,
  today = new Date()
): number | null {
  const start = new Date(startDate + "T00:00:00Z");
  const todayUTC = new Date(
    Date.UTC(today.getFullYear(), today.getMonth(), today.getDate())
  );
  const daysDiff = Math.floor(
    (todayUTC.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (daysDiff < 0) return null; // hasn't started yet
  const week = Math.floor(daysDiff / 7) + 1;
  if (week > totalWeeks) return null; // program ended
  return week;
}
