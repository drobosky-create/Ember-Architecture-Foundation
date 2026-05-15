import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Journey, CheckIn, Scar, UnlockedMilestone, JourneyData } from "./types";
import {
  computeJourneyStats,
  checkForNewMilestones,
  computeStreak,
} from "@/lib/utils/engine";
import { todayString } from "@/lib/utils/date";

interface JourneyStore {
  activeJourneyId: string | null;
  journeys: Record<string, JourneyData>;
  pendingMilestones: UnlockedMilestone[];

  createJourney: (name: string, intention: string) => string;
  setActiveJourney: (id: string) => void;
  checkIn: (journeyId: string, note?: string) => void;
  simulateMissedDays: (journeyId: string, days: number) => void;
  clearPendingMilestones: () => void;
  getActiveJourney: () => JourneyData | null;
  resetJourney: (journeyId: string) => void;
}

function generateId(): string {
  return Math.random().toString(36).slice(2, 10);
}

export const useJourneyStore = create<JourneyStore>()(
  persist(
    (set, get) => ({
      activeJourneyId: null,
      journeys: {},
      pendingMilestones: [],

      createJourney: (name, intention) => {
        const id = generateId();
        const today = todayString();
        const journey: Journey = {
          id,
          name,
          intention,
          createdAt: new Date().toISOString(),
          startDate: today,
        };
        const journeyData: JourneyData = {
          journey,
          checkIns: [],
          scars: [],
          unlockedMilestones: [],
          stats: {
            currentStreak: 0,
            longestStreak: 0,
            totalCheckIns: 0,
            totalMissed: 0,
            recoveries: 0,
            journeyDaysOld: 0,
            scarCount: 0,
            lastCheckInDate: null,
            environmentState: "stable",
            companionState: "hopeful",
            missedDays: 0,
          },
        };
        set((state) => ({
          journeys: { ...state.journeys, [id]: journeyData },
          activeJourneyId: id,
        }));
        return id;
      },

      setActiveJourney: (id) => set({ activeJourneyId: id }),

      checkIn: (journeyId, note = "") => {
        set((state) => {
          const data = state.journeys[journeyId];
          if (!data) return state;

          const today = todayString();
          const alreadyCheckedIn = data.checkIns.some((c) => c.date === today);
          if (alreadyCheckedIn) return state;

          const { missedDays } = computeStreak(data.checkIns);
          const newScars: Scar[] = [];
          if (missedDays > 0 && data.checkIns.length > 0) {
            newScars.push({
              id: generateId(),
              journeyId,
              brokenAt: today,
              streakAtBreak: data.stats.currentStreak,
              description: `Missed ${missedDays} day${missedDays > 1 ? "s" : ""}`,
            });
          }

          const newCheckIn: CheckIn = {
            id: generateId(),
            journeyId,
            date: today,
            note,
            completedAt: new Date().toISOString(),
          };

          const updatedCheckIns = [...data.checkIns, newCheckIn];
          const updatedScars = [...data.scars, ...newScars];

          const newStats = computeJourneyStats({
            journey: data.journey,
            checkIns: updatedCheckIns,
            scars: updatedScars,
            unlockedMilestones: data.unlockedMilestones,
          });

          const newMilestones = checkForNewMilestones(
            newStats,
            data.unlockedMilestones
          );

          const updatedData: JourneyData = {
            ...data,
            checkIns: updatedCheckIns,
            scars: updatedScars,
            unlockedMilestones: [
              ...data.unlockedMilestones,
              ...newMilestones,
            ],
            stats: newStats,
          };

          return {
            journeys: { ...state.journeys, [journeyId]: updatedData },
            pendingMilestones: [
              ...state.pendingMilestones,
              ...newMilestones,
            ],
          };
        });
      },

      simulateMissedDays: (journeyId, days) => {
        set((state) => {
          const data = state.journeys[journeyId];
          if (!data) return state;

          const lastCheckIn =
            data.checkIns.length > 0
              ? [...data.checkIns].sort((a, b) =>
                  b.date.localeCompare(a.date)
                )[0]
              : null;

          const baseDate = lastCheckIn ? lastCheckIn.date : data.journey.startDate;
          const targetDate = new Date(baseDate);
          targetDate.setDate(targetDate.getDate() - days);

          const shiftedCheckIns = data.checkIns.map((c) => {
            const d = new Date(c.date);
            d.setDate(d.getDate() - days);
            return { ...c, date: d.toISOString().split("T")[0] };
          });

          const updatedJourney: Journey = {
            ...data.journey,
            startDate: (() => {
              const d = new Date(data.journey.startDate);
              d.setDate(d.getDate() - days);
              return d.toISOString().split("T")[0];
            })(),
          };

          const newStats = computeJourneyStats({
            journey: updatedJourney,
            checkIns: shiftedCheckIns,
            scars: data.scars,
            unlockedMilestones: data.unlockedMilestones,
          });

          return {
            journeys: {
              ...state.journeys,
              [journeyId]: {
                ...data,
                journey: updatedJourney,
                checkIns: shiftedCheckIns,
                stats: newStats,
              },
            },
          };
        });
      },

      clearPendingMilestones: () => set({ pendingMilestones: [] }),

      getActiveJourney: () => {
        const { activeJourneyId, journeys } = get();
        if (!activeJourneyId) return null;
        return journeys[activeJourneyId] ?? null;
      },

      resetJourney: (journeyId) => {
        set((state) => {
          const data = state.journeys[journeyId];
          if (!data) return state;
          const today = todayString();
          const fresh: JourneyData = {
            ...data,
            journey: { ...data.journey, startDate: today },
            checkIns: [],
            scars: [],
            unlockedMilestones: [],
            stats: {
              currentStreak: 0,
              longestStreak: 0,
              totalCheckIns: 0,
              totalMissed: 0,
              recoveries: 0,
              journeyDaysOld: 0,
              scarCount: 0,
              lastCheckInDate: null,
              environmentState: "stable",
              companionState: "hopeful",
              missedDays: 0,
            },
          };
          return { journeys: { ...state.journeys, [journeyId]: fresh } };
        });
      },
    }),
    {
      name: "ember-journey-store",
    }
  )
);
