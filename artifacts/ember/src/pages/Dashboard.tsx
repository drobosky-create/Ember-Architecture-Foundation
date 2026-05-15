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

type Tab = "home" | "milestones" | "history";

export function Dashboard() {
  const { getActiveJourney, simulateMissedDays, resetJourney } = useJourneyStore();
  const data = getActiveJourney();
  const [tab, setTab] = useState<Tab>("home");
  const [showCheckIn, setShowCheckIn] = useState(false);
  const [simulating, setSimulating] = useState(false);

  if (!data) return null;

  const { journey, stats, checkIns, scars, unlockedMilestones } = data;
  const checkedInToday = checkIns.some((c) => c.date === todayString());
  const envConfig = ENVIRONMENT_STATES[stats.environmentState];

  function handleSimulateMiss() {
    if (simulating) return;
    setSimulating(true);
    simulateMissedDays(journey.id, 3);
    setTimeout(() => setSimulating(false), 600);
  }

  function handleReset() {
    resetJourney(journey.id);
  }

  const ENV_BG: Record<string, string> = {
    thriving:   "#050F05",
    stable:     "#050810",
    struggling: "#100804",
    critical:   "#100404",
    dormant:    "#060606",
  };
  const pageBg = ENV_BG[stats.environmentState] ?? "#080808";

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
          padding: "20px 20px 0",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div>
          <div style={{ fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase", color: "#E8613A", opacity: 0.8, marginBottom: "2px" }}>
            EMBER
          </div>
          <h2 style={{ margin: 0, fontSize: "18px", fontWeight: 600, color: "#F0E8E0" }}>
            {journey.name}
          </h2>
        </div>
        <div
          style={{
            fontSize: "24px",
            color: "#E8613A",
            opacity: stats.currentStreak > 0 ? 1 : 0.3,
          }}
          className={stats.currentStreak > 0 ? "anim-pulse" : ""}
        >
          {envConfig.symbolGlyph}
        </div>
      </header>

      <nav style={{
        display: "flex",
        gap: "4px",
        padding: "16px 20px 0",
      }}>
        {(["home", "milestones", "history"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              flex: 1,
              padding: "8px",
              background: tab === t ? "rgba(232,97,58,0.15)" : "transparent",
              border: `1px solid ${tab === t ? "rgba(232,97,58,0.35)" : "rgba(255,255,255,0.08)"}`,
              borderRadius: "8px",
              color: tab === t ? "#E8613A" : "rgba(255,255,255,0.35)",
              fontSize: "11px",
              fontFamily: "inherit",
              fontWeight: tab === t ? 600 : 400,
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
          padding: "16px 20px",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
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
                background: "rgba(255,255,255,0.03)",
                borderRadius: "12px",
                border: "1px solid rgba(255,255,255,0.06)",
              }}>
                <div style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(255,255,255,0.3)", marginBottom: "6px" }}>
                  Your intention
                </div>
                <p style={{ margin: 0, fontSize: "13px", color: "rgba(255,255,255,0.55)", lineHeight: 1.6, fontStyle: "italic" }}>
                  &ldquo;{journey.intention}&rdquo;
                </p>
              </div>
            )}

            <div style={{
              marginTop: "4px",
              padding: "12px 14px",
              background: "rgba(255,200,50,0.05)",
              border: "1px solid rgba(255,200,50,0.15)",
              borderRadius: "12px",
            }}>
              <div style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(255,200,50,0.6)", marginBottom: "8px" }}>
                Prototype Controls
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                <button
                  onClick={handleSimulateMiss}
                  disabled={simulating}
                  style={{
                    padding: "8px 14px",
                    background: "rgba(200,74,74,0.15)",
                    border: "1px solid rgba(200,74,74,0.3)",
                    borderRadius: "8px",
                    color: "#D48A8A",
                    fontSize: "12px",
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
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "8px",
                    color: "rgba(255,255,255,0.4)",
                    fontSize: "12px",
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
            <div style={{ marginTop: "8px" }}>
              <div style={{ fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", marginBottom: "8px" }}>
                Check-in History
              </div>
              {checkIns.length === 0 && (
                <div style={{ padding: "16px", textAlign: "center", color: "rgba(255,255,255,0.25)", fontSize: "13px" }}>
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
                        background: "rgba(232,97,58,0.06)",
                        border: "1px solid rgba(232,97,58,0.15)",
                        borderRadius: "10px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <div style={{ fontSize: "13px", color: "#E8613A" }}>◈</div>
                      <div style={{ flex: 1, padding: "0 12px" }}>
                        <div style={{ fontSize: "13px", color: "#D4B090" }}>
                          {c.date === todayString() ? "Today" : c.date}
                        </div>
                        {c.note && (
                          <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.35)", marginTop: "2px" }}>
                            {c.note}
                          </div>
                        )}
                      </div>
                      <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.2)" }}>✓</div>
                    </div>
                  ))}
              </div>
            </div>
          </>
        )}
      </div>

      <div style={{ padding: "16px 20px 32px" }}>
        <button
          onClick={() => setShowCheckIn(true)}
          disabled={checkedInToday}
          style={{
            width: "100%",
            padding: "16px",
            background: checkedInToday
              ? "rgba(255,255,255,0.05)"
              : "linear-gradient(135deg, #E8613A, #B84B2A)",
            border: checkedInToday
              ? "1px solid rgba(255,255,255,0.08)"
              : "none",
            borderRadius: "14px",
            color: checkedInToday ? "rgba(255,255,255,0.25)" : "#FFF8F4",
            fontSize: "15px",
            fontWeight: 600,
            fontFamily: "inherit",
            cursor: checkedInToday ? "not-allowed" : "pointer",
            letterSpacing: "0.02em",
            boxShadow: checkedInToday
              ? "none"
              : "0 4px 20px rgba(232,97,58,0.4)",
            transition: "all 0.2s",
          }}
        >
          {checkedInToday ? "Checked in today ✓" : "Check In"}
        </button>
      </div>
    </div>
  );
}
