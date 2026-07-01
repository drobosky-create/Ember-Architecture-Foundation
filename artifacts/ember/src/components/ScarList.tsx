import type { Scar } from "@/lib/state/types";
import { formatDate } from "@/lib/utils/date";
import { colors, typography, spacing, alpha } from "@/lib/config/tokens";

interface Props {
  scars: Scar[];
}

export function ScarList({ scars }: Props) {
  if (scars.length === 0) {
    return (
      <div style={{ padding: spacing[4], textAlign: "center", color: alpha(colors.neutral[0], 0.3), fontSize: "13px" }}>
        No scars yet. Keep the streak alive.
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: spacing[2] }}>
      <div style={{ fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase", color: alpha(colors.neutral[0], 0.35), marginBottom: spacing[1] }}>
        Scars — {scars.length}
      </div>
      {scars.map((scar) => (
        <div
          key={scar.id}
          style={{
            display: "flex",
            alignItems: "center",
            gap: spacing[3],
            padding: "12px 14px",
            borderRadius: "10px",
            background: alpha(colors.accent.danger, 0.06),
            border: `1px solid ${alpha(colors.accent.danger, 0.2)}`,
          }}
        >
          <span style={{ fontSize: "16px", color: colors.accent.danger, minWidth: "20px" }}>✕</span>
          <div>
            <div style={{ fontSize: "13px", color: colors.accent.dangerText, fontWeight: typography.fontWeight.medium, marginBottom: "2px" }}>
              {scar.description}
            </div>
            <div style={{ fontSize: "11px", color: alpha(colors.accent.dangerText, 0.5) }}>
              {formatDate(scar.brokenAt)} · streak was {scar.streakAtBreak} day{scar.streakAtBreak !== 1 ? "s" : ""}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
