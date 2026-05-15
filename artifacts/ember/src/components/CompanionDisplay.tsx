import { COMPANION_STATES, type CompanionState } from "@/lib/config/companion-states";
import { colors } from "@/lib/config/tokens";

interface Props {
  state: CompanionState;
}

const COMPANION_COLORS: Record<CompanionState, string> = {
  present:  "#A8D5AA",
  hopeful:  "#FFD580",
  worried:  "#FF9B6A",
  grieving: "#9B9BB8",
  dormant:  "#555555",
};

const COMPANION_BG: Record<CompanionState, string> = {
  present:  "rgba(168,213,170,0.08)",
  hopeful:  "rgba(255,213,128,0.08)",
  worried:  "rgba(255,155,106,0.08)",
  grieving: "rgba(155,155,184,0.08)",
  dormant:  "rgba(85,85,85,0.08)",
};

export function CompanionDisplay({ state }: Props) {
  const config = COMPANION_STATES[state];
  const color = COMPANION_COLORS[state];
  const bg = COMPANION_BG[state];
  const animClass = `anim-${config.animationHint}`;

  return (
    <div
      style={{
        background: bg,
        border: `1px solid ${color}22`,
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
          background: `${color}18`,
          border: `2px solid ${color}44`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "28px",
          color,
        }}
      >
        {config.glyph}
      </div>

      <div>
        <div style={{ fontSize: "11px", letterSpacing: "0.12em", textTransform: "uppercase", color, opacity: 0.6, marginBottom: "4px" }}>
          COMPANION
        </div>
        <div style={{ fontSize: "16px", fontWeight: 600, color, marginBottom: "8px" }}>
          {config.label}
        </div>
        <p style={{ fontSize: "13px", color, opacity: 0.8, lineHeight: 1.5, margin: 0, fontStyle: "italic" }}>
          &ldquo;{config.message}&rdquo;
        </p>
      </div>
    </div>
  );
}
