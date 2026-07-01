import type { RequestHandler } from "express";
import { getAuth } from "@clerk/express";

/**
 * API auth guard: 401s with JSON when there's no valid Clerk session.
 * Unlike Clerk's requireAuth(), it does NOT redirect to a sign-in page —
 * this is a JSON API, so an unauthenticated call should get a 401, not a 302.
 * Relies on clerkMiddleware() being mounted app-wide.
 */
export const requireUser: RequestHandler = (req, res, next) => {
  const { userId } = getAuth(req);
  if (!userId) {
    res.status(401).json({ error: "unauthenticated" });
    return;
  }
  next();
};
