import {
  pgTable,
  text,
  uuid,
  integer,
  boolean,
  timestamp,
  date,
} from "drizzle-orm/pg-core";

/**
 * Ember schema. `users.id` is the Clerk user id (a string). App data is
 * user-scoped; journeys own their check-ins/scars/milestones (cascade delete).
 * Date columns use `mode: "string"` to match the engine's "YYYY-MM-DD" values;
 * derived stats (streaks, environment/companion state) are NOT stored.
 */

export const usersTable = pgTable("users", {
  id: text("id").primaryKey(), // Clerk user id
  stripeCustomerId: text("stripe_customer_id"),
  subscriptionStatus: text("subscription_status"),
  subscriptionPeriodEnd: timestamp("subscription_period_end", { withTimezone: true, mode: "string" }),
  aiReflectionOptIn: boolean("ai_reflection_opt_in").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" }).notNull().defaultNow(),
});

export const journeysTable = pgTable("journeys", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  intention: text("intention").notNull().default(""),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" }).notNull().defaultNow(),
  startDate: date("start_date", { mode: "string" }).notNull(),
});

export const checkInsTable = pgTable("check_ins", {
  id: uuid("id").primaryKey().defaultRandom(),
  journeyId: uuid("journey_id")
    .notNull()
    .references(() => journeysTable.id, { onDelete: "cascade" }),
  date: date("date", { mode: "string" }).notNull(),
  note: text("note").notNull().default(""),
  completedAt: timestamp("completed_at", { withTimezone: true, mode: "string" }).notNull().defaultNow(),
});

export const scarsTable = pgTable("scars", {
  id: uuid("id").primaryKey().defaultRandom(),
  journeyId: uuid("journey_id")
    .notNull()
    .references(() => journeysTable.id, { onDelete: "cascade" }),
  brokenAt: date("broken_at", { mode: "string" }).notNull(),
  streakAtBreak: integer("streak_at_break").notNull(),
  description: text("description").notNull(),
});

export const unlockedMilestonesTable = pgTable("unlocked_milestones", {
  id: uuid("id").primaryKey().defaultRandom(),
  journeyId: uuid("journey_id")
    .notNull()
    .references(() => journeysTable.id, { onDelete: "cascade" }),
  milestoneId: text("milestone_id").notNull(),
  unlockedAt: timestamp("unlocked_at", { withTimezone: true, mode: "string" }).notNull().defaultNow(),
});

export type User = typeof usersTable.$inferSelect;
export type Journey = typeof journeysTable.$inferSelect;
export type CheckIn = typeof checkInsTable.$inferSelect;
export type Scar = typeof scarsTable.$inferSelect;
export type UnlockedMilestone = typeof unlockedMilestonesTable.$inferSelect;
