import { requireActiveProfile } from "@/lib/auth";
import {
  getProgram,
  getProgramWeeks,
  getMemberPeakStart,
} from "@/features/strength/queries";
import { currentBaseWeek, currentPeakWeek } from "@/features/strength/weekCalc";
import { PeakStartForm } from "@/features/strength/PeakStartForm";

export default async function StyrkaMemberPage() {
  const profile = await requireActiveProfile();

  const [baseProgram, peakProgram, peakStart] = await Promise.all([
    getProgram("base"),
    getProgram("peak"),
    getMemberPeakStart(profile.id),
  ]);

  const baseWeeks = baseProgram ? await getProgramWeeks(baseProgram.id) : [];
  const peakWeeks = peakProgram ? await getProgramWeeks(peakProgram.id) : [];

  const activeBaseWeek = baseProgram
    ? currentBaseWeek(baseProgram.total_weeks)
    : null;
  const activePeakWeek =
    peakStart && peakProgram
      ? currentPeakWeek(peakStart, peakProgram.total_weeks)
      : null;

  const currentBaseContent = baseWeeks.find(
    (w) => w.week_number === activeBaseWeek
  );
  const currentPeakContent = peakWeeks.find(
    (w) => w.week_number === activePeakWeek
  );

  return (
    <main className="mx-auto max-w-2xl space-y-6 px-4 py-6">
      <h1 className="text-2xl font-bold text-gray-900">
        Styrka & Kondition
      </h1>

      {/* ── Grundprogram ── */}
      <section className="rounded-xl border border-gray-200 bg-white overflow-hidden">
        <div className="border-b border-gray-100 px-4 py-3">
          <p className="font-semibold text-gray-900">
            {baseProgram?.title ?? "Grundprogram"}
          </p>
          {activeBaseWeek && (
            <p className="text-sm text-gray-500">
              Vecka {activeBaseWeek} av {baseProgram?.total_weeks}
            </p>
          )}
        </div>
        <div className="px-4 py-4">
          {!baseProgram ? (
            <p className="text-sm text-gray-400">
              Grundprogrammet är inte publicerat än.
            </p>
          ) : !currentBaseContent ? (
            <p className="text-sm text-gray-400">
              Inget innehåll för denna vecka.
            </p>
          ) : (
            <div className="space-y-2">
              <p className="font-medium text-gray-900">
                {currentBaseContent.title}
              </p>
              <p className="whitespace-pre-line text-sm text-gray-700">
                {currentBaseContent.content}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ── Tävlingsförberedelse (Peak) ── */}
      <section className="rounded-xl border border-gray-200 bg-white overflow-hidden">
        <div className="border-b border-gray-100 px-4 py-3">
          <p className="font-semibold text-gray-900">
            {peakProgram?.title ?? "Tävlingsförberedelse"}
          </p>
          {activePeakWeek && (
            <p className="text-sm text-gray-500">
              Vecka {activePeakWeek} av {peakProgram?.total_weeks}
            </p>
          )}
          {peakStart && activePeakWeek === null && (
            <p className="text-sm text-amber-600">
              Programmet är avslutat. Välj ett nytt startdatum om du vill
              köra det igen.
            </p>
          )}
        </div>
        <div className="px-4 py-4 space-y-4">
          <PeakStartForm currentStartDate={peakStart} />

          {currentPeakContent && (
            <div className="space-y-2 border-t border-gray-100 pt-4">
              <p className="font-medium text-gray-900">
                {currentPeakContent.title}
              </p>
              <p className="whitespace-pre-line text-sm text-gray-700">
                {currentPeakContent.content}
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
