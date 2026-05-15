interface Props {
  current: number;
  longest: number;
  totalCheckIns: number;
  missedDays: number;
}

export function StreakDisplay({ current, longest, totalCheckIns, missedDays }: Props) {
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "10px",
    }}>
      <StatCard
        label="Current Streak"
        value={current}
        unit="days"
        color={current > 0 ? "#E8613A" : "#555"}
        highlight
      />
      <StatCard
        label="Longest Streak"
        value={longest}
        unit="days"
        color="#A0A0A0"
      />
      <StatCard
        label="Total Check-ins"
        value={totalCheckIns}
        unit=""
        color="#A0A0A0"
      />
      <StatCard
        label="Days Missed"
        value={missedDays}
        unit=""
        color={missedDays > 0 ? "#C84A4A" : "#4CAF50"}
      />
    </div>
  );
}

function StatCard({
  label,
  value,
  unit,
  color,
  highlight,
}: {
  label: string;
  value: number;
  unit: string;
  color: string;
  highlight?: boolean;
}) {
  return (
    <div style={{
      background: highlight ? `${color}12` : "rgba(255,255,255,0.03)",
      border: `1px solid ${highlight ? color + "30" : "rgba(255,255,255,0.06)"}`,
      borderRadius: "12px",
      padding: "14px",
      textAlign: "center",
    }}>
      <div style={{
        fontSize: "28px",
        fontWeight: 700,
        color,
        lineHeight: 1,
        marginBottom: "4px",
      }}>
        {value}
        {unit && (
          <span style={{ fontSize: "12px", fontWeight: 400, marginLeft: "3px", opacity: 0.7 }}>
            {unit}
          </span>
        )}
      </div>
      <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
        {label}
      </div>
    </div>
  );
}
