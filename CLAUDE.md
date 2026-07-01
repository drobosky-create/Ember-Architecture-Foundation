# Ember — Project Guide for Claude Code

Emotional accountability app: daily commitment "journeys", check-ins, streaks, a 5-state
environment engine (Thriving → Stable → Struggling → Critical → Dormant), a symbolic
companion, 10 milestones, and a permanent scar/recovery system for broken streaks.

Originally scaffolded in Replit. See `replit.md` for the original notes and `AUDIT-2026-06-29.md`
for the current known-issues list (theme + hygiene).

## Commands

```bash
pnpm install                                      # required first; node_modules not committed
pnpm --filter @workspace/ember run dev            # run the frontend (PORT + BASE_PATH env vars required)
pnpm --filter @workspace/api-server run dev       # run the API server (port 5000) — not yet wired into the app
pnpm run typecheck                                # full typecheck across all packages
pnpm run build                                    # typecheck + build all packages
pnpm --filter @workspace/api-spec run codegen     # regenerate API client/zod after editing openapi.yaml
```

Notes:
- **pnpm only.** `preinstall` rejects npm/yarn. Node 24, TypeScript 5.9.
- `vite.config.ts` requires `PORT` and `BASE_PATH` env vars or it throws.
- `.npmrc` enforces a 1-day `minimumReleaseAge` on new packages (supply-chain defense). Do not disable it; use the `minimumReleaseAgeExclude` allowlist only for trusted, urgent cases.

## Workspace layout

pnpm workspaces. `artifacts/*` = apps, `lib/*` = shared packages, `scripts` = tooling.

- `artifacts/ember` — the app (React + Vite + Wouter, Zustand state persisted to localStorage). **This is where nearly all work happens.**
- `artifacts/api-server` — Express-style API scaffold (health route only; not wired to the app yet).
- `artifacts/mockup-sandbox` — shadcn/ui component sandbox. **Not imported by the app.** Likely the source of the dependency bloat noted below.
- `lib/api-spec` (OpenAPI + Orval), `lib/api-zod`, `lib/api-client-react`, `lib/db` (Drizzle/Postgres) — backend scaffold, generated code, **not yet wired**.

### Inside `artifacts/ember/src`
- `lib/config/tokens.ts` — **design-token source of truth**: colors, typography, spacing, shadows, borderRadius, animation, plus `environmentPalette` and `companionPalette`.
- `lib/config/environment-states.ts` — 5 environment states + transition logic.
- `lib/config/companion-states.ts` — 5 companion states + mapping.
- `lib/config/milestone-rules.ts` — 10 milestones + unlock conditions.
- `lib/state/useJourneyStore.ts` — Zustand store (journeys, check-ins, scars, milestones). Persist key: `ember-journey-store`.
- `lib/state/types.ts` — shared types.
- `lib/utils/engine.ts` — streak/stats engine + milestone checker (kept separate from the store; unit-testable).
- `lib/utils/date.ts` — date helpers.
- `components/`, `pages/` — UI. Path alias `@/` → `artifacts/ember/src`.

## Conventions

- **Token-first styling (the core rule).** Every visual value — color, font size, spacing, radius, shadow, timing — must come from `tokens.ts`. Do **not** hardcode hex colors or raw px/rem in component style objects. The environment state drives the page palette via `environmentPalette`.
- **Engine separation.** Streak/stats logic lives in `lib/utils/engine.ts`, never in the store or components.
- **Scars are permanent.** Breaking a streak writes a Scar to history; it's a visible, permanent record. Don't "clean up" scars.
- Inline styles are token-driven; Tailwind v4 is used only for the base reset in `index.css`.

## Known issues (from the audit — start here)

The "single-source theme" goal was not met. Full detail in `AUDIT-2026-06-29.md`. Summary:
1. Brand colors are defined in 3 places (`tokens.ts`, `index.css :root`, `index.css @theme`/`body`) with no link.
2. ~44 hardcoded hex colors + 45+ hardcoded spacing/font values across components/pages bypass the tokens.
3. `colors`, `typography`, `spacing`, `shadows`, `borderRadius` exports in `tokens.ts` are unused (dead); only `environmentPalette`/`companionPalette` are consumed. `--ember` CSS vars in `index.css` are referenced 0 times.
4. `ember/package.json` declares ~50 deps (full Radix/shadcn stack); the app imports only react, react-dom, wouter, zustand.
5. `vite.config.ts` `@assets` alias points to a nonexistent `attached_assets/` dir.

## Gotchas

- `simulateMissedDays` shifts all check-in dates backward — a prototype testing convenience, not a production feature.
- Always run the `api-spec` codegen after editing `lib/api-spec/openapi.yaml` before building.
- No backend persistence yet — all state is localStorage via Zustand `persist`.
