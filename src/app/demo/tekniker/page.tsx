"use client";
// Demo: member technique archive — no DB
import { useState } from "react";

const techniques = [
  { id: "1", title: "X-Guard — Sweep till Double Leg", category: "guards", level: "advanced", notes: "Håll fötterna aktiva mot höften." },
  { id: "2", title: "Butterfly Guard — Basic Sweep", category: "sweeps", level: "beginner", notes: null },
  { id: "3", title: "Armhävstång från closed guard", category: "upper_body_submissions", level: "intermediate", notes: "Kontrollera armbågen innan du lyfter höften." },
  { id: "4", title: "Double Leg Takedown", category: "takedowns", level: "beginner", notes: "Level change — skjut från knät." },
  { id: "5", title: "Torreando passering", category: "passing", level: "intermediate", notes: null },
  { id: "6", title: "Heel Hook från outside ashi", category: "lower_body_submissions", level: "advanced", notes: "Endast för erfarna utövare." },
  { id: "7", title: "De la Riva Guard — Basic Berimbolo entry", category: "guards", level: "advanced", notes: null },
  { id: "8", title: "Single Leg X — Hip bump sweep", category: "sweeps", level: "intermediate", notes: null },
];

const catLabels: Record<string, string> = {
  guards: "Guards", passing: "Passering", takedowns: "Nedtagningar",
  upper_body_submissions: "Överkroppsgrepp", lower_body_submissions: "Benkroppsgrepp", sweeps: "Svep",
};
const lvlLabels: Record<string, string> = {
  beginner: "Nybörjare", intermediate: "Medel", advanced: "Avancerad",
};

export default function DemoTechnikerPage() {
  const [category, setCategory] = useState("");
  const [level, setLevel] = useState("");
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = techniques.filter((t) => {
    if (category && t.category !== category) return false;
    if (level && t.level !== level) return false;
    if (search && !t.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <main className="space-y-4 px-4 py-6">
      <h1 className="text-2xl font-bold text-gray-900">Teknikarkiv</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <select value={category} onChange={(e) => setCategory(e.target.value)}
          className="min-h-[44px] rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none">
          <option value="">Alla kategorier</option>
          {Object.entries(catLabels).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </select>
        <select value={level} onChange={(e) => setLevel(e.target.value)}
          className="min-h-[44px] rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none">
          <option value="">Alla nivåer</option>
          {Object.entries(lvlLabels).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </select>
        <input type="search" value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Sök teknik…"
          className="min-h-[44px] min-w-[160px] flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none" />
      </div>

      {filtered.length === 0 && (
        <p className="py-8 text-center text-sm text-gray-400">Inga tekniker matchar.</p>
      )}

      <ul className="space-y-2">
        {filtered.map((t) => (
          <li key={t.id} className="rounded-xl border border-gray-200 bg-white overflow-hidden">
            <button type="button" onClick={() => setExpanded(expanded === t.id ? null : t.id)}
              className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left">
              <div className="min-w-0">
                <p className="truncate font-medium text-gray-900">{t.title}</p>
                <p className="mt-0.5 text-xs text-gray-500">
                  {catLabels[t.category]} · {lvlLabels[t.level]}
                </p>
              </div>
              <span className="shrink-0 text-gray-400">{expanded === t.id ? "▲" : "▼"}</span>
            </button>

            {expanded === t.id && (
              <div className="border-t border-gray-100 px-4 pb-4 pt-3 space-y-3">
                <div className="flex aspect-video w-full items-center justify-center rounded-xl bg-gray-900 text-sm text-white">
                  ▶ YouTube-video
                </div>
                {t.notes && <p className="text-sm text-gray-600">{t.notes}</p>}
              </div>
            )}
          </li>
        ))}
      </ul>
    </main>
  );
}
