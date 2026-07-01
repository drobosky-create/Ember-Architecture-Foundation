#!/usr/bin/env node
/**
 * Token-drift guard (spacing/typography): fails if any component/page contains
 * a raw `px` value outside the token source of truth (`lib/config/tokens.ts`).
 *
 * All sizing — padding, margin, gap, width/height, fontSize, borderRadius —
 * must come from `tokens.ts` (`spacing.*`, `typography.fontSize.*`,
 * `borderRadius.*`). This is the px counterpart to check-no-raw-colors.mjs.
 *
 * Deliberately NOT flagged (these are not design-scale values):
 *   - border/outline widths in shorthand, e.g. `1px solid`, `2px solid`
 *   - blur radii, e.g. `blur(4px)` / `blur(8px)`
 * Everything else containing `<number>px` is a violation.
 *
 * Note: em-based letterSpacing and unitless opacity/lineHeight are out of
 * scope here (this rule targets px, mirroring the hex/rgba color rule).
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const SRC_DIR = fileURLToPath(new URL("../src", import.meta.url));
const ROOT = fileURLToPath(new URL("..", import.meta.url));

// The one file allowed to declare raw px values (the token definitions).
const ALLOWLIST = new Set(["src/lib/config/tokens.ts"]);

// Strip the two allowed px contexts before checking for stragglers.
const BORDER_WIDTH = /\b\d+(?:\.\d+)?px\s+(?:solid|dashed|dotted|double|groove|ridge|inset|outset)\b/g;
const BLUR = /blur\(\s*\d+(?:\.\d+)?px\s*\)/g;
const RAW_PX = /\b\d+(?:\.\d+)?px\b/;

/** @param {string} dir */
function walk(dir) {
  /** @type {string[]} */
  const files = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      files.push(...walk(full));
    } else if (/\.tsx?$/.test(entry)) {
      files.push(full);
    }
  }
  return files;
}

const violations = [];
for (const file of walk(SRC_DIR)) {
  const rel = relative(ROOT, file).split("\\").join("/");
  if (ALLOWLIST.has(rel)) continue;

  const lines = readFileSync(file, "utf8").split(/\r?\n/);
  lines.forEach((line, i) => {
    const stripped = line.replace(BORDER_WIDTH, "").replace(BLUR, "");
    if (RAW_PX.test(stripped)) {
      violations.push(`${rel}:${i + 1}: ${line.trim()}`);
    }
  });
}

if (violations.length > 0) {
  console.error(
    `\n✗ Found ${violations.length} raw px value(s). Use tokens from ` +
      `lib/config/tokens.ts (spacing.*, typography.fontSize.*, borderRadius.*):\n`,
  );
  for (const v of violations) console.error(`  ${v}`);
  console.error("");
  process.exit(1);
}

console.log("✓ No raw px values outside tokens.ts");
