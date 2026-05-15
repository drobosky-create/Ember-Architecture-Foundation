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

export interface JourneyData {
  journey: Journey;
  checkIns: CheckIn[];
  scars: Scar[];
  unlockedMilestones: UnlockedMilestone[];
  stats: JourneyStats;
}
