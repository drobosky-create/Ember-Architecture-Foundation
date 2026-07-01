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
 * All thresholds are read from the ENVIRONMENT_STATES config above so the
 * logic and the data can never disagree. The resulting behaviour is:
 *   - dormant:    missedDays > 7   (critical.missedDaysMax)
 *   - critical:   missedDays 4–7   (> struggling.missedDaysMax)
 *   - struggling: missedDays 2–3   (> stable.missedDaysMax)  OR  streak 1–2
 *   - stable:     streak 3–6       (with ≤ 1 missed)
 *   - thriving:   streak ≥ 7       (with ≤ 1 missed)
 */
export function computeEnvironmentState(
  currentStreak: number,
  missedDays: number
): EnvironmentState {
  const S = ENVIRONMENT_STATES;

  // Missed days take priority: exceeding a tier's tolerance drops below it.
  if (missedDays > S.critical.missedDaysMax) return "dormant";
  if (missedDays > S.struggling.missedDaysMax) return "critical";
  if (missedDays > S.stable.missedDaysMax) return "struggling";

  // With missed days in range (0–1), the streak picks the tier by its floor.
  if (currentStreak >= S.thriving.streakMin) return "thriving";
  if (currentStreak >= S.stable.streakMin) return "stable";
  if (currentStreak >= S.struggling.streakMin) return "struggling";

  // streak is 0 with ≤ 1 missed day (e.g. last check-in was yesterday).
  return "struggling";
}
