import { useState } from "react";
import { useJourneyStore } from "@/lib/state/useJourneyStore";
import { colors, typography, spacing, borderRadius, shadows, alpha } from "@/lib/config/tokens";

interface Props {
  journeyId: string;
  onClose: () => void;
}

export function CheckInPanel({ journeyId, onClose }: Props) {
  const [note, setNote] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const checkIn = useJourneyStore((s) => s.checkIn);

  function handleSubmit() {
    checkIn(journeyId, note);
    setConfirmed(true);
    setTimeout(() => onClose(), 1400);
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: alpha(colors.neutral.black, 0.85),
        zIndex: 100,
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        backdropFilter: "blur(4px)",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          background: colors.surface.panel,
          border: `1px solid ${alpha(colors.brand.ember, 0.2)}`,
          borderRadius: `${borderRadius["2xl"]} ${borderRadius["2xl"]} 0 0`,
          padding: `${spacing[8]} ${spacing[6]}`,
          display: "flex",
          flexDirection: "column",
          gap: spacing[5],
        }}
      >
        {confirmed ? (
          <div style={{ textAlign: "center", padding: `${spacing[6]} 0` }}>
            <div style={{ fontSize: typography.fontSize["5xl"], marginBottom: spacing[3] }} className="anim-pulse">◈</div>
            <div style={{ fontSize: typography.fontSize.xl, fontWeight: typography.fontWeight.bold, color: colors.brand.ember, marginBottom: spacing[2] }}>
              Ember stoked
            </div>
            <div style={{ fontSize: typography.fontSize.sm, color: alpha(colors.neutral[0], 0.45) }}>
              You showed up today.
            </div>
          </div>
        ) : (
          <>
            <div>
              <div style={{ fontSize: typography.fontSize["2xs"], letterSpacing: "0.15em", textTransform: "uppercase", color: colors.brand.ember, marginBottom: spacing[1.5] }}>
                DAILY CHECK-IN
              </div>
              <h3 style={{ margin: 0, fontSize: typography.fontSize.xl, fontWeight: typography.fontWeight.bold, color: colors.foreground }}>
                You showed up.
              </h3>
              <p style={{ margin: `${spacing[1.5]} 0 0`, fontSize: typography.fontSize.caption, color: alpha(colors.neutral[0], 0.4), lineHeight: typography.lineHeight.normal }}>
                Mark today as done. Leave a note for your future self.
              </p>
            </div>

            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="One sentence, optional..."
              rows={3}
              maxLength={200}
              style={{
                width: "100%",
                padding: `${spacing[3.5]} ${spacing[4]}`,
                background: alpha(colors.neutral[0], 0.04),
                border: `1px solid ${alpha(colors.neutral[0], 0.1)}`,
                borderRadius: borderRadius.lg,
                color: colors.foreground,
                fontSize: typography.fontSize.input,
                outline: "none",
                fontFamily: "inherit",
                resize: "none",
                lineHeight: typography.lineHeight.normal,
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = `${colors.brand.ember}44`)}
              onBlur={(e) => (e.currentTarget.style.borderColor = alpha(colors.neutral[0], 0.1))}
            />

            <div style={{ display: "flex", gap: spacing[2.5] }}>
              <button
                onClick={onClose}
                style={{
                  flex: 1,
                  padding: spacing[3.5],
                  background: "transparent",
                  border: `1px solid ${alpha(colors.neutral[0], 0.1)}`,
                  borderRadius: borderRadius.lg,
                  color: alpha(colors.neutral[0], 0.35),
                  fontSize: typography.fontSize.sm,
                  fontFamily: "inherit",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                style={{
                  flex: 2,
                  padding: spacing[3.5],
                  background: `linear-gradient(135deg, ${colors.brand.ember}, ${colors.brand.emberDim})`,
                  border: "none",
                  borderRadius: borderRadius.lg,
                  color: colors.brand.onEmber,
                  fontSize: typography.fontSize.sm,
                  fontWeight: typography.fontWeight.semibold,
                  fontFamily: "inherit",
                  cursor: "pointer",
                  boxShadow: shadows.emberButton,
                }}
              >
                Confirm check-in
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
