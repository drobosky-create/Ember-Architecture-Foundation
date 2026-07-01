import { ENVIRONMENT_STATES, type EnvironmentState } from "@/lib/config/environment-states";
import { environmentPalette, animation, typography, spacing, borderRadius } from "@/lib/config/tokens";
import { EmberMark } from "@/components/EmberMark";

interface Props {
  state: EnvironmentState;
}

export function EnvironmentDisplay({ state }: Props) {
  const config = ENVIRONMENT_STATES[state];
  const palette = environmentPalette[state];

  return (
    <div
      style={{
        background: palette.cardBg,
        border: `1px solid ${palette.border}`,
        borderRadius: borderRadius.xl,
        padding: spacing[5],
        boxShadow: palette.glow,
        transition: animation.transition.environmentShift,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: spacing[3], marginBottom: spacing[3] }}>
        <EmberMark state={state} size={36} />
        <div>
          <div style={{ fontSize: typography.fontSize["2xs"], letterSpacing: "0.12em", textTransform: "uppercase", color: palette.text, opacity: 0.6, marginBottom: spacing[0.5] }}>
            ENVIRONMENT
          </div>
          <div style={{ fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.semibold, color: palette.text }}>
            {config.label}
          </div>
        </div>
      </div>
      <p style={{ fontSize: typography.fontSize.caption, color: palette.text, opacity: 0.75, lineHeight: typography.lineHeight.normal, margin: 0 }}>
        {config.description}
      </p>
      <div style={{ marginTop: spacing[2.5], fontSize: typography.fontSize["2xs"], color: palette.text, opacity: 0.45, fontStyle: "italic" }}>
        {config.ambience}
      </div>
    </div>
  );
}
