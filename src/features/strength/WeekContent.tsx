import type { StrengthWeek } from "./queries";

// Plain components (no hooks) so both the server-rendered base tab and the
// client-side PeakTracker can use them.

export function WeekContent({ week }: { week: StrengthWeek | undefined }) {
  if (!week) {
    return <p className="text-muted">Inget innehåll för denna vecka.</p>;
  }
  return (
    <div className="space-y-3">
      <h2 className="section-title">{week.title}</h2>
      <p className="whitespace-pre-line text-text-soft">{week.content}</p>
    </div>
  );
}

// DESIGN.md "Progress": past = faint, current = red, future = line.
export function PeakProgress({ current, total }: { current: number; total: number }) {
  return (
    <div
      role="progressbar"
      aria-label="Vecka i toppningsprogrammet"
      aria-valuemin={1}
      aria-valuemax={total}
      aria-valuenow={current}
      className="flex gap-1.5"
    >
      {Array.from({ length: total }, (_, i) => {
        const n = i + 1;
        const color =
          n < current ? "bg-faint" : n === current ? "bg-red" : "bg-line";
        return <span key={n} className={`h-2 flex-1 rounded-full ${color}`} />;
      })}
    </div>
  );
}
