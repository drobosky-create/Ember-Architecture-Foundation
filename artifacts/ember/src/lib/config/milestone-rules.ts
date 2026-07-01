import type { JourneyStats } from "@/lib/state/types";

export type MilestoneId =
  | "first_flame"
  | "three_day_ember"
  | "one_week_glow"
  | "two_week_burn"
  | "one_month_fire"
  | "scar_bearer"
  | "recovery_arc"
  | "resilience_mark"
  | "century"
  | "year_mark";

export type MilestoneType = "streak" | "recovery" | "symbolic" | "temporal";

export interface Milestone {
  id: MilestoneId;
  type: MilestoneType;
  label: string;
  description: string;
  glyph: string;
  condition: (stats: MilestoneStats) => boolean;
  unlockMessage: string;
}

/**
 * The subset of JourneyStats that milestone conditions read. Derived from
 * JourneyStats via Pick (not redeclared) so the two can never drift apart —
 * a JourneyStats can be passed directly wherever MilestoneStats is expected.
 */
export type MilestoneStats = Pick<
  JourneyStats,
  | "currentStreak"
  | "longestStreak"
  | "totalCheckIns"
  | "totalMissed"
  | "recoveries"
  | "journeyDaysOld"
  | "scarCount"
>;

export const MILESTONES: Record<MilestoneId, Milestone> = {
  first_flame: {
    id: "first_flame",
    type: "streak",
    label: "First Flame",
    description: "You checked in for the first time.",
    glyph: "◈",
    condition: (s) => s.totalCheckIns >= 1,
    unlockMessage: "The ember is lit. It begins here.",
  },
  three_day_ember: {
    id: "three_day_ember",
    type: "streak",
    label: "Three Day Ember",
    description: "You held on for three days straight.",
    glyph: "◉",
    condition: (s) => s.currentStreak >= 3,
    unlockMessage: "Three days. The ember strengthens.",
  },
  one_week_glow: {
    id: "one_week_glow",
    type: "streak",
    label: "One Week Glow",
    description: "Seven days. A full cycle of commitment.",
    glyph: "◐",
    condition: (s) => s.currentStreak >= 7,
    unlockMessage: "A full week burns. The environment transforms.",
  },
  two_week_burn: {
    id: "two_week_burn",
    type: "streak",
    label: "Two Week Burn",
    description: "Fourteen consecutive days of showing up.",
    glyph: "◑",
    condition: (s) => s.currentStreak >= 14,
    unlockMessage: "Fourteen days. The habit forms into ritual.",
  },
  one_month_fire: {
    id: "one_month_fire",
    type: "streak",
    label: "One Month Fire",
    description: "Thirty days of unbroken commitment.",
    glyph: "◆",
    condition: (s) => s.currentStreak >= 30,
    unlockMessage: "Thirty days. You are the flame.",
  },
  scar_bearer: {
    id: "scar_bearer",
    type: "symbolic",
    label: "Scar Bearer",
    description: "You broke a streak but returned. This mark remains.",
    glyph: "✕",
    condition: (s) => s.scarCount >= 1,
    unlockMessage: "A scar forms — proof you fell and returned.",
  },
  recovery_arc: {
    id: "recovery_arc",
    type: "recovery",
    label: "Recovery Arc",
    description: "After breaking a streak, you rebuilt to 3 days.",
    glyph: "◗",
    condition: (s) => s.recoveries >= 1 && s.currentStreak >= 3,
    unlockMessage: "From ash, the ember rises again.",
  },
  resilience_mark: {
    id: "resilience_mark",
    type: "recovery",
    label: "Resilience Mark",
    description: "You have recovered from a missed streak twice.",
    glyph: "✦",
    condition: (s) => s.recoveries >= 2,
    unlockMessage: "Twice you returned. Resilience is your nature.",
  },
  century: {
    id: "century",
    type: "temporal",
    label: "Century",
    description: "One hundred check-ins total.",
    glyph: "⊙",
    condition: (s) => s.totalCheckIns >= 100,
    unlockMessage: "One hundred moments of choosing yourself.",
  },
  year_mark: {
    id: "year_mark",
    type: "temporal",
    label: "Year Mark",
    description: "Your journey has lasted one full year.",
    glyph: "◎",
    condition: (s) => s.journeyDaysOld >= 365,
    unlockMessage: "A year. The flame endures.",
  },
};

export function computeUnlockedMilestones(
  stats: MilestoneStats,
  alreadyUnlocked: MilestoneId[]
): MilestoneId[] {
  const newlyUnlocked: MilestoneId[] = [];
  for (const [id, milestone] of Object.entries(MILESTONES)) {
    if (!alreadyUnlocked.includes(id as MilestoneId)) {
      if (milestone.condition(stats)) {
        newlyUnlocked.push(id as MilestoneId);
      }
    }
  }
  return newlyUnlocked;
}
