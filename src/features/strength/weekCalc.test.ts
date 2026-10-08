import { describe, it, expect } from "vitest";
import { currentBaseWeek, currentPeakWeek } from "./weekCalc";

describe("currentBaseWeek", () => {
  it("returns week 1 on the epoch start date (2024-01-01)", () => {
    const epoch = new Date("2024-01-01T12:00:00Z");
    expect(currentBaseWeek(8, epoch)).toBe(1);
  });

  it("returns week 2 after 7 days", () => {
    const date = new Date("2024-01-08T12:00:00Z");
    expect(currentBaseWeek(8, date)).toBe(2);
  });

  it("loops back to week 1 after totalWeeks", () => {
    const date = new Date("2024-02-26T12:00:00Z"); // 8 weeks after epoch
    expect(currentBaseWeek(8, date)).toBe(1);
  });

  it("is consistent for totalWeeks = 6", () => {
    const w1 = currentBaseWeek(6, new Date("2024-01-01T00:00:00Z"));
    const w7 = currentBaseWeek(6, new Date("2024-02-12T00:00:00Z")); // 6 weeks later
    expect(w1).toBe(w7); // same week in the cycle
  });

  it("always returns a value between 1 and totalWeeks", () => {
    const totalWeeks = 8;
    // sample 100 days
    for (let i = 0; i < 100; i++) {
      const d = new Date("2024-01-01");
      d.setUTCDate(d.getUTCDate() + i);
      const w = currentBaseWeek(totalWeeks, d);
      expect(w).toBeGreaterThanOrEqual(1);
      expect(w).toBeLessThanOrEqual(totalWeeks);
    }
  });
});

describe("currentPeakWeek", () => {
  it("returns 1 on the start date", () => {
    const today = new Date("2024-03-01");
    expect(currentPeakWeek("2024-03-01", 8, today)).toBe(1);
  });

  it("returns 2 after 7 days", () => {
    const today = new Date("2024-03-08");
    expect(currentPeakWeek("2024-03-01", 8, today)).toBe(2);
  });

  it("returns null before the start date", () => {
    const today = new Date("2024-02-28");
    expect(currentPeakWeek("2024-03-01", 8, today)).toBeNull();
  });

  it("returns null after the program ends", () => {
    // 8 weeks = 56 days; day 57 is past the end
    const today = new Date("2024-04-27"); // 57 days after 2024-03-01
    expect(currentPeakWeek("2024-03-01", 8, today)).toBeNull();
  });

  it("returns 8 on the last day of the program", () => {
    // Last day of week 8 = start + 55 days (days 49-55 are week 8)
    const today = new Date("2024-04-25"); // 55 days after 2024-03-01
    expect(currentPeakWeek("2024-03-01", 8, today)).toBe(8);
  });
});
