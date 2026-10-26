"use client";

import { buttonPrimary, buttonSecondary, input, label } from "@/components/ui";
import { formatDayLabel, toIsoDate } from "@/lib/date";
import { setPeakStart, usePeakStart } from "./peakStart";
import { currentPeakWeek } from "./weekCalc";
import { PeakProgress, WeekContent } from "./WeekContent";
import type { StrengthWeek } from "./queries";

interface PeakTrackerProps {
  totalWeeks: number;
  weeks: StrengthWeek[];
}

// The peak tab's member-specific part. Runs in the browser because the start
// date is stored there (see peakStart.ts); program content comes from the server.
export function PeakTracker({ totalWeeks, weeks }: PeakTrackerProps) {
  const startDate = usePeakStart();

  // Server render / before hydration: we don't know the date yet.
  if (startDate === undefined) {
    return <div aria-busy="true" className="h-40" />;
  }

  const today = toIsoDate(new Date());

  // Not started: explain and offer the start form.
  if (!startDate) {
    return (
      <section className="space-y-5">
        <p className="text-text-soft">
          Ett {totalWeeks} veckors program inför tävling. Du kan hoppa på när som
          helst — det körs vid sidan av grundprogrammet.
        </p>
        <PeakStartForm today={today} />
      </section>
    );
  }

  // Start date chosen but still in the future.
  if (startDate > today) {
    return (
      <section className="space-y-5">
        <p className="text-text-soft">Toppningen startar {formatDayLabel(startDate)}.</p>
        <CancelPeakButton />
      </section>
    );
  }

  const weekNumber = currentPeakWeek(startDate, totalWeeks);

  // Past the last week: finished, allow a restart.
  if (weekNumber === null) {
    return (
      <section className="space-y-5">
        <p className="text-text-soft">
          Programmet är avslutat. Välj ett nytt startdatum om du vill köra det igen.
        </p>
        <PeakStartForm today={today} />
      </section>
    );
  }

  const week = weeks.find((w) => w.week_number === weekNumber);

  return (
    <section className="space-y-5">
      <div className="space-y-3">
        <p className="eyebrow">
          Vecka {weekNumber} av {totalWeeks}
        </p>
        <PeakProgress current={weekNumber} total={totalWeeks} />
      </div>
      <WeekContent week={week} />
      <CancelPeakButton />
    </section>
  );
}

// Date picker + primary button to (re)start the peak program.
function PeakStartForm({ today }: { today: string }) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const date = new FormData(e.currentTarget).get("start_date");
        if (typeof date === "string" && date) setPeakStart(date);
      }}
      className="space-y-4"
    >
      <div>
        <label htmlFor="start_date" className={label}>
          Startdatum
        </label>
        <input
          id="start_date"
          name="start_date"
          type="date"
          defaultValue={today}
          required
          className={input}
        />
      </div>
      <p className="text-sm text-muted">Sparas bara i den här telefonen.</p>
      <button type="submit" className={buttonPrimary}>
        Starta toppning
      </button>
    </form>
  );
}

function CancelPeakButton() {
  return (
    <button
      type="button"
      onClick={() => setPeakStart(null)}
      className={`${buttonSecondary} w-full`}
    >
      Avbryt toppningsprogram
    </button>
  );
}
