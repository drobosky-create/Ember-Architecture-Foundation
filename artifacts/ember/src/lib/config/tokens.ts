import type { EnvironmentState } from "./environment-states";
import type { CompanionState } from "./companion-states";

export const colors = {
  brand: {
    ember: "#E8613A",
    emberDim: "#B84B2A",
    emberGlow: "#FF8A5B",
    /** Hottest inner-core point of the ember mark. */
    emberCore: "#FF9A6C",
    /** Near-white text that sits on the ember gradient/fill. */
    onEmber: "#FFF8F4",
    coal: "#1A1208",
    ash: "#2E2416",
    smoke: "#3D3020",
  },
  neutral: {
    0: "#FFFFFF",
    50: "#F5F5F5",
    100: "#E8E8E8",
    200: "#D0D0D0",
    300: "#A8A8A8",
    400: "#787878",
    500: "#505050",
    600: "#383838",
    700: "#282828",
    800: "#1A1A1A",
    900: "#0F0F0F",
    950: "#080808",
    black: "#000000",
  },
  semantic: {
    success: "#4CAF50",
    warning: "#FF9800",
    error: "#F44336",
    info: "#2196F3",
  },
  /**
   * Global text color on the dark UI. Mirrored as the `--color-foreground`
   * bootstrap value in `index.css` (CSS can't import this module).
   */
  foreground: "#F0E8E0",
  /** Opaque page/sheet backgrounds used outside the environment palette. */
  surface: {
    night: "#0A0804",   // CreateJourney page background
    panel: "#121008",   // CheckInPanel bottom sheet
    toast: "#1E140A",   // MilestoneToast background base
  },
  /** Accent colors for milestones, scars and the prototype controls. */
  accent: {
    recovery: "#FFD580",   // recovery-type milestones (also companion "hopeful")
    symbolic: "#9B9BB8",   // symbolic-type milestones (also companion "grieving")
    temporal: "#A0D4FF",   // temporal-type milestones
    danger: "#C84A4A",     // scar / broken-streak red
    dangerText: "#D48A8A", // scar text (also env "critical" text)
    parchment: "#D4B090",  // check-in history date text
    caution: "#FFC832",    // prototype-controls warning yellow
    scarSeam: "#D4956A",   // healed-seam color on the ember mark scars
  },
  /** Solid muted greys used for inactive/secondary glyphs and labels. */
  muted: {
    light: "#A0A0A0",  // longest streak / totals stat values
    mid: "#666666",    // locked milestone label (also dormant ember shell)
    dim: "#555555",    // inactive glyph / zero-streak value
    faint: "#444444",  // locked milestone description
    ashLight: "#888888", // dormant ember shell highlight
  },
} as const;

/**
 * Build a translucent color from a 6-digit hex token and an opacity (0–1).
 * Lets components reference a token color at any alpha without hardcoding
 * `rgba(...)` literals — e.g. `alpha(colors.brand.ember, 0.15)`.
 */
