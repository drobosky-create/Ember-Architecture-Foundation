import { describe, it, expect } from "vitest";
import {
  computeUnlockedMilestones,
  MILESTONES,
  type MilestoneStats,
} from "./milestone-rules";

const base: MilestoneStats = {
  currentStreak: 0,
  longestStreak: 0,
  totalCheckIns: 0,
  totalMissed: 0,
  recoveries: 0,
  journeyDaysOld: 0,
  scarCount: 0,
};

describe("computeUnlockedMilestones", () => {
  it("unlocks nothing for a fresh journey", () => {
    expect(computeUnlockedMilestones(base, [])).toEqual([]);
  });

  it("unlocks first_flame on the first check-in", () => {
    expect(computeUnlockedMilestones({ ...base, totalCheckIns: 1 }, [])).toContain(
      "first_flame",
    );
  });

  it("unlocks streak milestones at their thresholds", () => {
    expect(
      computeUnlockedMilestones({ ...base, totalCheckIns: 3, currentStreak: 3 }, []),
    ).toEqual(expect.arrayContaining(["first_flame", "three_day_ember"]));
    expect(computeUnlockedMilestones({ ...base, currentStreak: 7 }, [])).toContain(
      "one_week_glow",
    );
    expect(computeUnlockedMilestones({ ...base, currentStreak: 14 }, [])).toContain(
      "two_week_burn",
    );
    expect(computeUnlockedMilestones({ ...base, currentStreak: 30 }, [])).toContain(
      "one_month_fire",
    );
  });

  it("does not unlock the two-week milestone one day early", () => {
    expect(
      computeUnlockedMilestones({ ...base, currentStreak: 13 }, []),
    ).not.toContain("two_week_burn");
  });

  it("unlocks scar_bearer once a scar exists", () => {
    expect(computeUnlockedMilestones({ ...base, scarCount: 1 }, [])).toContain(
      "scar_bearer",
    );
  });

  it("requires both a recovery AND a 3-day streak for recovery_arc", () => {
    expect(
      computeUnlockedMilestones({ ...base, recoveries: 1, currentStreak: 2 }, []),
    ).not.toContain("recovery_arc");
    expect(
      computeUnlockedMilestones({ ...base, recoveries: 1, currentStreak: 3 }, []),
    ).toContain("recovery_arc");
  });

  it("requires two recoveries for resilience_mark", () => {
    expect(
      computeUnlockedMilestones({ ...base, recoveries: 1 }, []),
    ).not.toContain("resilience_mark");
    expect(
      computeUnlockedMilestones({ ...base, recoveries: 2 }, []),
    ).toContain("resilience_mark");
  });

  it("unlocks temporal milestones at 100 check-ins / 365 days", () => {
    expect(computeUnlockedMilestones({ ...base, totalCheckIns: 100 }, [])).toContain(
      "century",
    );
    expect(computeUnlockedMilestones({ ...base, journeyDaysOld: 365 }, [])).toContain(
      "year_mark",
    );
  });

  it("never re-emits an already-unlocked milestone", () => {
    expect(
      computeUnlockedMilestones({ ...base, totalCheckIns: 1 }, ["first_flame"]),
    ).not.toContain("first_flame");
  });

  it("keeps the MilestoneId union and the MILESTONES record in sync (10 entries)", () => {
    expect(Object.keys(MILESTONES)).toHaveLength(10);
    for (const [id, m] of Object.entries(MILESTONES)) {
      expect(m.id).toBe(id);
    }
  });

  it("gives every milestone a unique glyph", () => {
    const glyphs = Object.values(MILESTONES).map((m) => m.glyph);
    expect(new Set(glyphs).size).toBe(glyphs.length);
  });
});
