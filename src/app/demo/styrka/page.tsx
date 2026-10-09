// Demo: S&C member view — no DB
export default function DemoStyrkaPage() {
  const baseWeek = {
    week_number: 3,
    total_weeks: 8,
    title: "Vecka 3 — Styrkeblock A",
    content: `**Måndag – Underkropp**
Knäböj 4×5 @ 80 %
Rumänsk marklyft 3×8
Bulgarskt split squat 3×10/sida
Kalvhävningar 4×15

**Onsdag – Överkropp**
Bänkpress 4×5 @ 80 %
Pendlay rows 4×6
Axelpress stående 3×8
Chins 3×max

**Fredag – Full kropp**
Marklyftsvariant 4×4 @ 85 %
Dips 3×10
Farmers carry 3×30 m
Core-circuit: planka / rullhjul / hängande benlyft`,
  };

  const peakWeek = {
    week_number: 1,
    total_weeks: 6,
    title: "Vecka 1 — Introduktion toppning",
    content: `Lättare vecka för att ställa om kroppen. Fokus på explosivitet.

**Måndag**
Power clean 5×3 @ 70 %
Box jumps 5×3
Knäböj 3×5 @ 70 %

**Onsdag – Kondition**
3 × 5 min grappling-intervaller med 2 min vila

**Fredag**
Lite lättare marklyft 3×3 @ 70 %
Explosiva pushups 4×5`,
  };

  return (
    <main className="space-y-6 px-4 py-6">
      <h1 className="text-2xl font-bold text-gray-900">Styrka & Kondition</h1>

      {/* Base program */}
      <section className="rounded-xl border border-gray-200 bg-white overflow-hidden">
        <div className="border-b border-gray-100 px-4 py-3">
          <p className="font-semibold text-gray-900">Grundprogram</p>
          <p className="text-sm text-gray-500">
            Vecka {baseWeek.week_number} av {baseWeek.total_weeks}
          </p>
        </div>
        <div className="px-4 py-4 space-y-2">
          <p className="font-medium text-gray-900">{baseWeek.title}</p>
          <p className="whitespace-pre-line text-sm text-gray-700">{baseWeek.content}</p>
        </div>
      </section>

      {/* Peak program */}
      <section className="rounded-xl border border-gray-200 bg-white overflow-hidden">
        <div className="border-b border-gray-100 px-4 py-3">
          <p className="font-semibold text-gray-900">Tävlingsförberedelse</p>
          <p className="text-sm text-gray-500">
            Vecka {peakWeek.week_number} av {peakWeek.total_weeks}
          </p>
        </div>
        <div className="px-4 py-4 space-y-4">
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm">
            <p className="font-medium text-amber-900">Tävlingsförberedelse aktiv</p>
            <p className="mt-1 text-amber-700">Startade 1 oktober.</p>
            <button className="mt-3 text-xs text-amber-700 underline underline-offset-2">
              Avbryt toppningsprogram
            </button>
          </div>
          <div className="space-y-2 border-t border-gray-100 pt-4">
            <p className="font-medium text-gray-900">{peakWeek.title}</p>
            <p className="whitespace-pre-line text-sm text-gray-700">{peakWeek.content}</p>
          </div>
        </div>
      </section>
    </main>
  );
}
