import { describe, it, expect, beforeAll, afterAll, vi } from "vitest";
import {
  todayString,
  daysBetween,
  addDays,
  formatDate,
  isToday,
  isYesterday,
} from "./date";

// Frozen at midday UTC so the UTC calendar date ("today") is unambiguous.
const FROZEN = new Date("2026-06-15T12:00:00Z");

describe("date utils", () => {
  beforeAll(() => {
    vi.useFakeTimers();
    vi.setSystemTime(FROZEN);
  });
  afterAll(() => vi.useRealTimers());

  describe("todayString", () => {
    it("returns the UTC calendar date of now", () => {
      expect(todayString()).toBe("2026-06-15");
    });
  });

  describe("daysBetween", () => {
    it("is 0 for the same day", () => {
      expect(daysBetween("2026-06-15", "2026-06-15")).toBe(0);
    });
    it("is 1 for consecutive days", () => {
      expect(daysBetween("2026-06-14", "2026-06-15")).toBe(1);
    });
    it("counts multi-day spans", () => {
      expect(daysBetween("2026-06-01", "2026-06-15")).toBe(14);
    });
    it("is negative when b precedes a", () => {
      expect(daysBetween("2026-06-15", "2026-06-14")).toBe(-1);
    });
    it("spans a month boundary (2026 is not a leap year)", () => {
      expect(daysBetween("2026-02-28", "2026-03-01")).toBe(1);
    });
  });

  describe("addDays", () => {
    it("adds days", () => {
      expect(addDays("2026-06-15", 3)).toBe("2026-06-18");
    });
    it("subtracts days", () => {
      expect(addDays("2026-06-15", -1)).toBe("2026-06-14");
    });
    it("rolls back across a month boundary", () => {
      expect(addDays("2026-03-01", -1)).toBe("2026-02-28");
    });
  });

  describe("isToday / isYesterday", () => {
    it("isToday is true only for today", () => {
      expect(isToday("2026-06-15")).toBe(true);
      expect(isToday("2026-06-14")).toBe(false);
    });
    it("isYesterday is true only for the day before today", () => {
      expect(isYesterday("2026-06-14")).toBe(true);
      expect(isYesterday("2026-06-15")).toBe(false);
      expect(isYesterday("2026-06-13")).toBe(false);
    });
  });

  describe("formatDate", () => {
    it("formats as 'Wkd, Mon D' in en-US", () => {
      expect(formatDate("2026-06-29")).toBe("Mon, Jun 29");
    });
  });
});
