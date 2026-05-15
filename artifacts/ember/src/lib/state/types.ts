import type { EnvironmentState } from "@/lib/config/environment-states";
import type { CompanionState } from "@/lib/config/companion-states";
import type { MilestoneId } from "@/lib/config/milestone-rules";

export interface Journey {
  id: string;
  name: string;
  intention: string;
  createdAt: string;
  startDate: string;
}

export interface CheckIn {
  id: string;
  journeyId: string;
  date: string;
  note: string;
  completedAt: string;
}

export interface Scar {
  id: string;
  journeyId: string;
  brokenAt: string;
  streakAtBreak: number;
  description: string;
}

/**
 * Derived stats computed on demand from raw JourneyData.
 * Never persisted — always recomputed from source of truth.
 */
export interface JourneyStats {
  currentStreak: number;
  longestStreak: number;
  totalCheckIns: number;
  totalMissed: number;
  recoveries: number;
  journeyDaysOld: number;
  scarCount: number;
  lastCheckInDate: string | null;
  environmentState: EnvironmentState;
  companionState: CompanionState;
  missedDays: number;
}

export interface UnlockedMilestone {
  id: MilestoneId;
  unlockedAt: string;
}

/**
 * Raw persisted journey data. No derived fields.
 * Stats are computed from this via computeJourneyStats().
 */
export interface JourneyData {
  journey: Journey;
  checkIns: CheckIn[];
  scars: Scar[];
  unlockedMilestones: UnlockedMilestone[];
}
