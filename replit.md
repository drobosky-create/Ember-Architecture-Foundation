# Ember

An emotional accountability app built around daily commitment rituals, symbolic progression, and environmental state changes.

## Run & Operate

- `pnpm --filter @workspace/ember run dev` — run the Ember frontend (port auto-assigned)
- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite + Wouter routing
- State: Zustand (persisted via localStorage)
- Styling: Inline styles (token-driven), Tailwind v4 for base reset
- DB: PostgreSQL + Drizzle ORM (not yet wired)
- API codegen: Orval (from OpenAPI spec)

## Where things live

- `artifacts/ember/src/lib/config/tokens.ts` — Single source of truth: colors, typography, spacing, shadows, border-radius, animation timing
- `artifacts/ember/src/lib/config/environment-states.ts` — All 5 environment states + transition logic
- `artifacts/ember/src/lib/config/companion-states.ts` — All 5 companion states + mapping logic
- `artifacts/ember/src/lib/config/milestone-rules.ts` — All 10 milestones + unlock conditions
- `artifacts/ember/src/lib/state/useJourneyStore.ts` — Zustand store: journeys, check-ins, scars, milestones
- `artifacts/ember/src/lib/state/types.ts` — All shared TypeScript types
- `artifacts/ember/src/lib/utils/engine.ts` — Streak computation, stats engine, milestone checker
- `artifacts/ember/src/lib/utils/date.ts` — Date helpers
- `artifacts/ember/src/components/` — Reusable UI components
- `artifacts/ember/src/pages/` — Page-level components (CreateJourney, Dashboard)

## Architecture decisions

- **No backend yet** — all state is Zustand-persisted to localStorage for prototyping velocity. Backend will be added when the product surface is finalized.
- **Token-first design system** — all visual properties derive from `tokens.ts` constants, never hardcoded. Environment state changes drive the entire page palette.
- **Engine separation** — streak/stats logic lives in `lib/utils/engine.ts`, completely separate from the store. Easy to unit test and reuse.
- **Scar system** — when a streak is broken and the user returns, a Scar is written to history. Scars are permanent, visible records of past breaks.
- **Milestone system** — milestones are computed declaratively from stats; the engine checks all conditions on each check-in.

## Product

- **Journey creation** — name a commitment, set an intention
- **Daily check-in** — mark yourself present each day with optional note
- **Environment state engine** — the page background and environment panel shift across 5 states (Thriving → Stable → Struggling → Critical → Dormant) based on streak and missed days
- **Companion state engine** — a symbolic companion changes affect/message based on the environment state
- **Streak tracking** — current streak, longest streak, missed days
- **Milestone system** — 10 milestones unlock based on streak/recovery/time conditions
- **Scar + recovery system** — broken streaks leave permanent scars; returning from a break creates recovery arcs
- **Prototype controls** — simulate 3 missed days / reset journey to test all state transitions

## User preferences

_Populate as you build._

## Gotchas

- Always run `pnpm --filter @workspace/api-spec run codegen` after OpenAPI spec changes before building
- The `simulateMissedDays` function shifts all check-in dates backward — this is a prototype convenience, not a production feature
- `zustand/middleware` `persist` is keyed to `ember-journey-store` in localStorage

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
