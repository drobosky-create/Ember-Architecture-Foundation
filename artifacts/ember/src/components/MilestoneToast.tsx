import { useEffect } from "react";
import { MILESTONES } from "@/lib/config/milestone-rules";
import { useJourneyStore } from "@/lib/state/useJourneyStore";
import { colors, typography, spacing, borderRadius, shadows, alpha } from "@/lib/config/tokens";

export function MilestoneToast() {
  const { pendingMilestones, clearPendingMilestones } = useJourneyStore();

  useEffect(() => {
    if (pendingMilestones.length === 0) return;
    const timer = setTimeout(() => clearPendingMilestones(), 4000);
    return () => clearTimeout(timer);
  }, [pendingMilestones, clearPendingMilestones]);

  if (pendingMilestones.length === 0) return null;

  const milestone = MILESTONES[pendingMilestones[0].id];

  return (
    <div
      style={{
        position: "fixed",
        top: spacing[6],
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 1000,
        background: alpha(colors.surface.toast, 0.95),
        border: `1px solid ${colors.brand.ember}55`,
        borderRadius: borderRadius.xl,
        padding: `${spacing[4]} ${spacing[5]}`,
        display: "flex",
        alignItems: "center",
        gap: spacing[3],
        maxWidth: spacing.toastMax,
        boxShadow: shadows.toast,
        backdropFilter: "blur(8px)",
        animation: "float 0.3s ease-out",
      }}
    >
      <span style={{ fontSize: typography.fontSize["2xl"], color: colors.brand.ember }}>{milestone.glyph}</span>
      <div>
        <div style={{ fontSize: typography.fontSize.xs, letterSpacing: "0.1em", textTransform: "uppercase", color: colors.brand.ember, opacity: 0.8, marginBottom: spacing[0.5] }}>
          Milestone Unlocked
        </div>
        <div style={{ fontSize: typography.fontSize.input, fontWeight: typography.fontWeight.semibold, color: colors.foreground, marginBottom: spacing[1] }}>
          {milestone.label}
        </div>
        <div style={{ fontSize: typography.fontSize.xs, color: alpha(colors.foreground, 0.6), lineHeight: 1.4, fontStyle: "italic" }}>
          {milestone.unlockMessage}
        </div>
      </div>
    </div>
  );
}
