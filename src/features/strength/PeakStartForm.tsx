"use client";

import { useTransition } from "react";
import { startPeakProgram, cancelPeakProgram } from "./actions";

interface PeakStartFormProps {
  currentStartDate: string | null;
}

export function PeakStartForm({ currentStartDate }: PeakStartFormProps) {
  const [isPending, startTransition] = useTransition();
  const today = new Date().toISOString().split("T")[0];

  function handleStart(formData: FormData) {
    const date = formData.get("start_date") as string;
    startTransition(async () => { await startPeakProgram(date); });
  }

  function handleCancel() {
    startTransition(async () => { await cancelPeakProgram(); });
  }

  if (currentStartDate) {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm">
        <p className="font-medium text-amber-900">
          Tävlingsförberedelse aktiv
        </p>
        <p className="mt-1 text-amber-700">
          Startade{" "}
          {new Date(currentStartDate).toLocaleDateString("sv-SE", {
            day: "numeric",
            month: "long",
          })}
          .
        </p>
        <button
          type="button"
          onClick={handleCancel}
          disabled={isPending}
          className="mt-3 text-xs text-amber-700 underline underline-offset-2 disabled:opacity-60"
        >
          Avbryt toppningsprogram
        </button>
      </div>
    );
  }

  return (
    <form action={handleStart} className="space-y-3">
      <p className="text-sm text-gray-600">
        Välj ett startdatum för toppningsprogrammet. Du kan hoppa på när som
        helst — programmet är fristående från grundprogrammet.
      </p>
      <div className="flex gap-2">
        <input
          name="start_date"
          type="date"
          defaultValue={today}
          required
          className="min-h-[44px] flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
        />
        <button
          type="submit"
          disabled={isPending}
          className="min-h-[44px] rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-700 disabled:opacity-60"
        >
          {isPending ? "…" : "Starta"}
        </button>
      </div>
    </form>
  );
}
