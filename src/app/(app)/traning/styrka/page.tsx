import { requireRole } from "@/lib/auth";
import { getProgram, getProgramWeeks } from "@/features/strength/queries";
import { upsertWeek, deleteWeek } from "@/features/strength/actions";
import {
  buttonDanger,
  buttonPrimary,
  buttonSecondary,
  input,
  label,
} from "@/components/ui";

// Simple server-side week editor. Each week is its own form so coaches
// can save individual weeks without losing edits on others.
export default async function StyrkaCoachPage() {
  // Also checked in traning/layout.tsx (see pass/page.tsx for why both).
  await requireRole(["coach", "admin"]);
  const [baseProgram, peakProgram] = await Promise.all([
    getProgram("base"),
    getProgram("peak"),
  ]);

  const [baseWeeks, peakWeeks] = await Promise.all([
    baseProgram ? getProgramWeeks(baseProgram.id) : [],
    peakProgram ? getProgramWeeks(peakProgram.id) : [],
  ]);

  return (
    <div className="space-y-12">
      <header className="space-y-3">
        <p className="eyebrow">Redigera program</p>
        <h1 className="page-title">Styrka</h1>
      </header>

      {[
        { program: baseProgram, weeks: baseWeeks, title: "Grundprogram" },
        { program: peakProgram, weeks: peakWeeks, title: "Toppning" },
      ].map(({ program, weeks, title }) => (
        <section key={title} className="space-y-4">
          <h2 className="section-title">{title}</h2>

          {!program ? (
            <p className="text-muted">
              Programmet finns inte än. Kontakta en admin för att skapa det.
            </p>
          ) : (
            <>
              {weeks.map((week) => (
                <details
                  key={week.id}
                  className="group rounded-card bg-surface"
                >
                  <summary className="flex min-h-[56px] cursor-pointer list-none items-center gap-3 px-4 focus-visible:outline-2 focus-visible:outline-red-text [&::-webkit-details-marker]:hidden">
                    <span className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">
                      Vecka {week.week_number}
                    </span>
                    <span className="min-w-0 flex-1 truncate font-semibold">
                      {week.title}
                    </span>
                  </summary>
                  <form
                    action={async (fd: FormData) => {
                      "use server";
                      await upsertWeek(program.id, fd);
                    }}
                    className="space-y-4 border-t border-line p-4"
                  >
                    <input
                      type="hidden"
                      name="week_number"
                      value={week.week_number}
                    />
                    <WeekFields
                      idPrefix={week.id}
                      title={week.title}
                      content={week.content}
                    />
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        className={`${buttonSecondary} flex-1`}
                      >
                        Spara
                      </button>
                      {/* formAction instead of a nested <form>: browsers
                          ignore nested forms, so this button would
                          otherwise submit "Spara". formNoValidate lets
                          you delete even if a field is empty. */}
                      <button
                        type="submit"
                        formNoValidate
                        formAction={async () => {
                          "use server";
                          await deleteWeek(week.id);
                        }}
                        className={buttonDanger}
                      >
                        Ta bort
                      </button>
                    </div>
                  </form>
                </details>
              ))}

              <details className="rounded-card border border-dashed border-line-strong">
                <summary className="flex min-h-[54px] cursor-pointer list-none items-center px-4 font-semibold text-text-soft focus-visible:outline-2 focus-visible:outline-red-text [&::-webkit-details-marker]:hidden">
                  + Lägg till vecka {weeks.length + 1}
                </summary>
                <form
                  action={async (fd: FormData) => {
                    "use server";
                    await upsertWeek(program.id, fd);
                  }}
                  className="space-y-4 border-t border-line p-4"
                >
                  <input
                    type="hidden"
                    name="week_number"
                    value={weeks.length + 1}
                  />
                  <WeekFields idPrefix={`${program.id}-new`} />
                  <button type="submit" className={buttonPrimary}>
                    Lägg till vecka
                  </button>
                </form>
              </details>
            </>
          )}
        </section>
      ))}
    </div>
  );
}

function WeekFields({
  idPrefix,
  title,
  content,
}: {
  idPrefix: string;
  title?: string;
  content?: string;
}) {
  return (
    <>
      <div>
        <label htmlFor={`${idPrefix}-title`} className={label}>
          Rubrik
        </label>
        <input
          id={`${idPrefix}-title`}
          name="title"
          defaultValue={title}
          required
          placeholder="t.ex. Pass A – maxstyrka"
          className={input}
        />
      </div>
      <div>
        <label htmlFor={`${idPrefix}-content`} className={label}>
          Innehåll
        </label>
        <textarea
          id={`${idPrefix}-content`}
          name="content"
          defaultValue={content}
          required
          rows={6}
          placeholder="Träningsinnehåll för veckan…"
          className={input}
        />
      </div>
    </>
  );
}
