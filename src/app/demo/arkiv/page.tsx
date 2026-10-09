// Demo: coach technique archive — no DB
export default function DemoArkivPage() {
  return (
    <main className="space-y-6 px-4 py-6">
      <h1 className="text-2xl font-bold text-gray-900">Teknikarkiv</h1>

      {/* Add form */}
      <section className="rounded-xl border border-gray-200 bg-white p-4">
        <h2 className="mb-4 text-base font-semibold text-gray-900">Lägg till teknik</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Namn</label>
            <input type="text" placeholder="t.ex. Armhävstång från guard"
              className="mt-1 block w-full min-h-[44px] rounded-lg border border-gray-300 px-3 py-2 text-base" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">Kategori</label>
              <select className="mt-1 block w-full min-h-[44px] rounded-lg border border-gray-300 px-3 py-2 text-base">
                <option>Guards</option>
                <option>Passering</option>
                <option>Nedtagningar</option>
                <option>Överkroppsgrepp</option>
                <option>Benkroppsgrepp</option>
                <option>Svep</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Nivå</label>
              <select className="mt-1 block w-full min-h-[44px] rounded-lg border border-gray-300 px-3 py-2 text-base">
                <option>Nybörjare</option>
                <option>Medel</option>
                <option>Avancerad</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">YouTube-länk</label>
            <input type="url" placeholder="https://youtu.be/..."
              className="mt-1 block w-full min-h-[44px] rounded-lg border border-gray-300 px-3 py-2 text-base" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Anteckningar <span className="font-normal text-gray-400">(valfritt)</span>
            </label>
            <textarea rows={3} placeholder="Nyckeldetaljer, vanliga misstag…"
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-base" />
          </div>
          <button className="flex min-h-[44px] w-full items-center justify-center rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white">
            Lägg till teknik
          </button>
        </div>
      </section>

      {/* Existing techniques */}
      <section className="space-y-2">
        <div className="flex flex-wrap gap-2">
          <select className="min-h-[44px] rounded-lg border border-gray-300 px-3 py-2 text-sm">
            <option>Alla kategorier</option>
          </select>
          <select className="min-h-[44px] rounded-lg border border-gray-300 px-3 py-2 text-sm">
            <option>Alla nivåer</option>
          </select>
          <input placeholder="Sök teknik…"
            className="min-h-[44px] flex-1 min-w-[160px] rounded-lg border border-gray-300 px-3 py-2 text-sm" />
        </div>

        {[
          { title: "X-Guard — Sweep till Double Leg", cat: "Guards", lvl: "Avancerad" },
          { title: "Butterfly Guard — Basic Sweep", cat: "Svep", lvl: "Nybörjare" },
          { title: "Armhävstång från closed guard", cat: "Överkroppsgrepp", lvl: "Medel" },
        ].map((t) => (
          <div key={t.title} className="rounded-xl border border-gray-200 bg-white">
            <div className="flex items-center justify-between px-4 py-3">
              <div>
                <p className="font-medium text-gray-900">{t.title}</p>
                <p className="mt-0.5 text-xs text-gray-500">{t.cat} · {t.lvl}</p>
              </div>
              <span className="text-gray-400">▼</span>
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}
