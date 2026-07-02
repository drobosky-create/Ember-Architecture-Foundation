import { create } from "zustand";
import type { JourneyData, Scar, UnlockedMilestone } from "./types";
import type { MilestoneId } from "@/lib/config/milestone-rules";
import {
  computeJourneyStats,
  checkForNewMilestones,
  computeStreak,
} from "@/lib/utils/engine";
import { todayString } from "@/lib/utils/date";
import {
  listJourneys as apiListJourneys,
  createJourney as apiCreateJourney,
  checkIn as apiCheckIn,
  resetJourney as apiResetJourney,
  type JourneyData as ApiJourneyData,
} from "@workspace/api-client-react";

type Status = "loading" | "ready";

interface JourneyStore {
  status: Status;
  activeJourneyId: string | null;
  journeys: Record<string, JourneyData>;
  pendingMilestones: UnlockedMilestone[];

  loadJourneys: () => Promise<void>;
  createJourney: (name: string, intention: string) => Promise<string>;
  setActiveJourney: (id: string) => void;
  checkIn: (journeyId: string, note?: string) => Promise<void>;
  resetJourney: (journeyId: string) => Promise<void>;
  clearPendingMilestones: () => void;
}

/** Map the API's JourneyData to the client shape (unlockedMilestones.id). */
function fromApi(jd: ApiJourneyData): JourneyData {
  return {
    journey: jd.journey,
    checkIns: jd.checkIns,
    scars: jd.scars,
    unlockedMilestones: jd.unlockedMilestones.map((m) => ({
      id: m.milestoneId as MilestoneId,
      unlockedAt: m.unlockedAt,
    })),
  };
}

/**
 * API-backed journey store. Persistence lives in the backend (per Clerk user);
 * the engine (streak/scar/milestone logic) still runs client-side — checkIn
 * computes any scar + newly-unlocked milestones and sends them to be persisted.
 */
export const useJourneyStore = create<JourneyStore>((set, get) => ({
  status: "loading",
  activeJourneyId: null,
  journeys: {},
  pendingMilestones: [],

  loadJourneys: async () => {
    try {
      const list = await apiListJourneys();
      const journeys: Record<string, JourneyData> = {};
      for (const jd of list) journeys[jd.journey.id] = fromApi(jd);
      const ids = Object.keys(journeys);
      set({ journeys, activeJourneyId: ids[0] ?? null, status: "ready" });
    } catch (err) {
      console.error("Failed to load journeys", err);
      set({ status: "ready" });
    }
  },

  createJourney: async (name, intention) => {
    const data = fromApi(
      await apiCreateJourney({ name, intention, startDate: todayString() }),
    );
    set((s) => ({
      journeys: { ...s.journeys, [data.journey.id]: data },
      activeJourneyId: data.journey.id,
    }));
    return data.journey.id;
  },

  setActiveJourney: (id) => set({ activeJourneyId: id }),

  checkIn: async (journeyId, note = "") => {
    const data = get().journeys[journeyId];
    if (!data) return;

    const today = todayString();
    if (data.checkIns.some((c) => c.date === today)) return;

    // Engine (client-side) decides whether a scar forms and which milestones
    // unlock; the server just persists the result.
    const { current: prevStreak, missedDays } = computeStreak(data.checkIns);
    const newScar =
      missedDays > 0 && data.checkIns.length > 0
        ? {
            brokenAt: today,
            streakAtBreak: prevStreak,
            description: `Missed ${missedDays} day${missedDays > 1 ? "s" : ""}`,
          }
        : null;

    const projectedCheckIns = [
      ...data.checkIns,
      { id: "pending", journeyId, date: today, note, completedAt: today },
    ];
    const projectedScars: Scar[] = newScar
      ? [...data.scars, { id: "pending", journeyId, ...newScar }]
      : data.scars;
    const stats = computeJourneyStats({
      journey: data.journey,
      checkIns: projectedCheckIns,
      scars: projectedScars,
      unlockedMilestones: data.unlockedMilestones,
    });
    const newMilestones = checkForNewMilestones(stats, data.unlockedMilestones);

    const updated = await apiCheckIn(journeyId, {
      date: today,
      note,
      newScar,
      newMilestoneIds: newMilestones.map((m) => m.id),
    });

    set((s) => ({
      journeys: { ...s.journeys, [journeyId]: fromApi(updated) },
      pendingMilestones: [...s.pendingMilestones, ...newMilestones],
    }));
  },

  resetJourney: async (journeyId) => {
    const updated = fromApi(await apiResetJourney(journeyId));
    set((s) => ({ journeys: { ...s.journeys, [journeyId]: updated } }));
  },

  clearPendingMilestones: () => set({ pendingMilestones: [] }),
}));
