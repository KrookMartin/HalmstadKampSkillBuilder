import { describe, it, expect } from "vitest";
import { parseWeek } from "./parseWeek";

describe("parseWeek", () => {
  it("splits days on ## headings and reads exercise lines", () => {
    const days = parseWeek(
      [
        "## Dag 1 – Ben",
        "A. Barbell box squat | 6-8 x 3-4 set | https://youtu.be/7iw2gLZKZ0w",
        "B1. RNT reverse lunge | 6-8/ben x 3-4 set",
        "",
        "## Dag 4 – Löpning",
        "4-6 km flow tempo",
      ].join("\n")
    );

    expect(days).toEqual([
      {
        title: "Dag 1 – Ben",
        lines: [
          {
            kind: "exercise",
            label: "A",
            name: "Barbell box squat",
            dose: "6-8 x 3-4 set",
            videoUrl: "https://youtu.be/7iw2gLZKZ0w",
          },
          {
            kind: "exercise",
            label: "B1",
            name: "RNT reverse lunge",
            dose: "6-8/ben x 3-4 set",
            videoUrl: null,
          },
        ],
      },
      {
        title: "Dag 4 – Löpning",
        lines: [{ kind: "text", text: "4-6 km flow tempo" }],
      },
    ]);
  });

  it("keeps old free text (no headings, no pipes) as plain text", () => {
    expect(parseWeek("Knäböj 3x8\nA. Värm upp ordentligt")).toEqual([
      {
        title: null,
        lines: [
          { kind: "text", text: "Knäböj 3x8" },
          { kind: "text", text: "A. Värm upp ordentligt" },
        ],
      },
    ]);
  });

  it("finds the link even without a dose column", () => {
    const [day] = parseWeek("C2. Drag curl | https://youtu.be/ZHa0OAcn7Bc");
    expect(day.lines[0]).toMatchObject({
      label: "C2",
      dose: null,
      videoUrl: "https://youtu.be/ZHa0OAcn7Bc",
    });
  });

  it("handles Windows line endings and lowercase labels", () => {
    const [day] = parseWeek("## Dag 1\r\nb2) DB fly | 8-10 x 3 set\r\n");
    expect(day.title).toBe("Dag 1");
    expect(day.lines[0]).toMatchObject({ label: "B2", name: "DB fly" });
  });

  it("returns no days for empty content", () => {
    expect(parseWeek("  \n\n")).toEqual([]);
  });
});
