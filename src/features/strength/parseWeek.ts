// Turns a week's free text (strength_weeks.content) into days and exercises,
// so the member view can show a tidy list instead of a wall of text.
//
// The format coaches write (see the help text in /traning/styrka):
//
//   ## Dag 1 – Ben
//   A. Barbell box squat | 6-8 x 3-4 set | https://youtu.be/7iw2gLZKZ0w
//   B1. RNT reverse lunge | 6-8/ben x 3-4 set
//   Any other line is shown as plain text.
//
// Why free text and not tables: coaches edit one textarea per week, and a
// typo here only makes a line show up as plain text instead of breaking.

export type ExerciseLine = {
  kind: "exercise";
  label: string; // "A", "B1" … same letter = superset
  name: string;
  dose: string | null; // sets/reps, e.g. "6-8 x 3-4 set"
  videoUrl: string | null;
};

export type TextLine = { kind: "text"; text: string };

export type WeekDay = {
  title: string | null; // null = lines written before the first "##"
  lines: (ExerciseLine | TextLine)[];
};

// "A." / "B1." / "c2)" followed by the rest of the line.
const EXERCISE_START = /^([A-Za-z]\d?)[.)]\s+(.+)$/;
const URL = /^https?:\/\/\S+$/;

export function parseWeek(content: string): WeekDay[] {
  const days: WeekDay[] = [];
  let current: WeekDay | null = null;

  for (const raw of content.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line) continue;

    if (line.startsWith("#")) {
      current = { title: line.replace(/^#+\s*/, ""), lines: [] };
      days.push(current);
      continue;
    }

    if (!current) {
      current = { title: null, lines: [] };
      days.push(current);
    }
    current.lines.push(parseLine(line));
  }

  return days;
}

function parseLine(line: string): ExerciseLine | TextLine {
  const match = EXERCISE_START.exec(line);
  // Without a "|" it's not our exercise format, e.g. "A. Värm upp ordentligt".
  if (!match || !line.includes("|")) return { kind: "text", text: line };

  const [, label, rest] = match;
  const parts = rest.split("|").map((p) => p.trim()).filter(Boolean);
  const name = parts[0] ?? "";
  if (!name) return { kind: "text", text: line };

  // The link is optional and may come in any column after the name,
  // so pick it out by shape rather than position.
  const videoUrl = parts.slice(1).find((p) => URL.test(p)) ?? null;
  const dose = parts.slice(1).filter((p) => !URL.test(p)).join(" · ") || null;

  return { kind: "exercise", label: label.toUpperCase(), name, dose, videoUrl };
}
