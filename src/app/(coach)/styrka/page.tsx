import { getProgram, getProgramWeeks } from "@/features/strength/queries";
import { upsertWeek, deleteWeek } from "@/features/strength/actions";
import type { WeekResult } from "@/features/strength/actions";

// Simple server-side week editor. Each week is its own form so coaches
// can save individual weeks without losing edits on others.
export default async function StyrkaCoachPage() {
  const [baseProgram, peakProgram] = await Promise.all([
    getProgram("base"),
    getProgram("peak"),
  ]);

  const [baseWeeks, peakWeeks] = await Promise.all([
    baseProgram ? getProgramWeeks(baseProgram.id) : [],
    peakProgram ? getProgramWeeks(peakProgram.id) : [],
  ]);

  return (
    <main className="mx-auto max-w-2xl space-y-8 px-4 py-6">
      <h1 className="text-2xl font-bold text-gray-900">
        Styrka & Kondition – redigera
      </h1>

      {[
        { program: baseProgram, weeks: baseWeeks, label: "Grundprogram" },
        {
          program: peakProgram,
          weeks: peakWeeks,
          label: "Tävlingsförberedelse",
        },
      ].map(({ program, weeks, label }) => (
        <section key={label} className="space-y-3">
          <h2 className="text-base font-semibold text-gray-900">{label}</h2>

          {!program ? (
            <p className="text-sm text-gray-400">
              Programmet finns inte än. Kontakta en admin för att skapa det.
            </p>
          ) : (
            <>
              {/* Existing weeks */}
              {weeks.map((week) => (
                <div
                  key={week.id}
                  className="rounded-xl border border-gray-200 bg-white p-4 space-y-3"
                >
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                    Vecka {week.week_number}
                  </p>
                  <form
                    action={async (fd: FormData) => {
                      "use server";
                      await upsertWeek(program.id, fd);
                    }}
                    className="space-y-3"
                  >
                    <input
                      type="hidden"
                      name="week_number"
                      value={week.week_number}
                    />
                    <input
                      name="title"
                      defaultValue={week.title}
                      required
                      placeholder="Rubrik"
                      className="block w-full min-h-[44px] rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
                    />
                    <textarea
                      name="content"
                      defaultValue={week.content}
                      required
                      rows={6}
                      placeholder="Träningsinnehåll för veckan…"
                      className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
                    />
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        className="min-h-[44px] flex-1 rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-700"
                      >
                        Spara
                      </button>
                      <form
                        action={async () => {
                          "use server";
                          await deleteWeek(week.id);
                        }}
                      >
                        <button
                          type="submit"
                          className="min-h-[44px] rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                        >
                          Ta bort
                        </button>
                      </form>
                    </div>
                  </form>
                </div>
              ))}

              {/* Add new week */}
              <div className="rounded-xl border border-dashed border-gray-300 bg-white p-4 space-y-3">
                <p className="text-sm font-medium text-gray-700">
                  Lägg till vecka {weeks.length + 1}
                </p>
                <form
                  action={async (fd: FormData) => {
                    "use server";
                    await upsertWeek(program.id, fd);
                  }}
                  className="space-y-3"
                >
                  <input
                    type="hidden"
                    name="week_number"
                    value={weeks.length + 1}
                  />
                  <input
                    name="title"
                    required
                    placeholder="Rubrik"
                    className="block w-full min-h-[44px] rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
                  />
                  <textarea
                    name="content"
                    required
                    rows={6}
                    placeholder="Träningsinnehåll för veckan…"
                    className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
                  />
                  <button
                    type="submit"
                    className="min-h-[44px] w-full rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-700"
                  >
                    Lägg till vecka
                  </button>
                </form>
              </div>
            </>
          )}
        </section>
      ))}
    </main>
  );
}
