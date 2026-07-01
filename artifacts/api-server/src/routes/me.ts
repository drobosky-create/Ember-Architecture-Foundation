import { Router, type IRouter } from "express";
import { getAuth } from "@clerk/express";
import { db, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { requireUser } from "../middlewares/require-user";

const router: IRouter = Router();

// Current user's app profile. requireUser 401s if there's no valid Clerk
// session. On first hit we lazily create the user row (keyed by Clerk id).
router.get("/me", requireUser, async (req, res) => {
  const { userId } = getAuth(req);
  await db.insert(usersTable).values({ id: userId! }).onConflictDoNothing();
  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.id, userId!));

  res.json({
    id: user.id,
    subscriptionStatus: user.subscriptionStatus,
    aiReflectionOptIn: user.aiReflectionOptIn,
  });
});

export default router;
