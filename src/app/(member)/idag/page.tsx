import { getSessionsForDate } from "@/features/sessions/queries";
import { YoutubeEmbed } from "@/components/YoutubeEmbed";
import { categoryLabels, levelLabels } from "@/features/techniques/labels";

export default async function IdagPage() {
  const today = new Date().toISOString().split("T")[0];
  const sessions = await getSessionsForDate(today);

  const dateLabel = new Date(today).toLocaleDateString("sv-SE", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <main className="mx-auto max-w-2xl space-y-6 px-4 py-6">
      <div>
        <h1 className="text-2xl font-bold capitalize text-gray-900">
          {dateLabel}
        </h1>
        <p className="text-sm text-gray-500">Dagens pass</p>
      </div>

      {sessions.length === 0 && (
        <div className="rounded-xl border border-gray-200 bg-white px-4 py-10 text-center">
          <p className="text-sm text-gray-400">
            Inget pass publicerat för idag.
          </p>
        </div>
      )}

      {sessions.map((session) => (
        <article
          key={session.id}
          className="rounded-xl border border-gray-200 bg-white overflow-hidden"
        >
          {/* Session header */}
          <div className="border-b border-gray-100 px-4 py-3">
            <p className="font-semibold text-gray-900">{session.class_type}</p>
            <p className="text-sm text-gray-500">{session.time_slot}</p>
          </div>

          <div className="px-4 py-4 space-y-4">
            {/* Coach notes */}
            {session.notes && (
              <p className="text-sm text-gray-700 whitespace-pre-line">
                {session.notes}
              </p>
            )}

            {/* Technique list */}
            {session.techniques.length === 0 ? (
              <p className="text-sm text-gray-400">
                Inga tekniker i detta pass.
              </p>
            ) : (
              <ol className="space-y-6">
                {session.techniques.map((t, i) => (
                  <li key={t.id}>
                    <div className="mb-2 flex items-baseline gap-2">
                      <span className="text-xs font-medium text-gray-400">
                        {i + 1}.
                      </span>
                      <div>
                        <p className="font-medium text-gray-900">{t.title}</p>
                        <p className="text-xs text-gray-500">
                          {categoryLabels[t.category]} ·{" "}
                          {levelLabels[t.level]}
                        </p>
                      </div>
                    </div>
                    <YoutubeEmbed url={t.youtube_url} title={t.title} />
                    {t.notes && (
                      <p className="mt-2 text-sm text-gray-600 whitespace-pre-line">
                        {t.notes}
                      </p>
                    )}
                  </li>
                ))}
              </ol>
            )}
          </div>
        </article>
      ))}
    </main>
  );
}
