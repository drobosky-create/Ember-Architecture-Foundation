import { computeEnvironmentState } from "@/lib/config/environment-states";
import { computeCompanionState } from "@/lib/config/companion-states";
import {
  computeUnlockedMilestones,
  type MilestoneStats,
} from "@/lib/config/milestone-rules";
import type {
  CheckIn,
  JourneyData,
  JourneyStats,
  Scar,
  UnlockedMilestone,
} from "@/lib/state/types";
import { todayString, daysBetween, isToday, isYesterday } from "./date";

export function computeStreak(checkIns: CheckIn[]): {
  current: number;
  longest: number;
  missedDays: number;
} {
  if (checkIns.length === 0) {
    return { current: 0, longest: 0, missedDays: 0 };
  }

  const sorted = [...checkIns]
    .map((c) => c.date)
    .sort()
    .reverse();

  const today = todayString();
  const mostRecent = sorted[0];

  let missedDays = 0;
  if (!isToday(mostRecent) && !isYesterday(mostRecent)) {
    missedDays = daysBetween(mostRecent, today);
  }

  let currentStreak = 0;
  if (isToday(mostRecent) || isYesterday(mostRecent)) {
    currentStreak = 1;
    let prev = mostRecent;
    for (let i = 1; i < sorted.length; i++) {
      const diff = daysBetween(sorted[i], prev);
      if (diff === 1) {
        currentStreak++;
        prev = sorted[i];
      } else {
        break;
      }
    }
  }

  let longest = 0;
  let run = 1;
  const asc = [...sorted].reverse();
  for (let i = 1; i < asc.length; i++) {
    const diff = daysBetween(asc[i - 1], asc[i]);
    if (diff === 1) {
      run++;
      if (run > longest) longest = run;
    } else {
      run = 1;
    }
  }
  if (asc.length === 1) longest = 1;
  if (currentStreak > longest) longest = currentStreak;

  return { current: currentStreak, longest, missedDays };
}

export function computeJourneyStats(data: {
  journey: JourneyData["journey"];
  checkIns: CheckIn[];
  scars: Scar[];
  unlockedMilestones: UnlockedMilestone[];
}): JourneyStats {
  const { journey, checkIns, scars } = data;

  const { current, longest, missedDays } = computeStreak(checkIns);
  const journeyDaysOld = daysBetween(journey.startDate, todayString());
  const totalMissed = Math.max(0, journeyDaysOld - checkIns.length);
  const lastCheckInDate =
    checkIns.length > 0
      ? [...checkIns].sort((a, b) => b.date.localeCompare(a.date))[0].date
      : null;

  const environmentState = computeEnvironmentState(current, missedDays);
  const companionState = computeCompanionState(environmentState);

  const recoveries = scars.filter((s) => {
    const checkInsAfter = checkIns.filter((c) => c.date > s.brokenAt);
    return checkInsAfter.length >= 1;
  }).length;

  return {
    currentStreak: current,
    longestStreak: longest,
    totalCheckIns: checkIns.length,
    totalMissed,
    recoveries,
    journeyDaysOld,
    scarCount: scars.length,
    lastCheckInDate,
    environmentState,
    companionState,
    missedDays,
  };
}

export function checkForNewMilestones(
  stats: JourneyStats,
  alreadyUnlocked: UnlockedMilestone[]
): UnlockedMilestone[] {
  const milestoneStats: MilestoneStats = {
    currentStreak: stats.currentStreak,
    longestStreak: stats.longestStreak,
    totalCheckIns: stats.totalCheckIns,
    totalMissed: stats.totalMissed,
    recoveries: stats.recoveries,
    journeyDaysOld: stats.journeyDaysOld,
    scarCount: stats.scarCount,
  };

  const alreadyIds = alreadyUnlocked.map((m) => m.id);
  const newIds = computeUnlockedMilestones(milestoneStats, alreadyIds);
  const now = new Date().toISOString();
  return newIds.map((id) => ({ id, unlockedAt: now }));
}

export function shouldCreateScar(
  checkIns: CheckIn[],
  previousMissedDays: number
): boolean {
  return previousMissedDays > 0 && checkIns.length > 0;
}
