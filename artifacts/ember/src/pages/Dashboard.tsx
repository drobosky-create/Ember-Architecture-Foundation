import { useState } from "react";
import { useJourneyStore } from "@/lib/state/useJourneyStore";
import { EnvironmentDisplay } from "@/components/EnvironmentDisplay";
import { CompanionDisplay } from "@/components/CompanionDisplay";
import { StreakDisplay } from "@/components/StreakDisplay";
import { MilestoneList } from "@/components/MilestoneList";
import { ScarList } from "@/components/ScarList";
import { CheckInPanel } from "@/components/CheckInPanel";
import { MilestoneToast } from "@/components/MilestoneToast";
import { todayString } from "@/lib/utils/date";
import { ENVIRONMENT_STATES } from "@/lib/config/environment-states";
import { environmentPalette, colors, typography, spacing, borderRadius, shadows, alpha } from "@/lib/config/tokens";
import { computeJourneyStats } from "@/lib/utils/engine";

type Tab = "home" | "milestones" | "history";

export function Dashboard() {
  // Proper Zustand selector: subscribes to the specific journey object.
  // Re-renders whenever the active journey's raw data changes.
  const journeyData = useJourneyStore(
    (s) => s.activeJourneyId ? s.journeys[s.activeJourneyId] ?? null : null
  );
  const simulateMissedDays = useJourneyStore((s) => s.simulateMissedDays);
  const resetJourney = useJourneyStore((s) => s.resetJourney);

  const [tab, setTab] = useState<Tab>("home");
  const [showCheckIn, setShowCheckIn] = useState(false);
  const [simulating, setSimulating] = useState(false);

  if (!journeyData) return null;

  const { journey, checkIns, scars, unlockedMilestones } = journeyData;

  // Stats are computed from raw data on each render — never stale.
  const stats = computeJourneyStats(journeyData);

  const checkedInToday = checkIns.some((c) => c.date === todayString());
  const envConfig = ENVIRONMENT_STATES[stats.environmentState];
  const pageBg = environmentPalette[stats.environmentState].pageBg;

  function handleSimulateMiss() {
    if (simulating) return;
    setSimulating(true);
    simulateMissedDays(journey.id, 3);
    setTimeout(() => setSimulating(false), 600);
  }

  function handleReset() {
    resetJourney(journey.id);
  }

  return (
    <div
      style={{
        minHeight: "100dvh",
        background: pageBg,
        transition: "background 1200ms ease",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <MilestoneToast />

      {showCheckIn && (
        <CheckInPanel
          journeyId={journey.id}
          onClose={() => setShowCheckIn(false)}
        />
      )}

      <header
        style={{
          padding: `${spacing[5]} ${spacing[5]} 0`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div>
          <div style={{ fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase", color: colors.brand.ember, opacity: 0.8, marginBottom: "2px" }}>
            EMBER
          </div>
          <h2 style={{ margin: 0, fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.semibold, color: colors.foreground }}>
            {journey.name}
          </h2>
        </div>
        <div
          style={{
            fontSize: typography.fontSize["2xl"],
            color: colors.brand.ember,
            opacity: stats.currentStreak > 0 ? 1 : 0.3,
          }}
          className={stats.currentStreak > 0 ? "anim-pulse" : ""}
        >
          {envConfig.symbolGlyph}
        </div>
      </header>

      <nav style={{ display: "flex", gap: spacing[1], padding: `${spacing[4]} ${spacing[5]} 0` }}>
        {(["home", "milestones", "history"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              flex: 1,
              padding: spacing[2],
              background: tab === t ? alpha(colors.brand.ember, 0.15) : "transparent",
              border: `1px solid ${tab === t ? alpha(colors.brand.ember, 0.35) : alpha(colors.neutral[0], 0.08)}`,
              borderRadius: borderRadius.md,
              color: tab === t ? colors.brand.ember : alpha(colors.neutral[0], 0.35),
              fontSize: "11px",
              fontFamily: "inherit",
              fontWeight: tab === t ? typography.fontWeight.semibold : typography.fontWeight.regular,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            {t}
          </button>
        ))}
      </nav>

      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: `${spacing[4]} ${spacing[5]}`,
          display: "flex",
          flexDirection: "column",
          gap: spacing[3],
        }}
      >
        {tab === "home" && (
          <>
            <EnvironmentDisplay state={stats.environmentState} />
            <CompanionDisplay state={stats.companionState} />
            <StreakDisplay
              current={stats.currentStreak}
              longest={stats.longestStreak}
              totalCheckIns={stats.totalCheckIns}
              missedDays={stats.missedDays}
            />

            {journey.intention && (
              <div style={{
                padding: "14px 16px",
                background: alpha(colors.neutral[0], 0.03),
                borderRadius: borderRadius.lg,
                border: `1px solid ${alpha(colors.neutral[0], 0.06)}`,
              }}>
                <div style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.1em", color: alpha(colors.neutral[0], 0.3), marginBottom: "6px" }}>
                  Your intention
                </div>
                <p style={{ margin: 0, fontSize: "13px", color: alpha(colors.neutral[0], 0.55), lineHeight: 1.6, fontStyle: "italic" }}>
                  &ldquo;{journey.intention}&rdquo;
                </p>
              </div>
            )}

            <div style={{
              marginTop: spacing[1],
              padding: "12px 14px",
              background: alpha(colors.accent.caution, 0.05),
              border: `1px solid ${alpha(colors.accent.caution, 0.15)}`,
              borderRadius: borderRadius.lg,
            }}>
              <div style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.1em", color: alpha(colors.accent.caution, 0.6), marginBottom: spacing[2] }}>
                Prototype Controls
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: spacing[2] }}>
                <button
                  onClick={handleSimulateMiss}
                  disabled={simulating}
                  style={{
                    padding: "8px 14px",
                    background: alpha(colors.accent.danger, 0.15),
                    border: `1px solid ${alpha(colors.accent.danger, 0.3)}`,
                    borderRadius: borderRadius.md,
                    color: colors.accent.dangerText,
                    fontSize: typography.fontSize.xs,
                    fontFamily: "inherit",
                    cursor: "pointer",
                  }}
                >
                  Simulate 3 missed days
                </button>
                <button
                  onClick={handleReset}
                  style={{
                    padding: "8px 14px",
                    background: alpha(colors.neutral[0], 0.04),
                    border: `1px solid ${alpha(colors.neutral[0], 0.1)}`,
                    borderRadius: borderRadius.md,
                    color: alpha(colors.neutral[0], 0.4),
                    fontSize: typography.fontSize.xs,
                    fontFamily: "inherit",
                    cursor: "pointer",
                  }}
                >
                  Reset journey
                </button>
              </div>
            </div>
          </>
        )}

        {tab === "milestones" && (
          <MilestoneList unlocked={unlockedMilestones} />
        )}

        {tab === "history" && (
          <>
            <ScarList scars={scars} />
            <div style={{ marginTop: spacing[2] }}>
              <div style={{ fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase", color: alpha(colors.neutral[0], 0.35), marginBottom: spacing[2] }}>
                Check-in History
              </div>
              {checkIns.length === 0 && (
                <div style={{ padding: spacing[4], textAlign: "center", color: alpha(colors.neutral[0], 0.25), fontSize: "13px" }}>
                  No check-ins yet.
                </div>
              )}
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                {[...checkIns]
                  .sort((a, b) => b.date.localeCompare(a.date))
                  .map((c) => (
                    <div
                      key={c.id}
                      style={{
                        padding: "10px 14px",
                        background: alpha(colors.brand.ember, 0.06),
                        border: `1px solid ${alpha(colors.brand.ember, 0.15)}`,
                        borderRadius: "10px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <div style={{ fontSize: "13px", color: colors.brand.ember }}>◈</div>
                      <div style={{ flex: 1, padding: `0 ${spacing[3]}` }}>
                        <div style={{ fontSize: "13px", color: colors.accent.parchment }}>
                          {c.date === todayString() ? "Today" : c.date}
                        </div>
                        {c.note && (
                          <div style={{ fontSize: typography.fontSize.xs, color: alpha(colors.neutral[0], 0.35), marginTop: "2px" }}>
                            {c.note}
                          </div>
                        )}
                      </div>
                      <div style={{ fontSize: typography.fontSize.xs, color: alpha(colors.neutral[0], 0.2) }}>✓</div>
                    </div>
                  ))}
              </div>
            </div>
          </>
        )}
      </div>

      <div style={{ padding: `${spacing[4]} ${spacing[5]} ${spacing[8]}` }}>
        <button
          onClick={() => setShowCheckIn(true)}
          disabled={checkedInToday}
          style={{
            width: "100%",
            padding: spacing[4],
            background: checkedInToday
              ? alpha(colors.neutral[0], 0.05)
              : `linear-gradient(135deg, ${colors.brand.ember}, ${colors.brand.emberDim})`,
            border: checkedInToday
              ? `1px solid ${alpha(colors.neutral[0], 0.08)}`
              : "none",
            borderRadius: "14px",
            color: checkedInToday ? alpha(colors.neutral[0], 0.25) : colors.brand.onEmber,
            fontSize: "15px",
            fontWeight: typography.fontWeight.semibold,
            fontFamily: "inherit",
            cursor: checkedInToday ? "not-allowed" : "pointer",
            letterSpacing: "0.02em",
            boxShadow: checkedInToday ? shadows.none : shadows.emberButton,
            transition: "all 0.2s",
          }}
        >
          {checkedInToday ? "Checked in today ✓" : "Check In"}
        </button>
      </div>
    </div>
  );
}
