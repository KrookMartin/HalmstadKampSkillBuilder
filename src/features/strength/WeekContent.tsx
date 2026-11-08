import { ExerciseLine, parseWeek, TextLine } from "./parseWeek";
import { ExerciseRow } from "./ExerciseRow";
import type { StrengthWeek } from "./queries";

// A week shown as one collapsible section per day. <details> needs no JS;
// the first day starts open so the member sees content straight away.
export function WeekContent({ week }: { week: StrengthWeek }) {
  const days = parseWeek(week.content);

  return (
    <div className="space-y-3">
      <h2 className="section-title">{week.title}</h2>
      {days.map((day, i) =>
        day.title ? (
          <details
            key={i}
            open={i === 0}
            className="group rounded-card bg-surface"
          >
            <summary className="flex min-h-[56px] cursor-pointer list-none items-center justify-between gap-3 px-4 font-semibold focus-visible:outline-2 focus-visible:outline-red-text [&::-webkit-details-marker]:hidden">
              {day.title}
              <span
                aria-hidden
                className="text-muted transition-transform group-open:rotate-90"
              >
                ›
              </span>
            </summary>
            <div className="border-t border-line px-4">
              <DayLines lines={day.lines} />
            </div>
          </details>
        ) : (
          // Text before the first heading (or an old free-text week).
          <DayLines key={i} lines={day.lines} />
        )
      )}
    </div>
  );
}

function DayLines({ lines }: { lines: (ExerciseLine | TextLine)[] }) {
  return (
    <ul className="divide-y divide-line">
      {lines.map((line, i) =>
        line.kind === "exercise" ? (
          <ExerciseRow key={i} exercise={line} />
        ) : (
          <li key={i} className="py-3 text-text-soft">
            {line.text}
          </li>
        )
      )}
    </ul>
  );
}
