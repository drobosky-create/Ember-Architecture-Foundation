# Ember Backend — Scope & Plan

_Status: planning · Created 2026-07-01_

Ember today is a standalone React SPA: all state lives in `localStorage` via a
Zustand store, all logic (streak/scar/milestone) runs client-side in the
engine, and there is **no concept of a user**. This document scopes turning it
into a low-cost **monthly subscription** app with real accounts and persistence,
plus a narrow, opt-in AI feature.

## Product decisions

- **Subscription:** low-cost monthly, annual option pushed to blunt Stripe's
  per-transaction fee at a low price point.
- **AI: yes, but narrow.** An **opt-in weekly reflection digest** generated from
  the user's _own_ check-in notes — batched, ~a fraction of a cent per user per
  month on Claude Haiku. **No open-ended companion chat** (variable cost can
  exceed the subscription price, and open-ended emotional responses are a real
  safety liability). The existing curated companion lines stay as-is.
- **Accounts are required** — you can't bill an anonymous `localStorage` user.
  This is the biggest shift from today's architecture.

## Stack decisions (all swappable)

| Concern | Choice | Rationale |
|---|---|---|
| Auth | **Clerk** | Managed; best React DX; backend JWT verification; free ≤10k MAU. Clerk owns identity; our DB keys app data by Clerk `user_id`. |
| Database | **Neon Postgres** + existing Drizzle/`node-postgres` scaffold | Serverless Postgres, free tier, plain `DATABASE_URL` — no change to `lib/db`. |
| Billing | **Stripe** Checkout + Billing + Customer Portal | Standard; webhook-synced subscription status. |
| AI | **Anthropic Claude (Haiku)** | Cheap, batched weekly digest; server-side only. |
| Streak/scar/milestone logic | **Stays client-side (engine) for v1** | Reuses the already-tested pure engine. Server is persistence. Trade: not tamper-proof (acceptable for a personal accountability app; can move server-side later — the engine is already isolated). |
| Client data layer | **orval-generated react-query client** (already scaffolded) | Replace Zustand-`persist`; keep a thin Zustand for pure UI state. |

**Economics:** Neon free→~$19/mo, Clerk free tier, small host ~$5–7/mo, Stripe
2.9%+30¢, Claude Haiku digest ≈ fractions of a cent/user/month. COGS is flat and
predictable — the low-price model works, which is exactly why the batched digest
is viable where chat would not be.

## Contract-first workflow

Every endpoint is defined in `lib/api-spec/openapi.yaml`, then
`pnpm --filter @workspace/api-spec run codegen` regenerates:
- `lib/api-client-react` — react-query hooks + fetch fns (with `setAuthTokenGetter` for Clerk JWTs)
- `lib/api-zod` — zod validators the api-server uses to validate responses

This scaffold already exists and is exercised by the `/healthz` route today.

## Data model (Drizzle — `lib/db/src/schema`)

```
users
  id                        text  PK   -- Clerk user id
  stripe_customer_id        text  null
  subscription_status       text  null -- trialing | active | past_due | canceled | null
  subscription_period_end   timestamptz null
  ai_reflection_opt_in      boolean default false
  created_at                timestamptz default now()

journeys
  id            uuid PK
  user_id       text FK -> users.id
  name          text
  intention     text
  created_at    timestamptz
  start_date    date

check_ins
  id            uuid PK
  journey_id    uuid FK -> journeys.id
  date          date
  note          text
  completed_at  timestamptz

scars
  id             uuid PK
  journey_id     uuid FK -> journeys.id
  broken_at      date
  streak_at_break int
  description    text

unlocked_milestones
  id            uuid PK
  journey_id    uuid FK -> journeys.id
  milestone_id  text            -- MilestoneId union value
  unlocked_at   timestamptz

reflections                    -- Phase 4 (AI digest)
  id            uuid PK
  user_id       text FK -> users.id
  journey_id    uuid null
  week_of       date
  content       text
  created_at    timestamptz
```

## API surface (defined in openapi.yaml, verified with Clerk JWT)

- `GET  /me` — profile: subscription status + opt-in flags
- `GET  /journeys` — all journeys for the user (each as full `JourneyData`)
- `POST /journeys` — create
- `POST /journeys/{id}/check-ins` — check in; returns updated `JourneyData` + newly unlocked milestones
- `POST /journeys/{id}/reset`
- `POST /billing/checkout-session` — start subscription
- `POST /billing/portal-session` — manage subscription
- `PATCH /me` — toggle `ai_reflection_opt_in`
- `GET  /reflections` — list digests (Phase 4)
- `POST /webhooks/stripe` — **server-only**, raw body + signature verify (not in the generated client)

## Phases

| Phase | Deliverable |
|---|---|
| **0 — Foundations & safety** | `.gitignore` + `.env.example` hardening; drop stale `stripe-replit-sync` allowlist entry; this scope doc. (Provisioning Neon/Clerk/Stripe accounts is a manual prerequisite — see checklist.) |
| **1 — Accounts** | Clerk sign-in/up UI; api-server JWT-verify middleware; `users` table; `GET /me`. |
| **2 — Persistence** | Drizzle schema + migrations; OpenAPI paths → codegen; api-server CRUD; migrate ember store to the API; one-time localStorage→API import on first login. Engine stays client-side. |
| **3 — Billing** | Stripe product/price; Checkout; `/webhooks/stripe` (raw-body signature verify + idempotency); entitlement gate + paywall UI; Customer Portal; free trial. |
| **4 — AI reflection slice** | Anthropic integration; opt-in toggle; weekly digest (on-demand or scheduled); `reflections` table; UI surface (gated behind subscription). |
| **5 — Deploy** | Host api-server + ember + Neon; secrets in host secret store; Stripe live keys + webhook endpoint. |

## Secrets

Never committed. Held in the host's secret store in production, and in a local
(git-ignored) `.env` for development. See `.env.example` for the full list.

**Server-only (secret):** `DATABASE_URL`, `CLERK_SECRET_KEY`,
`STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_PRICE_ID`,
`ANTHROPIC_API_KEY`.

**Frontend (public, safe to expose):** `VITE_CLERK_PUBLISHABLE_KEY`,
`VITE_API_BASE_URL`.

## Account-setup checklist (manual prerequisites, owner action)

These require creating external accounts and pasting keys into `.env` /the host —
they can't be automated from the repo:

1. **Neon** — create a Postgres project → copy `DATABASE_URL`.
2. **Clerk** — create an application → copy `CLERK_SECRET_KEY` (server) and
   `VITE_CLERK_PUBLISHABLE_KEY` (frontend).
3. **Stripe** — create a product + recurring price → copy `STRIPE_SECRET_KEY`,
   `STRIPE_PRICE_ID`; after deploying the webhook endpoint, copy
   `STRIPE_WEBHOOK_SECRET`.
4. **Anthropic** — create an API key → `ANTHROPIC_API_KEY` (Phase 4).
