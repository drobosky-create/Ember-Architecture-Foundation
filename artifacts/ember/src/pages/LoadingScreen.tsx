import { colors, typography, spacing, alpha } from "@/lib/config/tokens";
import { EmberMark } from "@/components/EmberMark";

export function LoadingScreen() {
  return (
    <div
      style={{
        minHeight: "100dvh",
        background: colors.surface.night,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: spacing[5],
      }}
    >
      <EmberMark state="stable" size={56} />
      <div
        style={{
          fontSize: typography.fontSize["2xs"],
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: alpha(colors.foreground, 0.5),
        }}
      >
        Tending your journey…
      </div>
    </div>
  );
}
