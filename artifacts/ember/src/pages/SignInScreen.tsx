import type { CSSProperties } from "react";
import { SignInButton, SignUpButton } from "@clerk/clerk-react";
import { colors, typography, spacing, borderRadius, alpha } from "@/lib/config/tokens";
import { EmberMark } from "@/components/EmberMark";

const primaryButton: CSSProperties = {
  width: "100%",
  padding: spacing[4],
  background: `linear-gradient(135deg, ${colors.brand.ember}, ${colors.brand.emberDim})`,
  border: "none",
  borderRadius: borderRadius.button,
  color: colors.brand.onEmber,
  fontSize: typography.fontSize.input,
  fontWeight: typography.fontWeight.semibold,
  fontFamily: "inherit",
  cursor: "pointer",
};

const secondaryButton: CSSProperties = {
  width: "100%",
  padding: spacing[4],
  background: "transparent",
  border: `1px solid ${alpha(colors.neutral[0], 0.12)}`,
  borderRadius: borderRadius.button,
  color: alpha(colors.neutral[0], 0.6),
  fontSize: typography.fontSize.input,
  fontWeight: typography.fontWeight.medium,
  fontFamily: "inherit",
  cursor: "pointer",
};

export function SignInScreen() {
  return (
    <div
      style={{
        minHeight: "100dvh",
        background: colors.surface.night,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: `${spacing[8]} ${spacing[6]}`,
        gap: spacing[6],
      }}
    >
      <EmberMark state="thriving" size={72} />

      <div>
        <div style={{ fontSize: typography.fontSize["2xs"], letterSpacing: "0.2em", textTransform: "uppercase", color: colors.brand.ember, marginBottom: spacing[2] }}>
          EMBER
        </div>
        <h1 style={{ margin: 0, fontSize: typography.fontSize.display, fontWeight: typography.fontWeight.bold, color: colors.foreground, lineHeight: typography.lineHeight.tight }}>
          Keep the flame alive
        </h1>
        <p style={{ margin: `${spacing[3]} 0 0`, fontSize: typography.fontSize.sm, color: alpha(colors.foreground, 0.5), lineHeight: typography.lineHeight.normal, maxWidth: spacing.toastMax }}>
          A daily ritual for the commitments that matter. Sign in to tend your journey.
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: spacing[3], width: "100%", maxWidth: spacing.toastMax }}>
        <SignUpButton mode="modal">
          <button style={primaryButton}>Create account</button>
        </SignUpButton>
        <SignInButton mode="modal">
          <button style={secondaryButton}>Sign in</button>
        </SignInButton>
      </div>
    </div>
  );
}
