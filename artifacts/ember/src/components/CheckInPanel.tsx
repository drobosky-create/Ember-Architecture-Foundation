import { useState } from "react";
import { useJourneyStore } from "@/lib/state/useJourneyStore";

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
        background: "rgba(0,0,0,0.85)",
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
          background: "#121008",
          border: "1px solid rgba(232,97,58,0.2)",
          borderRadius: "24px 24px 0 0",
          padding: "32px 24px",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        {confirmed ? (
          <div style={{ textAlign: "center", padding: "24px 0" }}>
            <div style={{ fontSize: "48px", marginBottom: "12px" }} className="anim-pulse">◈</div>
            <div style={{ fontSize: "20px", fontWeight: 700, color: "#E8613A", marginBottom: "8px" }}>
              Ember stoked
            </div>
            <div style={{ fontSize: "14px", color: "rgba(255,255,255,0.45)" }}>
              You showed up today.
            </div>
          </div>
        ) : (
          <>
            <div>
              <div style={{ fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase", color: "#E8613A", marginBottom: "6px" }}>
                DAILY CHECK-IN
              </div>
              <h3 style={{ margin: 0, fontSize: "20px", fontWeight: 700, color: "#F0E8E0" }}>
                You showed up.
              </h3>
              <p style={{ margin: "6px 0 0", fontSize: "13px", color: "rgba(255,255,255,0.4)", lineHeight: 1.5 }}>
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
                padding: "14px 16px",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "12px",
                color: "#F0E8E0",
                fontSize: "15px",
                outline: "none",
                fontFamily: "inherit",
                resize: "none",
                lineHeight: 1.5,
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#E8613A44")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
            />

            <div style={{ display: "flex", gap: "10px" }}>
              <button
                onClick={onClose}
                style={{
                  flex: 1,
                  padding: "14px",
                  background: "transparent",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "12px",
                  color: "rgba(255,255,255,0.35)",
                  fontSize: "14px",
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
                  padding: "14px",
                  background: "linear-gradient(135deg, #E8613A, #B84B2A)",
                  border: "none",
                  borderRadius: "12px",
                  color: "#FFF8F4",
                  fontSize: "14px",
                  fontWeight: 600,
                  fontFamily: "inherit",
                  cursor: "pointer",
                  boxShadow: "0 4px 20px rgba(232,97,58,0.4)",
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
