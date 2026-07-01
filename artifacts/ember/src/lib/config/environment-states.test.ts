import { describe, it, expect } from "vitest";
import { computeEnvironmentState, ENVIRONMENT_STATES } from "./environment-states";

describe("computeEnvironmentState", () => {
  it("is thriving at streak >= 7 with no/low missed days", () => {
    expect(computeEnvironmentState(7, 0)).toBe("thriving");
    expect(computeEnvironmentState(30, 1)).toBe("thriving");
  });

  it("is stable at streak 3-6", () => {
    expect(computeEnvironmentState(3, 0)).toBe("stable");
    expect(computeEnvironmentState(6, 1)).toBe("stable");
  });

  it("is struggling at streak 1-2", () => {
    expect(computeEnvironmentState(1, 0)).toBe("struggling");
    expect(computeEnvironmentState(2, 1)).toBe("struggling");
  });

  it("is struggling for a brand-new journey (streak 0, 0 missed) — current behavior", () => {
    expect(computeEnvironmentState(0, 0)).toBe("struggling");
  });

  it("lets missed days dominate the streak: 2-3 missed -> struggling", () => {
    expect(computeEnvironmentState(30, 2)).toBe("struggling");
    expect(computeEnvironmentState(0, 3)).toBe("struggling");
  });

  it("is critical at 4-7 missed days", () => {
    expect(computeEnvironmentState(10, 4)).toBe("critical");
    expect(computeEnvironmentState(0, 7)).toBe("critical");
  });

  it("is dormant beyond 7 missed days", () => {
    expect(computeEnvironmentState(0, 8)).toBe("dormant");
    expect(computeEnvironmentState(100, 365)).toBe("dormant");
  });

  it("treats exactly 1 missed day as still in-streak (defers to streak thresholds)", () => {
    expect(computeEnvironmentState(7, 1)).toBe("thriving");
    expect(computeEnvironmentState(3, 1)).toBe("stable");
    expect(computeEnvironmentState(0, 1)).toBe("struggling");
  });
});

// computeEnvironmentState now derives its thresholds from ENVIRONMENT_STATES,
// so these guard that the config and the logic stay in agreement.
describe("ENVIRONMENT_STATES config ↔ computeEnvironmentState", () => {
  it("has contiguous streak bands (each tier's max + 1 = next tier's min)", () => {
    expect(ENVIRONMENT_STATES.struggling.streakMax! + 1).toBe(ENVIRONMENT_STATES.stable.streakMin);
    expect(ENVIRONMENT_STATES.stable.streakMax! + 1).toBe(ENVIRONMENT_STATES.thriving.streakMin);
  });

  it("has monotonically increasing missed-day tolerance", () => {
    const { thriving, stable, struggling, critical, dormant } = ENVIRONMENT_STATES;
    expect(thriving.missedDaysMax).toBeLessThan(stable.missedDaysMax);
    expect(stable.missedDaysMax).toBeLessThan(struggling.missedDaysMax);
    expect(struggling.missedDaysMax).toBeLessThan(critical.missedDaysMax);
    expect(critical.missedDaysMax).toBeLessThan(dormant.missedDaysMax);
  });

  it("resolves both ends of each streak band to its declared state (0 missed days)", () => {
    for (const id of ["struggling", "stable", "thriving"] as const) {
      const { streakMin, streakMax } = ENVIRONMENT_STATES[id];
      expect(computeEnvironmentState(streakMin, 0)).toBe(id);
      if (streakMax !== null) {
        expect(computeEnvironmentState(streakMax, 0)).toBe(id);
      }
    }
  });
});
