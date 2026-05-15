import { COMPANION_STATES, ANIMATION_CLASS, type CompanionState } from "@/lib/config/companion-states";
import { companionPalette } from "@/lib/config/tokens";

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
        borderRadius: "16px",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "12px",
        textAlign: "center",
      }}
    >
      <div
        className={animClass}
        style={{
          width: "72px",
          height: "72px",
          borderRadius: "50%",
          background: `${palette.color}18`,
          border: `2px solid ${palette.color}44`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "28px",
          color: palette.color,
        }}
      >
        {config.glyph}
      </div>

      <div>
        <div style={{ fontSize: "11px", letterSpacing: "0.12em", textTransform: "uppercase", color: palette.color, opacity: 0.6, marginBottom: "4px" }}>
          COMPANION
        </div>
        <div style={{ fontSize: "16px", fontWeight: 600, color: palette.color, marginBottom: "8px" }}>
          {config.label}
        </div>
        <p style={{ fontSize: "13px", color: palette.color, opacity: 0.8, lineHeight: 1.5, margin: 0, fontStyle: "italic" }}>
          &ldquo;{config.message}&rdquo;
        </p>
      </div>
    </div>
  );
}
