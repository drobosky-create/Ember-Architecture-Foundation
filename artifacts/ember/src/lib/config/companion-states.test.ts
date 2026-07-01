import { describe, it, expect } from "vitest";
import { computeCompanionState } from "./companion-states";

describe("computeCompanionState", () => {
  it("maps every environment state to its companion", () => {
    expect(computeCompanionState("thriving")).toBe("present");
    expect(computeCompanionState("stable")).toBe("hopeful");
    expect(computeCompanionState("struggling")).toBe("worried");
    expect(computeCompanionState("critical")).toBe("grieving");
    expect(computeCompanionState("dormant")).toBe("dormant");
  });
});
