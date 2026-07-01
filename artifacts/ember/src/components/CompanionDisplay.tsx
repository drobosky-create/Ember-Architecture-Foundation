import { COMPANION_STATES, ANIMATION_CLASS, type CompanionState } from "@/lib/config/companion-states";
import { companionPalette, typography, spacing, borderRadius } from "@/lib/config/tokens";

interface Props {
  state: CompanionState;
}

export function CompanionDisplay({ state }: Props) {
  const config = COMPANION_STATES[state];
  const palette = companionPalette[state];
  const animClass = ANIMATION_CLASS[config.animationHint];

  return (
    <div
      style={{
        background: palette.bg,
        border: `1px solid ${palette.color}22`,
        borderRadius: borderRadius.xl,
        padding: spacing[5],
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: spacing[3],
        textAlign: "center",
      }}
    >
      <div
        className={animClass}
        style={{
          width: spacing.avatar,
          height: spacing.avatar,
          borderRadius: borderRadius.circle,
          background: `${palette.color}18`,
          border: `2px solid ${palette.color}44`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: typography.fontSize.display,
          color: palette.color,
        }}
      >
        {config.glyph}
      </div>

      <div>
        <div style={{ fontSize: typography.fontSize["2xs"], letterSpacing: "0.12em", textTransform: "uppercase", color: palette.color, opacity: 0.6, marginBottom: spacing[1] }}>
          COMPANION
        </div>
        <div style={{ fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.semibold, color: palette.color, marginBottom: spacing[2] }}>
          {config.label}
        </div>
        <p style={{ fontSize: typography.fontSize.caption, color: palette.color, opacity: 0.8, lineHeight: typography.lineHeight.normal, margin: 0, fontStyle: "italic" }}>
          &ldquo;{config.message}&rdquo;
        </p>
      </div>
    </div>
  );
}
