import type { Scar } from "@/lib/state/types";
import { formatDate } from "@/lib/utils/date";

interface Props {
  scars: Scar[];
}

export function ScarList({ scars }: Props) {
  if (scars.length === 0) {
    return (
      <div style={{ padding: "16px", textAlign: "center", color: "rgba(255,255,255,0.3)", fontSize: "13px" }}>
        No scars yet. Keep the streak alive.
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      <div style={{ fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", marginBottom: "4px" }}>
        Scars — {scars.length}
      </div>
      {scars.map((scar) => (
        <div
          key={scar.id}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "12px 14px",
            borderRadius: "10px",
            background: "rgba(200,74,74,0.06)",
            border: "1px solid rgba(200,74,74,0.2)",
          }}
        >
          <span style={{ fontSize: "16px", color: "#C84A4A", minWidth: "20px" }}>✕</span>
          <div>
            <div style={{ fontSize: "13px", color: "#D48A8A", fontWeight: 500, marginBottom: "2px" }}>
              {scar.description}
            </div>
            <div style={{ fontSize: "11px", color: "rgba(212,138,138,0.5)" }}>
              {formatDate(scar.brokenAt)} · streak was {scar.streakAtBreak} day{scar.streakAtBreak !== 1 ? "s" : ""}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
