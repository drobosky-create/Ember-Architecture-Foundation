import { colors, typography, alpha } from "@/lib/config/tokens";

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: "100dvh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: colors.neutral[950],
        color: alpha(colors.neutral[0], 0.4),
        fontSize: typography.fontSize.sm,
      }}
    >
      Page not found
    </div>
  );
}
