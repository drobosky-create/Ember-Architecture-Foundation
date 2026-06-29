import { describe, it, expect, beforeAll, afterAll, vi } from "vitest";
import { computeStreak, computeJourneyStats, checkForNewMilestones } from "./engine";
import { todayString, addDays } from "./date";
import type {
  CheckIn,
  Journey,
  JourneyStats,
  Scar,
  UnlockedMilestone,
} from "@/lib/state/types";

const FROZEN = new Date("2026-06-15T12:00:00Z");

let today: string;
/** A date `n` days before the frozen "today", built with the same helper the engine uses. */
const ago = (n: number) => addDays(today, -n);

function ci(date: string): CheckIn {
  return {
    id: `c-${date}`,
    journeyId: "j1",
    date,
    note: "",
    completedAt: `${date}T08:00:00.000Z`,
  };
}

describe("engine", () => {
  beforeAll(() => {
    vi.useFakeTimers();
    vi.setSystemTime(FROZEN);
    today = todayString();
  });
  afterAll(() => vi.useRealTimers());

  describe("computeStreak", () => {
    it("returns zeros when there are no check-ins", () => {
      expect(computeStreak([])).toEqual({ current: 0, longest: 0, missedDays: 0 });
    });

    it("counts a single check-in today", () => {
      expect(computeStreak([ci(ago(0))])).toEqual({
        current: 1,
        longest: 1,
        missedDays: 0,
      });
    });

    it("keeps the streak alive when the only check-in was yesterday", () => {
      expect(computeStreak([ci(ago(1))])).toEqual({
        current: 1,
        longest: 1,
        missedDays: 0,
      });
    });

    it("breaks the current streak and records missed days when the last check-in is 2 days old", () => {
      expect(computeStreak([ci(ago(2))])).toEqual({
        current: 0,
        longest: 1,
        missedDays: 2,
      });
    });

    it("counts a consecutive run ending today", () => {
      expect(computeStreak([ci(ago(0)), ci(ago(1)), ci(ago(2))])).toEqual({
        current: 3,
        longest: 3,
        missedDays: 0,
      });
    });

    it("is order-independent (sorts internally)", () => {
      expect(computeStreak([ci(ago(2)), ci(ago(0)), ci(ago(1))]).current).toBe(3);
    });

    it("does not extend the current streak across a gap", () => {
      // gap on day 2 -> only today + yesterday count toward current
      expect(computeStreak([ci(ago(0)), ci(ago(1)), ci(ago(3))]).current).toBe(2);
    });

    it("reports longest as a past run that exceeds the current streak", () => {
      const r = computeStreak([
        ci(ago(0)),
        ci(ago(1)), // current run of 2
        ci(ago(10)),
        ci(ago(11)),
        ci(ago(12)),
        ci(ago(13)),
        ci(ago(14)), // past run of 5
      ]);
      expect(r.current).toBe(2);
      expect(r.longest).toBe(5);
      expect(r.missedDays).toBe(0);
    });

    it("reports missed days when the most recent check-in is old", () => {
      const r = computeStreak([ci(ago(5)), ci(ago(6))]);
      expect(r.current).toBe(0);
      expect(r.missedDays).toBe(5);
    });
  });

  describe("computeJourneyStats", () => {
    const journey = (startDaysAgo: number): Journey => ({
      id: "j1",
      name: "Test",
      intention: "",
      createdAt: `${ago(startDaysAgo)}T00:00:00.000Z`,
      startDate: ago(startDaysAgo),
    });
    const noHistory = {
      scars: [] as Scar[],
      unlockedMilestones: [] as UnlockedMilestone[],
    };

    it("zeroes a fresh journey and reports struggling/worried with no last check-in", () => {
      const s = computeJourneyStats({ journey: journey(0), checkIns: [], ...noHistory });
      expect(s.currentStreak).toBe(0);
      expect(s.totalCheckIns).toBe(0);
      expect(s.totalMissed).toBe(0);
      expect(s.journeyDaysOld).toBe(0);
      expect(s.recoveries).toBe(0);
      expect(s.scarCount).toBe(0);
      expect(s.lastCheckInDate).toBeNull();
      expect(s.environmentState).toBe("struggling");
      expect(s.companionState).toBe("worried");
    });

    it("computes totalMissed as journey age minus check-in count", () => {
      const s = computeJourneyStats({
        journey: journey(10),
        checkIns: [ci(ago(0)), ci(ago(1))],
        ...noHistory,
      });
      expect(s.journeyDaysOld).toBe(10);
      expect(s.totalMissed).toBe(8);
    });

    it("never reports negative totalMissed (more check-ins than days old)", () => {
      const s = computeJourneyStats({
        journey: journey(1),
        checkIns: [ci(ago(0)), ci(ago(1)), ci(ago(2))],
        ...noHistory,
      });
      expect(s.totalMissed).toBe(0);
    });

    it("reports the most recent check-in as lastCheckInDate", () => {
      const s = computeJourneyStats({
        journey: journey(10),
        checkIns: [ci(ago(3)), ci(ago(0)), ci(ago(1))],
        ...noHistory,
      });
      expect(s.lastCheckInDate).toBe(ago(0));
    });

    it("counts a recovery when a check-in follows a scar", () => {
      const scar: Scar = {
        id: "s1",
        journeyId: "j1",
        brokenAt: ago(5),
        streakAtBreak: 4,
        description: "broke",
      };
      const s = computeJourneyStats({
        journey: journey(20),
        checkIns: [ci(ago(0)), ci(ago(1)), ci(ago(2))],
        scars: [scar],
        unlockedMilestones: [],
      });
      expect(s.scarCount).toBe(1);
      expect(s.recoveries).toBe(1);
    });

    it("does not count a recovery when no check-in follows the scar", () => {
      const scar: Scar = {
        id: "s1",
        journeyId: "j1",
        brokenAt: ago(0),
        streakAtBreak: 4,
        description: "broke",
      };
      const s = computeJourneyStats({
        journey: journey(20),
        checkIns: [ci(ago(3))],
        scars: [scar],
        unlockedMilestones: [],
      });
      expect(s.recoveries).toBe(0);
    });
  });

  describe("checkForNewMilestones", () => {
    const stats = (over: Partial<JourneyStats>): JourneyStats => ({
      currentStreak: 0,
      longestStreak: 0,
      totalCheckIns: 0,
      totalMissed: 0,
      recoveries: 0,
      journeyDaysOld: 0,
      scarCount: 0,
      lastCheckInDate: null,
      environmentState: "struggling",
      companionState: "worried",
      missedDays: 0,
      ...over,
    });

    it("returns newly-unlocked milestones stamped with the current ISO time", () => {
      const r = checkForNewMilestones(stats({ totalCheckIns: 1 }), []);
      expect(r.map((m) => m.id)).toContain("first_flame");
      expect(r[0].unlockedAt).toBe(FROZEN.toISOString());
    });

    it("does not re-emit already-unlocked milestones", () => {
      const r = checkForNewMilestones(stats({ totalCheckIns: 1 }), [
        { id: "first_flame", unlockedAt: "2026-01-01T00:00:00.000Z" },
      ]);
      expect(r.map((m) => m.id)).not.toContain("first_flame");
    });
  });
});
