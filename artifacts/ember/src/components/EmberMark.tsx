import type { CSSProperties } from "react";
import type { EnvironmentState } from "@/lib/config/environment-states";
import { colors } from "@/lib/config/tokens";

import thriving from "@/assets/brand/mark/ember-thriving.svg?raw";
import stable from "@/assets/brand/mark/ember-stable.svg?raw";
import struggling from "@/assets/brand/mark/ember-struggling.svg?raw";
import critical from "@/assets/brand/mark/ember-critical.svg?raw";
import dormant from "@/assets/brand/mark/ember-dormant.svg?raw";
import scarOverlay from "@/assets/brand/mark/ember-scar.svg?raw";

/**
 * The living ember mark (Manus brand art). The SVGs reference `--ember-*` CSS
 * variables; we set those from `tokens.ts` here, so `tokens.ts` remains the
 * single color source and the SVGs (imported as raw strings so the variables
 * cascade in) carry only the shapes. Motion lives in index.css.
 */

const MARK: Record<EnvironmentState, string> = {
  thriving,
  stable,
  struggling,
  critical,
  dormant,
};

const ANIM: Record<EnvironmentState, string> = {
  thriving: "ember-pulse-strong",
  stable: "ember-pulse-slow",
  struggling: "ember-flicker",
  critical: "ember-flicker-fast",
  dormant: "",
};

// Maps the SVGs' --ember-* variables to the token source of truth.
const EMBER_VARS = {
  "--ember-flame": colors.brand.ember,
  "--ember-flame-bright": colors.brand.emberGlow,
  "--ember-core": colors.brand.emberCore,
  "--ember-glow": colors.brand.emberGlow,
  "--ember-critical": colors.accent.danger,
  "--ember-dormant": colors.muted.mid,
  "--ember-ash-light": colors.muted.ashLight,
  "--ember-scar": colors.accent.scarSeam,
} as CSSProperties;

interface Props {
  state: EnvironmentState;
  /** permanent scars carried on the mark (0–3 rendered) */
  scarCount?: number;
  /** rendered square size in px */
  size?: number;
}

export function EmberMark({ state, scarCount = 0, size = 64 }: Props) {
  const scars = Math.max(0, Math.min(scarCount, 3));
  const style = { ...EMBER_VARS, width: size, height: size } as CSSProperties;

  return (
    <div
      className="ember-mark"
      data-scars={scars}
      style={style}
      role="img"
      aria-label={`Ember, ${state}`}
    >
      <div
        className={`ember-mark-body ${ANIM[state]}`}
        dangerouslySetInnerHTML={{ __html: MARK[state] }}
      />
      {scars > 0 && (
        <div
          className="ember-mark-scars"
          dangerouslySetInnerHTML={{ __html: scarOverlay }}
        />
      )}
    </div>
  );
}