export function alpha(hex: string, opacity: number): string {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

export interface EnvironmentPaletteEntry {
  pageBg: string;
  cardBg: string;
  border: string;
  text: string;
  glow: string;
}

export const environmentPalette: Record<EnvironmentState, EnvironmentPaletteEntry> = {
  thriving: {
    pageBg: "#050F05",
    cardBg: "#0D1F0D",
    border: "#2E5A2E",
    text: "#A8D5AA",
    glow: "0 0 30px rgba(76,175,80,0.25)",
  },
  stable: {
    pageBg: "#050810",
    cardBg: "#0D1220",
    border: "#1E3A5A",
    text: "#A0B8D4",
    glow: "0 0 30px rgba(91,127,166,0.25)",
  },
  struggling: {
    pageBg: "#100804",
    cardBg: "#1E1004",
    border: "#4A3010",
    text: "#D4B48A",
    glow: "0 0 30px rgba(200,135,74,0.25)",
  },
  critical: {
    pageBg: "#100404",
    cardBg: "#1A0404",
    border: "#4A1010",
    text: "#D48A8A",
    glow: "0 0 30px rgba(200,74,74,0.25)",
  },
  dormant: {
    pageBg: "#060606",
    cardBg: "#0A0A0A",
    border: "#222222",
    text: "#666666",
    glow: "none",
  },
};

export interface CompanionPaletteEntry {
  color: string;
  bg: string;
}

export const companionPalette: Record<CompanionState, CompanionPaletteEntry> = {
  present:  { color: "#A8D5AA", bg: "rgba(168,213,170,0.08)" },
  hopeful:  { color: "#FFD580", bg: "rgba(255,213,128,0.08)" },
  worried:  { color: "#FF9B6A", bg: "rgba(255,155,106,0.08)" },
  grieving: { color: "#9B9BB8", bg: "rgba(155,155,184,0.08)" },
  dormant:  { color: "#555555", bg: "rgba(85,85,85,0.08)" },
};

export const typography = {
  fontFamily: {
    sans: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    serif: "'Georgia', 'Times New Roman', serif",
    mono: "'Fira Code', 'Cascadia Code', monospace",
  },
  fontSize: {
    "2xs": "0.6875rem", // 11px — uppercase eyebrow labels, fine print
    xs: "0.75rem", // 12px
    caption: "0.8125rem", // 13px — secondary body text, dates, notes
    sm: "0.875rem", // 14px
    input: "0.9375rem", // 15px — form inputs, primary buttons, toast title
    base: "1rem", // 16px
    lg: "1.125rem", // 18px
    xl: "1.25rem", // 20px
    "2xl": "1.5rem", // 24px
    display: "1.75rem", // 28px — large stat numbers, page glyph, page H1
    "3xl": "1.875rem", // 30px
    "4xl": "2.25rem", // 36px
    "5xl": "3rem", // 48px
  },
  fontWeight: {
    light: 300,
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  lineHeight: {
    tight: 1.2,
    snug: 1.35,
    normal: 1.5,
    relaxed: 1.65,
    loose: 2,
  },
  letterSpacing: {
    tight: "-0.02em",
    normal: "0",
    wide: "0.04em",
    wider: "0.08em",
    widest: "0.16em",
  },
} as const;

// Numeric keys follow a 4px grid: key N === N * 0.25rem === N * 4px.
// Quarter/half steps (0.5, 0.75, 1.5, 2.5, 3.5) cover the off-grid values the
// UI actually uses (2/3/6/10/14px) so nothing has to be hardcoded.
export const spacing = {
  0: "0",
  0.5: "0.125rem", // 2px
  0.75: "0.1875rem", // 3px
  1: "0.25rem", // 4px
  1.5: "0.375rem", // 6px
  2: "0.5rem", // 8px
  2.5: "0.625rem", // 10px
  3: "0.75rem", // 12px
  3.5: "0.875rem", // 14px
  4: "1rem", // 16px
  5: "1.25rem", // 20px
  6: "1.5rem", // 24px
  8: "2rem", // 32px
  10: "2.5rem", // 40px
  12: "3rem", // 48px
  16: "4rem",
  20: "5rem",
  24: "6rem",
  32: "8rem",
  40: "10rem",
  48: "12rem",
  64: "16rem",
  mobileMax: "430px",
  mobileMin: "320px",
  avatar: "72px", // companion avatar diameter
  toastMax: "380px", // milestone toast max width
} as const;

export const shadows = {
  none: "none",
  sm: "0 1px 3px rgba(0,0,0,0.4)",
  md: "0 4px 12px rgba(0,0,0,0.5)",
  lg: "0 8px 24px rgba(0,0,0,0.6)",
  xl: "0 16px 40px rgba(0,0,0,0.7)",
  glow: {
    ember: "0 0 20px rgba(232,97,58,0.4), 0 0 40px rgba(232,97,58,0.2)",
    green: "0 0 20px rgba(76,175,80,0.4)",
    blue: "0 0 20px rgba(91,127,166,0.4)",
    red: "0 0 20px rgba(200,74,74,0.4)",
  },
  inset: "inset 0 2px 8px rgba(0,0,0,0.5)",
  /** Drop shadow under the primary ember "Check In" buttons. */
  emberButton: "0 4px 20px rgba(232,97,58,0.4)",
  /** Elevated milestone toast shadow (depth + ember halo). */
  toast: "0 8px 30px rgba(0,0,0,0.8), 0 0 20px rgba(232,97,58,0.3)",
} as const;

export const borderRadius = {
  none: "0",
  sm: "4px",
  md: "8px",
  lg: "12px",
  xl: "16px",
  "2xl": "24px",
  "3xl": "32px",
  full: "9999px",
  card: "16px",
  row: "10px", // list-row cards (milestones, scars, check-in history)
  button: "14px", // primary action button ("Check In")
  pill: "999px",
  circle: "50%",
} as const;

export const animation = {
  duration: {
    instant: "0ms",
    fast: "100ms",
    normal: "200ms",
    slow: "350ms",
    slower: "500ms",
    sluggish: "800ms",
    ceremony: "1200ms",
  },
  easing: {
    linear: "linear",
    easeIn: "cubic-bezier(0.4, 0, 1, 1)",
    easeOut: "cubic-bezier(0, 0, 0.2, 1)",
    easeInOut: "cubic-bezier(0.4, 0, 0.2, 1)",
    spring: "cubic-bezier(0.34, 1.56, 0.64, 1)",
    decelerate: "cubic-bezier(0, 0, 0.2, 1)",
  },
  transition: {
    default: "200ms cubic-bezier(0.4, 0, 0.2, 1)",
    slow: "500ms cubic-bezier(0.4, 0, 0.2, 1)",
    spring: "350ms cubic-bezier(0.34, 1.56, 0.64, 1)",
    environmentShift: "1200ms cubic-bezier(0.4, 0, 0.2, 1)",
  },
} as const;
