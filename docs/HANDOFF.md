# Ember — Session Handoff / Status

_Last updated: 2026-07-02. Read this first when resuming in a new chat._

## Current state — Phases 0–2 complete, all on `main` (green)

- **Design system**: `tokens.ts` is the single source for color/spacing/type/radii;
  enforced by `lint:tokens` (bans raw hex/px in `artifacts/ember/src`).
- **Brand art**: animated `EmberMark` (5 environment states + scar overlay), favicon/icons/OG
  from the Manus package (`artifacts/ember/src/assets/brand`, colors via `--ember-*` CSS vars from tokens).
- **Tests**: 52 vitest unit tests for the engine/date/state-machine (`pnpm --filter @workspace/ember run test`).
- **Accounts**: Clerk (`@clerk/clerk-react` front, `@clerk/express` back). Users keyed by Clerk id.
- **Persistence**: per-user journeys/check-ins/scars/milestones in Neon Postgres (Drizzle).
  **Verified end-to-end**: sign in → create journey → persists in Neon → reload loads it back.
- Green on `main`: `pnpm run build` (typecheck + all packages), 52 tests, `lint:tokens`.

## Architecture

Monorepo (pnpm workspaces):
- `artifacts/ember` — Vite + React 19 SPA (wouter router, Zustand store, Clerk).
- `artifacts/api-server` — Express, bundled to one file via esbuild (`build.mjs`).
- `lib/db` — Drizzle + `node-postgres` → Neon. Schema in `src/schema/index.ts`.
- `lib/api-spec` — OpenAPI (`openapi.yaml`) → **orval** codegen (title must stay `Api`).
- `lib/api-zod` — generated zod validators.
- `lib/api-client-react` — generated react-query hooks **and raw fns**, plus `custom-fetch.ts`
  (`setBaseUrl`, `setAuthTokenGetter`). The frontend uses the **raw fns** from the Zustand store.

**Key design choice:** the engine (streak/scar/milestone logic) runs **client-side**; the API is
persistence. `useJourneyStore.checkIn` computes the scar + newly-unlocked milestones with the
engine, then sends them to be persisted. (Trade: not tamper-proof — fine for now; the engine is
isolated and could move server-side later.)

## Running locally (Windows specifics — important)

- **pnpm** is not on PATH; use `corepack pnpm …`. A shim exists at
  `C:/Users/drobo/.local/bin/pnpm` for nested-script `pnpm` calls. Run pnpm from **Git Bash**
  (the root `preinstall` guard uses `sh -c`, which fails under cmd/PowerShell).
- **Ports**: ember `:5173`, api-server `:5001`. **5000 is used by a separate project
  (MomentumTXT)** — do not use it. Launch configs live in the git-ignored
  `.claude/launch.json` (api-server pinned with `"autoPort": false`).
- **Env**: a single **root `.env`** (git-ignored) holds everything. The api-server loads it via
  `dotenv` (`src/env.ts`, imported before `./app`); Vite loads it via `envDir` = repo root and
  exposes only `VITE_*`. `.env.example` is the committed template.
  - `VITE_API_BASE_URL` must be the **ORIGIN only** (`http://localhost:5001`) — the generated
    client already prefixes `/api` (setting `.../api` causes `/api/api/...` → 404).
- **Start both**: `preview_start` the `ember` and `api-server` launch entries, or
  `corepack pnpm --filter @workspace/ember run dev` and `… @workspace/api-server run dev`.
- **DB migrations**: `export DATABASE_URL=… && corepack pnpm --filter @workspace/db run push`.
- **Codegen** after editing `openapi.yaml`: `corepack pnpm --filter @workspace/api-spec run codegen`.

## Gotchas we hit (don't rediscover these)

- Doubled `/api` (base URL vs client prefix) — see above.
- `drizzle.config.ts` schema path must be **forward-slash** relative; `path.join(__dirname,…)`
  yields backslashes that break drizzle-kit's glob on Windows.
- The frontend **silently swallows API errors** (`loadJourneys` catch → empty; `createJourney`
  only logs) — surfacing them in the UI is a TODO (looked like a dead button during debugging).
- To test protected endpoints **without a browser**: mint a Clerk session token via the Backend
  API — `POST /v1/sessions {user_id}` → `POST /v1/sessions/{id}/tokens` → use the `jwt` as Bearer.
- api-server dev script is cross-platform: `node ./build.mjs && node --enable-source-maps ./dist/index.mjs`.

## Secrets / data

- All secrets live only in the git-ignored root `.env` (`DATABASE_URL`, `CLERK_*`). The repo
  scanned clean; `.gitignore` covers `.env`/`.env.*` (a stray `env`/`env.txt` is NOT ignored — avoid).
- Neon role password was **rotated** on 2026-07-02 (new value in local `.env` only).
- First Clerk user: `drobo28@gmail.com` (Clerk instance `renewing-kitten-55`). A journey named
  "Journaling" exists in the DB.

## Next up — Phase 3, then Phase 4 (full detail in `docs/BACKEND-SCOPE.md`)

**Phase 3 — Stripe billing**: product + recurring price (push annual), Checkout session,
`POST /webhooks/stripe` (raw body + signature verify + idempotency), entitlement gate + paywall
UI, Customer Portal. New secrets: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_PRICE_ID`.

**Phase 4 — AI reflection digest**: opt-in weekly digest from the user's own check-in notes,
Anthropic Claude Haiku, batched (cheap), `reflections` table. Secret: `ANTHROPIC_API_KEY`.

## Open loose ends

- Surface API errors in the UI (toast/error state).
- Optional: move the engine server-side for tamper-resistance.
- GitHub auth: pushes work as account `Robo-Meritage` (collaborator with write). See
  memory `ember-github-access`.
