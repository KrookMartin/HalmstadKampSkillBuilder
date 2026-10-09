// Demo: member "Idag" view — no DB
export default function DemoIdagPage() {
  const session = {
    class_type: "BJJ Avancerat",
    time_slot: "18:00",
    notes:
      "Fokus på guardsystem idag. Vi börjar med att sätta ihop passering och undvikning, sedan rullar vi tematiskt med guard-passing-regler.",
    techniques: [
      {
        id: "1",
        title: "X-Guard — Sweep till Double Leg",
        category: "Guards",
        level: "Avancerad",
        youtube_url: "https://youtu.be/dQw4w9WgXcQ",
        notes: "Håll fötterna aktiva mot höften. Börja alltid med sleeve-grip.",
      },
      {
        id: "2",
        title: "Butterfly Guard — Basic Sweep",
        category: "Svep",
        level: "Nybörjare",
        youtube_url: "https://youtu.be/dQw4w9WgXcQ",
        notes: null,
      },
      {
        id: "3",
        title: "Armhävstång från closed guard",
        category: "Överkroppsgrepp",
        level: "Medel",
        youtube_url: "https://youtu.be/dQw4w9WgXcQ",
        notes: "Kontrollera armbågen innan du lyfter höften.",
      },
    ],
  };

  return (
    <main className="space-y-6 px-4 py-6">
      <div>
        <h1 className="text-2xl font-bold capitalize text-gray-900">
          torsdagen den 8 oktober
        </h1>
        <p className="text-sm text-gray-500">Dagens pass</p>
      </div>

      <article className="rounded-xl border border-gray-200 bg-white overflow-hidden">
        <div className="border-b border-gray-100 px-4 py-3">
          <p className="font-semibold text-gray-900">{session.class_type}</p>
          <p className="text-sm text-gray-500">{session.time_slot}</p>
        </div>

        <div className="px-4 py-4 space-y-4">
          <p className="text-sm text-gray-700">{session.notes}</p>

          <ol className="space-y-6">
            {session.techniques.map((t, i) => (
              <li key={t.id}>
                <div className="mb-2 flex items-baseline gap-2">
                  <span className="text-xs font-medium text-gray-400">{i + 1}.</span>
                  <div>
                    <p className="font-medium text-gray-900">{t.title}</p>
                    <p className="text-xs text-gray-500">
                      {t.category} · {t.level}
                    </p>
                  </div>
                </div>
                {/* Static embed placeholder instead of real iframe */}
                <div className="flex aspect-video w-full items-center justify-center rounded-xl bg-gray-900 text-white text-sm">
                  ▶ YouTube-video laddas när Supabase är kopplat
                </div>
                {t.notes && (
                  <p className="mt-2 text-sm text-gray-600">{t.notes}</p>
                )}
              </li>
            ))}
          </ol>
        </div>
      </article>
    </main>
  );
}
