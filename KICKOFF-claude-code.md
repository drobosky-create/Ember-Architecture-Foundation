# Claude Code kickoff prompt

Open this repo in Claude Code and paste the message below as your first prompt. It scopes the
theme refactor and hygiene cleanup from `AUDIT-2026-06-29.md`. Tackle P1 first; P2/P3 can be
separate sessions or follow-on commits.

---

## Paste this into Claude Code

> Read `CLAUDE.md` and `AUDIT-2026-06-29.md` first — they have full project context and the findings I want fixed.
>
> Goal: make `tokens.ts` the single source of truth for all styling in `artifacts/ember`, then clean up the hygiene issues. Work in small, reviewable commits and run `pnpm run typecheck` after each step. Don't change app behavior or visual output — this is a refactor; colors/spacing should render identically before and after.
>
> **P1 — Single-source the theme**
> 1. Audit `tokens.ts` for completeness: add any colors that currently appear only inline in components (e.g. `#FFF8F4`, `#D4B090`, `#C84A4A`, `#A0A0A0`, `#0A0804`, and alpha variants like `#E8613A55`) as named tokens so the palette is complete.
> 2. Remove the duplicate color definitions in `src/index.css`: delete the unused `:root { --ember … }` block (it's referenced 0 times), and make the `@theme`/`body` background+foreground values reference tokens rather than re-hardcoding `#080808`/`#F0E8E0`.
> 3. Replace hardcoded inline values in components/pages with token references (`colors.*`, `typography.fontSize.*`, `typography.fontWeight.*`, `spacing.*`, `borderRadius.*`, `shadows.*`). Start with the worst offenders — `pages/Dashboard.tsx` and `pages/CreateJourney.tsx` — then `components/CheckInPanel.tsx`, `MilestoneList.tsx`, `StreakDisplay.tsx`, `MilestoneToast.tsx`, `ScarList.tsx`, `pages/not-found.tsx`.
> 4. After migration, confirm the `colors`, `typography`, `spacing`, `shadows`, `borderRadius` exports are all actually imported and used somewhere.
>
> **P2 — Dependency cleanup**
> 5. `artifacts/ember/package.json` declares ~50 deps but the app only imports react, react-dom, wouter, zustand. Remove the unused ones (the entire `@radix-ui/*` set, recharts, embla-carousel-react, cmdk, vaul, sonner, react-hook-form, @hookform/resolvers, react-day-picker, next-themes, framer-motion, lucide-react, date-fns, @tanstack/react-query, tw-animate-css, etc.). Verify by checking actual imports in `src/` before removing each. Re-run install + typecheck + build to confirm nothing breaks.
>
> **P3 — Housekeeping**
> 6. Fix or remove the dangling `@assets` alias in `artifacts/ember/vite.config.ts` (target `attached_assets/` doesn't exist and nothing imports it).
> 7. Tell me whether to keep or delete `artifacts/mockup-sandbox` — it's an unused shadcn sandbox and the likely source of the dep bloat. Don't delete it without my confirmation.
>
> **Guardrails**
> - Verify each color/spacing token value matches the literal it replaces (no visual drift).
> - Run `pnpm run typecheck` after each file; run `pnpm run build` at the end.
> - Commit per phase with clear messages. Show me a diff summary before P2 deletions.
> - Optional last step: add a lint check that fails on raw hex (`#[0-9A-Fa-f]{3,8}`) or raw px in `.tsx` style objects, to prevent regressions.

---

## First-session setup notes

- `pnpm install` before anything (node_modules isn't committed; the 1-day `minimumReleaseAge` gate may slow the first install).
- The dev server needs `PORT` and `BASE_PATH` env vars set or `vite.config.ts` throws.
- pnpm only — npm/yarn are blocked by the `preinstall` hook.
