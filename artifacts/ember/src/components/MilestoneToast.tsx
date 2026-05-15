import { useEffect } from "react";
import { MILESTONES } from "@/lib/config/milestone-rules";
import { useJourneyStore } from "@/lib/state/useJourneyStore";

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
        top: "24px",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 1000,
        background: "rgba(30,20,10,0.95)",
        border: "1px solid #E8613A55",
        borderRadius: "16px",
        padding: "16px 20px",
        display: "flex",
        alignItems: "center",
        gap: "12px",
        maxWidth: "380px",
        boxShadow: "0 8px 30px rgba(0,0,0,0.8), 0 0 20px rgba(232,97,58,0.3)",
        backdropFilter: "blur(8px)",
        animation: "float 0.3s ease-out",
      }}
    >
      <span style={{ fontSize: "24px", color: "#E8613A" }}>{milestone.glyph}</span>
      <div>
        <div style={{ fontSize: "12px", letterSpacing: "0.1em", textTransform: "uppercase", color: "#E8613A", opacity: 0.8, marginBottom: "2px" }}>
          Milestone Unlocked
        </div>
        <div style={{ fontSize: "15px", fontWeight: 600, color: "#F0E8E0", marginBottom: "4px" }}>
          {milestone.label}
        </div>
        <div style={{ fontSize: "12px", color: "rgba(240,232,224,0.6)", lineHeight: 1.4, fontStyle: "italic" }}>
          {milestone.unlockMessage}
        </div>
      </div>
    </div>
  );
}
