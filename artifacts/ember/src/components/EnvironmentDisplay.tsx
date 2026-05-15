import { ENVIRONMENT_STATES, type EnvironmentState } from "@/lib/config/environment-states";
import { colors, animation } from "@/lib/config/tokens";

interface Props {
  state: EnvironmentState;
  isTransitioning?: boolean;
}

const ENV_PALETTE: Record<EnvironmentState, { bg: string; border: string; text: string; glow: string }> = {
  thriving: { bg: "#0D1F0D", border: "#2E5A2E", text: "#A8D5AA", glow: "0 0 30px rgba(76,175,80,0.25)" },
  stable:   { bg: "#0D1220", border: "#1E3A5A", text: "#A0B8D4", glow: "0 0 30px rgba(91,127,166,0.25)" },
  struggling: { bg: "#1E1004", border: "#4A3010", text: "#D4B48A", glow: "0 0 30px rgba(200,135,74,0.25)" },
  critical: { bg: "#1A0404", border: "#4A1010", text: "#D48A8A", glow: "0 0 30px rgba(200,74,74,0.25)" },
  dormant:  { bg: "#0A0A0A", border: "#222222", text: "#666666", glow: "none" },
};

export function EnvironmentDisplay({ state, isTransitioning }: Props) {
  const config = ENVIRONMENT_STATES[state];
  const palette = ENV_PALETTE[state];

  return (
    <div
      style={{
        background: palette.bg,
        border: `1px solid ${palette.border}`,
        borderRadius: "16px",
        padding: "20px",
        boxShadow: palette.glow,
        transition: animation.transition.environmentShift,
        opacity: isTransitioning ? 0.5 : 1,
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
