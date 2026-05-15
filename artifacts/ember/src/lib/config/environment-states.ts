export type EnvironmentState =
  | "thriving"
  | "stable"
  | "struggling"
  | "critical"
  | "dormant";

export interface EnvironmentStateConfig {
  id: EnvironmentState;
  label: string;
  description: string;
  streakMin: number;
  streakMax: number | null;
  missedDaysMax: number;
  symbolGlyph: string;
  ambience: string;
}

export const ENVIRONMENT_STATES: Record<EnvironmentState, EnvironmentStateConfig> = {
  thriving: {
    id: "thriving",
    label: "Thriving",
    description: "The environment blooms with life. Your streak burns strong.",
    streakMin: 7,
    streakMax: null,
    missedDaysMax: 0,
    symbolGlyph: "◈",
    ambience: "Warm greens, flickering growth",
  },
  stable: {
    id: "stable",
    label: "Stable",
    description: "A steady ember glows. The path is clear.",
    streakMin: 3,
    streakMax: 6,
    missedDaysMax: 1,
    symbolGlyph: "◉",
    ambience: "Cool blues, gentle hum",
  },
  struggling: {
    id: "struggling",
    label: "Struggling",
    description: "The flame flickers. The environment grows dim.",
    streakMin: 1,
    streakMax: 2,
    missedDaysMax: 3,
    symbolGlyph: "◌",
    ambience: "Amber haze, restless shadows",
  },
  critical: {
    id: "critical",
    label: "Critical",
    description: "The ember nearly dies. Return before it's too late.",
    streakMin: 0,
    streakMax: 0,
    missedDaysMax: 7,
    symbolGlyph: "◎",
    ambience: "Deep reds, fractured light",
  },
  dormant: {
    id: "dormant",
    label: "Dormant",
    description: "The flame has gone out. Only ash remains.",
    streakMin: 0,
    streakMax: 0,
    missedDaysMax: Infinity,
    symbolGlyph: "○",
    ambience: "Cold darkness, silence",
  },
};

/**
 * Derives the environment state from streak and missed-day counts.
 *
 * Thresholds match the EnvironmentStateConfig values above:
 *   - dormant:   missedDays > 7
 *   - critical:  missedDays 4–7
 *   - struggling: missedDays 2–3  OR  streak 1–2 (with 0 missed)
 *   - stable:    streak 3–6 (with ≤ 1 missed)
 *   - thriving:  streak ≥ 7 (with 0 missed)
 */
export function computeEnvironmentState(
  currentStreak: number,
  missedDays: number
): EnvironmentState {
  if (missedDays > 7) return "dormant";
  if (missedDays > 3) return "critical";
  if (missedDays > 1) return "struggling";
  // missedDays is 0 or 1 beyond this point
  if (currentStreak >= 7) return "thriving";
  if (currentStreak >= 3) return "stable";
  if (currentStreak >= 1) return "struggling";
  // streak is 0: last check-in was exactly 1 day ago (missedDays === 1)
  return "struggling";
}
