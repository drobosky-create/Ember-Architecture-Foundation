import { Router, type IRouter } from "express";
import { getAuth } from "@clerk/express";
import {
  db,
  usersTable,
  journeysTable,
  checkInsTable,
  scarsTable,
  unlockedMilestonesTable,
} from "@workspace/db";
import { and, eq } from "drizzle-orm";
import { requireUser } from "../middlewares/require-user";

const router: IRouter = Router();

/** Assemble the full JourneyData (journey + children) in the API shape. */
async function loadJourneyData(journeyId: string) {
  const [journey] = await db
    .select()
    .from(journeysTable)
    .where(eq(journeysTable.id, journeyId));
  if (!journey) return null;

  const [checkIns, scars, milestones] = await Promise.all([
    db.select().from(checkInsTable).where(eq(checkInsTable.journeyId, journeyId)),
    db.select().from(scarsTable).where(eq(scarsTable.journeyId, journeyId)),
    db
      .select()
      .from(unlockedMilestonesTable)
      .where(eq(unlockedMilestonesTable.journeyId, journeyId)),
  ]);

  return {
    journey: {
      id: journey.id,
      name: journey.name,
      intention: journey.intention,
      createdAt: journey.createdAt,
      startDate: journey.startDate,
    },
    checkIns: checkIns.map((c) => ({
      id: c.id,
      journeyId: c.journeyId,
      date: c.date,
      note: c.note,
      completedAt: c.completedAt,
    })),
    scars: scars.map((s) => ({
      id: s.id,
      journeyId: s.journeyId,
      brokenAt: s.brokenAt,
      streakAtBreak: s.streakAtBreak,
      description: s.description,
    })),
    unlockedMilestones: milestones.map((m) => ({
      milestoneId: m.milestoneId,
      unlockedAt: m.unlockedAt,
    })),
  };
}

/** Return the journey row iff it belongs to this user, else null. */
async function ownedJourney(journeyId: string, userId: string) {
  const [journey] = await db
    .select()
    .from(journeysTable)
    .where(and(eq(journeysTable.id, journeyId), eq(journeysTable.userId, userId)));
  return journey ?? null;
}

// GET /api/journeys — all of the user's journeys, fully hydrated.
router.get("/journeys", requireUser, async (req, res) => {
  const { userId } = getAuth(req);
  const rows = await db
    .select({ id: journeysTable.id })
    .from(journeysTable)
    .where(eq(journeysTable.userId, userId!));
  const data = await Promise.all(rows.map((r) => loadJourneyData(r.id)));
  res.json(data.filter(Boolean));
});

// POST /api/journeys — create a journey.
router.post("/journeys", requireUser, async (req, res) => {
  const { userId } = getAuth(req);
  const { name, intention, startDate } = req.body ?? {};
  if (typeof name !== "string" || !name || typeof startDate !== "string" || !startDate) {
    res.status(400).json({ error: "name and startDate are required" });
    return;
  }
  await db.insert(usersTable).values({ id: userId! }).onConflictDoNothing();
  const [journey] = await db
    .insert(journeysTable)
    .values({ userId: userId!, name, intention: intention ?? "", startDate })
    .returning();
  res.status(201).json(await loadJourneyData(journey.id));
});

// POST /api/journeys/:journeyId/check-ins — persist a check-in plus any
// client-computed scar / newly-unlocked milestones (idempotent per date).
router.post("/journeys/:journeyId/check-ins", requireUser, async (req, res) => {
  const { userId } = getAuth(req);
  const journeyId = String(req.params.journeyId);
  if (!(await ownedJourney(journeyId, userId!))) {
    res.status(404).json({ error: "journey not found" });
    return;
  }
  const { date, note = "", newScar = null, newMilestoneIds = [] } = req.body ?? {};
  if (typeof date !== "string" || !date) {
    res.status(400).json({ error: "date is required" });
    return;
  }

  await db.transaction(async (tx) => {
    const existing = await tx
      .select({ id: checkInsTable.id })
      .from(checkInsTable)
      .where(and(eq(checkInsTable.journeyId, journeyId), eq(checkInsTable.date, date)));
    if (existing.length === 0) {
      await tx.insert(checkInsTable).values({ journeyId, date, note });
    }
    if (newScar) {
      await tx.insert(scarsTable).values({
        journeyId,
        brokenAt: newScar.brokenAt,
        streakAtBreak: newScar.streakAtBreak,
        description: newScar.description,
      });
    }
    for (const milestoneId of newMilestoneIds as string[]) {
      await tx.insert(unlockedMilestonesTable).values({ journeyId, milestoneId });
    }
  });

  res.json(await loadJourneyData(journeyId));
});

// POST /api/journeys/:journeyId/reset — clear history, restart today.
router.post("/journeys/:journeyId/reset", requireUser, async (req, res) => {
  const { userId } = getAuth(req);
  const journeyId = String(req.params.journeyId);
  if (!(await ownedJourney(journeyId, userId!))) {
    res.status(404).json({ error: "journey not found" });
    return;
  }
  const today = new Date().toISOString().split("T")[0];
  await db.transaction(async (tx) => {
    await tx.delete(checkInsTable).where(eq(checkInsTable.journeyId, journeyId));
    await tx.delete(scarsTable).where(eq(scarsTable.journeyId, journeyId));
    await tx
      .delete(unlockedMilestonesTable)
      .where(eq(unlockedMilestonesTable.journeyId, journeyId));
    await tx
      .update(journeysTable)
      .set({ startDate: today })
      .where(eq(journeysTable.id, journeyId));
  });
  res.json(await loadJourneyData(journeyId));
});

export default router;
