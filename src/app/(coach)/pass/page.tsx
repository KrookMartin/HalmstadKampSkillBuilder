import { getAllSessions } from "@/features/sessions/queries";
import { getTechniques } from "@/features/techniques/queries";
import { SessionForm } from "@/features/sessions/SessionForm";
import { PublishToggle } from "@/features/sessions/PublishToggle";
import { TechniquePicker } from "@/features/sessions/TechniquePicker";

export default async function PassCoachPage() {
  const [sessions, allTechniques] = await Promise.all([
    getAllSessions(),
    getTechniques(),
  ]);

  return (
    <main className="mx-auto max-w-2xl space-y-6 px-4 py-6">
      <h1 className="text-2xl font-bold text-gray-900">Passbyggare</h1>

      {/* Create new session */}
      <section className="rounded-xl border border-gray-200 bg-white p-4">
        <h2 className="mb-4 text-base font-semibold text-gray-900">
          Skapa nytt pass
        </h2>
        <SessionForm />
      </section>

      {/* Existing sessions */}
      {sessions.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-base font-semibold text-gray-900">
            Tidigare pass
          </h2>
          <ul className="space-y-4">
            {sessions.map((s) => (
              <li
                key={s.id}
                className="rounded-xl border border-gray-200 bg-white p-4 space-y-4"
              >
                {/* Session header */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-gray-900">
                      {s.class_type}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(s.session_date).toLocaleDateString("sv-SE", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                      })}{" "}
                      · {s.time_slot}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        s.published
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {s.published ? "Publicerat" : "Utkast"}
                    </span>
                    <PublishToggle
                      sessionId={s.id}
                      published={s.published}
                    />
                  </div>
                </div>

                {s.notes && (
                  <p className="text-sm text-gray-600 whitespace-pre-line">
                    {s.notes}
                  </p>
                )}

                {/* Technique picker for this session */}
                <TechniquePicker
                  sessionId={s.id}
                  allTechniques={allTechniques}
                  initialSelected={[]}
                />
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}
