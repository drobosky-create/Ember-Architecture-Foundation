import { colors, typography, spacing, borderRadius, alpha } from "@/lib/config/tokens";

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
      gap: spacing[2.5],
    }}>
      <StatCard
        label="Current Streak"
        value={current}
        unit="days"
        color={current > 0 ? colors.brand.ember : colors.muted.dim}
        highlight
      />
      <StatCard
        label="Longest Streak"
        value={longest}
        unit="days"
        color={colors.muted.light}
      />
      <StatCard
        label="Total Check-ins"
        value={totalCheckIns}
        unit=""
        color={colors.muted.light}
      />
      <StatCard
        label="Days Missed"
        value={missedDays}
        unit=""
        color={missedDays > 0 ? colors.accent.danger : colors.semantic.success}
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
      background: highlight ? `${color}12` : alpha(colors.neutral[0], 0.03),
      border: `1px solid ${highlight ? color + "30" : alpha(colors.neutral[0], 0.06)}`,
      borderRadius: borderRadius.lg,
      padding: spacing[3.5],
      textAlign: "center",
    }}>
      <div style={{
        fontSize: typography.fontSize.display,
        fontWeight: typography.fontWeight.bold,
        color,
        lineHeight: 1,
        marginBottom: spacing[1],
      }}>
        {value}
        {unit && (
          <span style={{ fontSize: typography.fontSize.xs, fontWeight: typography.fontWeight.regular, marginLeft: spacing[0.75], opacity: 0.7 }}>
            {unit}
          </span>
        )}
      </div>
      <div style={{ fontSize: typography.fontSize["2xs"], color: alpha(colors.neutral[0], 0.4), letterSpacing: "0.06em", textTransform: "uppercase" }}>
        {label}
      </div>
    </div>
  );
}
