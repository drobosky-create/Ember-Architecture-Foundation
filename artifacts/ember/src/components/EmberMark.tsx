import type { CSSProperties } from "react";
import type { EnvironmentState } from "@/lib/config/environment-states";
import { colors, alpha } from "@/lib/config/tokens";

/**
 * State-driven animated ember mark (placeholder art).
 *
 * Colors are supplied as CSS custom properties (`--ember-*`) sourced from
 * `tokens.ts`, and the SVG paths reference them via `fill="var(--ember-flame)"`.
 * That's the exact contract in docs/BRAND-ASSET-BRIEF.md, so the polished Manus
 * mark drops in by swapping the <path> markup below — no color changes needed.
 *
 * Motion lives in index.css (`.ember-flicker`, `.ember-glow`, reused `.anim-*`),
 * keeping raw px/keyframes out of the component (and past the token lints).
 */

interface Vitality {
  flame: string;
  bright: string;
  core: string;
  glow: string;
  opacity: number;
  /** space-separated animation class names applied to the flame group */
  anim: string;
}

function vitalityFor(state: EnvironmentState): Vitality {
  switch (state) {
    case "thriving":
      return { flame: colors.brand.emberDim, bright: colors.brand.emberGlow, core: colors.brand.onEmber, glow: alpha(colors.brand.ember, 0.7), opacity: 1, anim: "anim-pulse" };
    case "stable":
      return { flame: colors.brand.emberDim, bright: colors.brand.emberGlow, core: colors.brand.onEmber, glow: alpha(colors.brand.ember, 0.45), opacity: 0.96, anim: "anim-pulse" };
    case "struggling":
      return { flame: colors.brand.emberDim, bright: colors.brand.ember, core: colors.brand.onEmber, glow: alpha(colors.brand.ember, 0.28), opacity: 0.82, anim: "ember-flicker" };
    case "critical":
      return { flame: colors.brand.emberDim, bright: colors.accent.danger, core: colors.accent.dangerText, glow: alpha(colors.accent.danger, 0.28), opacity: 0.62, anim: "ember-flicker" };
    case "dormant":
      return { flame: colors.muted.dim, bright: colors.muted.mid, core: colors.muted.dim, glow: "transparent", opacity: 0.45, anim: "" };
  }
}

// Up to three accumulating "healed seam" cracks (shown per scarCount).
const SCAR_PATHS = [
  "M40,34 L34,50 L44,60 L36,74",
  "M46,44 L52,58 L45,68 L50,82",
  "M33,56 L28,70 L36,80",
];

interface Props {
  state: EnvironmentState;
  /** permanent scars carried on the mark (0–3 rendered) */
  scarCount?: number;
  /** rendered width in px; height scales to the 80×118 viewBox */
  size?: number;
}

export function EmberMark({ state, scarCount = 0, size = 64 }: Props) {
  const v = vitalityFor(state);
  const cracks = SCAR_PATHS.slice(0, Math.max(0, Math.min(scarCount, SCAR_PATHS.length)));

  const style = {
    "--ember-flame": v.flame,
    "--ember-flame-bright": v.bright,
    "--ember-core": v.core,
    "--ember-glow": v.glow,
    "--ember-scar": colors.brand.coal,
    overflow: "visible",
  } as CSSProperties;

  return (
    <svg
      width={size}
      height={(size * 118) / 80}
      viewBox="0 0 80 118"
      role="img"
      aria-label={`Ember, ${state}`}
      style={style}
    >
      <g className={`ember-mark-flame ember-glow ${v.anim}`} style={{ opacity: v.opacity }}>
        {/* outer flame */}
        <path
          d="M40,8 C58,34 66,50 60,74 C56,92 52,102 40,104 C28,102 24,92 20,74 C14,50 22,34 40,8 Z"
          fill="var(--ember-flame)"
        />
        {/* inner flame */}
        <path
          d="M40,30 C50,46 54,58 49,74 C46,86 44,93 40,95 C36,93 34,86 31,74 C26,58 30,46 40,30 Z"
          fill="var(--ember-flame-bright)"
        />
        {/* hot core (absent when extinguished) */}
        {state !== "dormant" && (
          <ellipse cx="40" cy="82" rx="6.5" ry="10" fill="var(--ember-core)" />
        )}
        {/* permanent scars */}
        {cracks.map((d, i) => (
          <path
            key={i}
            d={d}
            fill="none"
            stroke="var(--ember-scar)"
            strokeWidth="2.4"
            strokeLinecap="round"
            opacity="0.55"
          />
        ))}
      </g>
    </svg>
  );
}
