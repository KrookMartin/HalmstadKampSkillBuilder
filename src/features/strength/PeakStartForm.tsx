"use client";

import { useTransition } from "react";
import { buttonPrimary, buttonSecondary, input, label } from "@/components/ui";
import { toIsoDate } from "@/lib/date";
import { startPeakProgram, cancelPeakProgram } from "./actions";

// Date picker + primary button to (re)start the peak program.
export function PeakStartForm() {
  const [isPending, startTransition] = useTransition();

  function handleStart(formData: FormData) {
    const date = formData.get("start_date") as string;
    startTransition(async () => {
      await startPeakProgram(date);
    });
  }

  return (
    <form action={handleStart} className="space-y-4">
      <div>
        <label htmlFor="start_date" className={label}>
          Startdatum
        </label>
        <input
          id="start_date"
          name="start_date"
          type="date"
          defaultValue={toIsoDate(new Date())}
          required
          className={input}
        />
      </div>
      <button type="submit" disabled={isPending} className={buttonPrimary}>
        {isPending ? "Startar…" : "Starta toppning"}
      </button>
    </form>
  );
}

export function CancelPeakButton() {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      onClick={() =>
        startTransition(async () => {
          await cancelPeakProgram();
        })
      }
      disabled={isPending}
      className={`${buttonSecondary} w-full`}
    >
      {isPending ? "Avbryter…" : "Avbryt toppningsprogram"}
    </button>
  );
}
