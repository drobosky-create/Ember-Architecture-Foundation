import { MILESTONES } from "@/lib/config/milestone-rules";
import type { UnlockedMilestone } from "@/lib/state/types";
import { formatDate } from "@/lib/utils/date";
import { colors, typography, spacing, alpha } from "@/lib/config/tokens";

interface Props {
  unlocked: UnlockedMilestone[];
}

const MILESTONE_TYPE_COLORS: Record<string, string> = {
  streak:   colors.brand.ember,
  recovery: colors.accent.recovery,
  symbolic: colors.accent.symbolic,
  temporal: colors.accent.temporal,
};

export function MilestoneList({ unlocked }: Props) {
  const unlockedIds = new Set(unlocked.map((m) => m.id));
  const all = Object.values(MILESTONES);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: spacing[2] }}>
      <div style={{ fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase", color: alpha(colors.neutral[0], 0.35), marginBottom: spacing[1] }}>
        Milestones
      </div>
      {all.map((m) => {
        const isUnlocked = unlockedIds.has(m.id);
        const unlockedEntry = unlocked.find((u) => u.id === m.id);
        const typeColor = MILESTONE_TYPE_COLORS[m.type];
        return (
          <div
            key={m.id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: spacing[3],
              padding: "12px 14px",
              borderRadius: "10px",
              background: isUnlocked ? `${typeColor}10` : alpha(colors.neutral[0], 0.02),
              border: `1px solid ${isUnlocked ? typeColor + "30" : alpha(colors.neutral[0], 0.05)}`,
              opacity: isUnlocked ? 1 : 0.45,
            }}
          >
            <span style={{ fontSize: typography.fontSize.lg, minWidth: "24px", textAlign: "center", color: isUnlocked ? typeColor : colors.muted.dim }}>
              {m.glyph}
            </span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: "13px", fontWeight: isUnlocked ? typography.fontWeight.semibold : typography.fontWeight.regular, color: isUnlocked ? colors.neutral[100] : colors.muted.mid, marginBottom: "2px" }}>
                {m.label}
              </div>
              <div style={{ fontSize: "11px", color: isUnlocked ? alpha(colors.neutral[0], 0.45) : colors.muted.faint, lineHeight: 1.4 }}>
                {isUnlocked && unlockedEntry
                  ? `Unlocked ${formatDate(unlockedEntry.unlockedAt.split("T")[0])}`
                  : m.description}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
