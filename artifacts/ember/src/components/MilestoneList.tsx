import { MILESTONES } from "@/lib/config/milestone-rules";
import type { UnlockedMilestone } from "@/lib/state/types";
import { formatDate } from "@/lib/utils/date";

interface Props {
  unlocked: UnlockedMilestone[];
}

const MILESTONE_TYPE_COLORS: Record<string, string> = {
  streak:   "#E8613A",
  recovery: "#FFD580",
  symbolic: "#9B9BB8",
  temporal: "#A0D4FF",
};

export function MilestoneList({ unlocked }: Props) {
  const unlockedIds = new Set(unlocked.map((m) => m.id));
  const all = Object.values(MILESTONES);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      <div style={{ fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", marginBottom: "4px" }}>
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
              gap: "12px",
              padding: "12px 14px",
              borderRadius: "10px",
              background: isUnlocked ? `${typeColor}10` : "rgba(255,255,255,0.02)",
              border: `1px solid ${isUnlocked ? typeColor + "30" : "rgba(255,255,255,0.05)"}`,
              opacity: isUnlocked ? 1 : 0.45,
            }}
          >
            <span style={{ fontSize: "18px", minWidth: "24px", textAlign: "center", color: isUnlocked ? typeColor : "#555" }}>
              {m.glyph}
            </span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: "13px", fontWeight: isUnlocked ? 600 : 400, color: isUnlocked ? "#E8E8E8" : "#666", marginBottom: "2px" }}>
                {m.label}
              </div>
              <div style={{ fontSize: "11px", color: isUnlocked ? "rgba(255,255,255,0.45)" : "#444", lineHeight: 1.4 }}>
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
