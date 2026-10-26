import { describe, expect, it } from "vitest";
import {
  addDays,
  formatWeekRange,
  groupByMonth,
  isoWeekNumber,
  parseWeekParam,
  weekStart,
} from "./week";

describe("weekStart", () => {
  it("returns the Monday of the week", () => {
    expect(weekStart("2026-10-22")).toBe("2026-10-19"); // Thursday
    expect(weekStart("2026-10-19")).toBe("2026-10-19"); // Monday itself
  });

  it("treats Sunday as the last day of the week, not the first", () => {
    expect(weekStart("2026-10-25")).toBe("2026-10-19");
  });

  it("crosses month and year boundaries", () => {
    expect(weekStart("2027-01-01")).toBe("2026-12-28");
  });
});

describe("addDays", () => {
  it("is not shifted by daylight saving (last Sunday in October)", () => {
    expect(addDays("2026-10-24", 1)).toBe("2026-10-25");
    expect(addDays("2026-10-25", 1)).toBe("2026-10-26");
  });
});

describe("isoWeekNumber", () => {
  it("matches the Swedish calendar", () => {
    expect(isoWeekNumber("2026-10-22")).toBe(43);
  });

  it("puts early January in last year's week when needed", () => {
    // 1 Jan 2027 is a Friday → still week 53 of 2026.
    expect(isoWeekNumber("2027-01-01")).toBe(53);
    // 4 Jan 2027 (Monday) starts week 1.
    expect(isoWeekNumber("2027-01-04")).toBe(1);
  });

  it("puts late December in next year's week 1 when needed", () => {
    // 29 Dec 2025 is a Monday whose Thursday is 1 Jan 2026.
    expect(isoWeekNumber("2025-12-29")).toBe(1);
  });
});

describe("parseWeekParam", () => {
  const today = "2026-10-22";

  it("snaps any date to its Monday", () => {
    expect(parseWeekParam("2026-10-01", today)).toBe("2026-09-28");
  });

  it("falls back to this week for missing or invalid input", () => {
    expect(parseWeekParam(undefined, today)).toBe("2026-10-19");
    expect(parseWeekParam("hej", today)).toBe("2026-10-19");
    expect(parseWeekParam("2026-02-31", today)).toBe("2026-10-19");
  });
});

describe("formatWeekRange", () => {
  it("shows the month once when the week is within one month", () => {
    expect(formatWeekRange("2026-10-19")).toBe("19–25 okt");
  });

  it("shows both months when the week spans two", () => {
    expect(formatWeekRange("2026-10-26")).toBe("26 okt – 1 nov");
  });
});

describe("groupByMonth", () => {
  it("groups dates newest month first and finds each month's first week", () => {
    const months = groupByMonth(["2026-09-30", "2026-10-22", "2026-10-02"]);
    expect(months).toEqual([
      { key: "2026-10", label: "oktober 2026", firstWeek: "2026-09-28", count: 2 },
      { key: "2026-09", label: "september 2026", firstWeek: "2026-09-28", count: 1 },
    ]);
  });
});
