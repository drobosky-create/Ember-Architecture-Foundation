import { useState } from "react";
import { useJourneyStore } from "@/lib/state/useJourneyStore";
import { colors, typography, spacing, borderRadius, alpha } from "@/lib/config/tokens";

interface Props {
  onCreated: () => void;
}

export function CreateJourney({ onCreated }: Props) {
  const [name, setName] = useState("");
  const [intention, setIntention] = useState("");
  const createJourney = useJourneyStore((s) => s.createJourney);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    createJourney(name.trim(), intention.trim());
    onCreated();
  }

  return (
    <div
      style={{
        minHeight: "100dvh",
        background: colors.surface.night,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: `${spacing[8]} ${spacing[6]}`,
      }}
    >
      <div style={{ marginBottom: spacing[12] }}>
        <div
          style={{
            fontSize: "11px",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: colors.brand.ember,
            marginBottom: spacing[3],
          }}
        >
          EMBER
        </div>
        <h1
          style={{
            fontSize: "28px",
            fontWeight: typography.fontWeight.bold,
            color: colors.foreground,
            lineHeight: typography.lineHeight.tight,
            margin: 0,
            marginBottom: spacing[3],
          }}
        >
          Begin a journey
        </h1>
        <p
          style={{
            fontSize: typography.fontSize.sm,
            color: alpha(colors.foreground, 0.5),
            lineHeight: 1.6,
            margin: 0,
          }}
        >
          A journey is a commitment you make to yourself. Name it. Set your
          intention. Show up.
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: spacing[5] }}>
        <div>
          <label
            style={{
              display: "block",
              fontSize: "11px",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: alpha(colors.neutral[0], 0.4),
              marginBottom: spacing[2],
            }}
          >
            Journey Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Morning meditation, Daily writing..."
            maxLength={60}
            style={{
              width: "100%",
              padding: "14px 16px",
              background: alpha(colors.neutral[0], 0.05),
              border: `1px solid ${alpha(colors.neutral[0], 0.12)}`,
              borderRadius: borderRadius.lg,
              color: colors.foreground,
              fontSize: typography.fontSize.base,
              outline: "none",
              fontFamily: "inherit",
              transition: "border-color 0.2s",
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = `${colors.brand.ember}55`)}
            onBlur={(e) => (e.currentTarget.style.borderColor = alpha(colors.neutral[0], 0.12))}
          />
        </div>

        <div>
          <label
            style={{
              display: "block",
              fontSize: "11px",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: alpha(colors.neutral[0], 0.4),
              marginBottom: spacing[2],
            }}
          >
            Intention{" "}
            <span style={{ opacity: 0.5, fontStyle: "italic", textTransform: "none", letterSpacing: 0 }}>
              (optional)
            </span>
          </label>
          <textarea
            value={intention}
            onChange={(e) => setIntention(e.target.value)}
            placeholder="Why does this matter to you?"
            rows={3}
            maxLength={200}
            style={{
              width: "100%",
              padding: "14px 16px",
              background: alpha(colors.neutral[0], 0.05),
              border: `1px solid ${alpha(colors.neutral[0], 0.12)}`,
              borderRadius: borderRadius.lg,
              color: colors.foreground,
              fontSize: "15px",
              outline: "none",
              fontFamily: "inherit",
              resize: "none",
              lineHeight: typography.lineHeight.normal,
              transition: "border-color 0.2s",
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = `${colors.brand.ember}55`)}
            onBlur={(e) => (e.currentTarget.style.borderColor = alpha(colors.neutral[0], 0.12))}
          />
        </div>

        <button
          type="submit"
          disabled={!name.trim()}
          style={{
            marginTop: spacing[2],
            padding: spacing[4],
            background: name.trim() ? colors.brand.ember : alpha(colors.neutral[0], 0.06),
            border: "none",
            borderRadius: borderRadius.lg,
            color: name.trim() ? colors.brand.onEmber : alpha(colors.neutral[0], 0.25),
            fontSize: "15px",
            fontWeight: typography.fontWeight.semibold,
            fontFamily: "inherit",
            cursor: name.trim() ? "pointer" : "not-allowed",
            transition: "all 0.2s",
            letterSpacing: "0.02em",
          }}
        >
          Light the Ember
        </button>
      </form>
    </div>
  );
}
