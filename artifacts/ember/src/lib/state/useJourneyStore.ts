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
  resetJourney: (journeyId: string) => void;
}

function generateId(): string {
  return Math.random().toString(36).slice(2, 10);
}

export const useJourneyStore = create<JourneyStore>()(
  persist(
    (set) => ({
      activeJourneyId: null,
      journeys: {},
      pendingMilestones: [],

      createJourney: (name, intention) => {
        const id = generateId();
        const journey: Journey = {
          id,
          name,
          intention,
          createdAt: new Date().toISOString(),
          startDate: todayString(),
        };
        const journeyData: JourneyData = {
          journey,
          checkIns: [],
          scars: [],
          unlockedMilestones: [],
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

          const { current: prevStreak, missedDays } = computeStreak(data.checkIns);

          const newScars: Scar[] = [];
          if (missedDays > 0 && data.checkIns.length > 0) {
            newScars.push({
              id: generateId(),
              journeyId,
              brokenAt: today,
              streakAtBreak: prevStreak,
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

          // Compute stats temporarily to detect newly unlocked milestones.
          // Stats themselves are not stored — they are derived on read.
          const tempStats = computeJourneyStats({
            journey: data.journey,
            checkIns: updatedCheckIns,
            scars: updatedScars,
            unlockedMilestones: data.unlockedMilestones,
          });

          const newMilestones = checkForNewMilestones(
            tempStats,
            data.unlockedMilestones
          );

          return {
            journeys: {
              ...state.journeys,
              [journeyId]: {
                ...data,
                checkIns: updatedCheckIns,
                scars: updatedScars,
                unlockedMilestones: [
                  ...data.unlockedMilestones,
                  ...newMilestones,
                ],
              },
            },
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

          return {
            journeys: {
              ...state.journeys,
              [journeyId]: {
                ...data,
                journey: updatedJourney,
                checkIns: shiftedCheckIns,
              },
            },
          };
        });
      },

      clearPendingMilestones: () => set({ pendingMilestones: [] }),

      resetJourney: (journeyId) => {
        set((state) => {
          const data = state.journeys[journeyId];
          if (!data) return state;
          return {
            journeys: {
              ...state.journeys,
              [journeyId]: {
                ...data,
                journey: { ...data.journey, startDate: todayString() },
                checkIns: [],
                scars: [],
                unlockedMilestones: [],
              },
            },
          };
        });
      },
    }),
    {
      name: "ember-journey-store",
    }
  )
);
