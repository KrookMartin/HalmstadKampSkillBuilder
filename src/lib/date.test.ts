import { describe, expect, it } from "vitest";
import { formatDayLabel, toIsoDate } from "./date";

describe("toIsoDate", () => {
  it("uses Swedish time, not UTC, just after midnight", () => {
    // 23:30 UTC on 8 Oct = 01:30 on 9 Oct in Sweden (summer time).
    expect(toIsoDate(new Date("2026-10-08T23:30:00Z"))).toBe("2026-10-09");
  });

  it("handles winter time", () => {
    // 23:30 UTC on 8 Jan = 00:30 on 9 Jan in Sweden.
    expect(toIsoDate(new Date("2026-01-08T23:30:00Z"))).toBe("2026-01-09");
  });
});

describe("formatDayLabel", () => {
  it("formats weekday, day and month in Swedish", () => {
    expect(formatDayLabel("2026-10-09")).toBe("fredag 9 oktober");
  });
});
