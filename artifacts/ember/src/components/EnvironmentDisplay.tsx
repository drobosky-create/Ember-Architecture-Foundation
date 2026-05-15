import { ENVIRONMENT_STATES, type EnvironmentState } from "@/lib/config/environment-states";
import { environmentPalette, animation } from "@/lib/config/tokens";

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
        borderRadius: "16px",
        padding: "20px",
        boxShadow: palette.glow,
        transition: animation.transition.environmentShift,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
        <span style={{ fontSize: "28px", lineHeight: 1 }}>{config.symbolGlyph}</span>
        <div>
          <div style={{ fontSize: "11px", letterSpacing: "0.12em", textTransform: "uppercase", color: palette.text, opacity: 0.6, marginBottom: "2px" }}>
            ENVIRONMENT
          </div>
          <div style={{ fontSize: "18px", fontWeight: 600, color: palette.text }}>
            {config.label}
          </div>
        </div>
      </div>
      <p style={{ fontSize: "13px", color: palette.text, opacity: 0.75, lineHeight: 1.5, margin: 0 }}>
        {config.description}
      </p>
      <div style={{ marginTop: "10px", fontSize: "11px", color: palette.text, opacity: 0.45, fontStyle: "italic" }}>
        {config.ambience}
      </div>
    </div>
  );
}
