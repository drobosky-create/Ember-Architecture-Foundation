#!/usr/bin/env node
/**
 * Token-drift guard: fails if any source file outside the token source of
 * truth (`lib/config/tokens.ts`) contains a raw color literal — a hex color
 * (#abc, #aabbcc, #aabbccdd) or an rgb()/rgba()/hsl()/hsla() function.
 *
 * All colors must come from `tokens.ts` (use the `colors.*` tokens or the
 * `alpha()` helper). This keeps the theme single-sourced and prevents the
 * palette from silently drifting wider, which is exactly what the
 * 2026-06-29 audit found.
 *
 * Raw px sizing is enforced separately by check-no-raw-px.mjs; run both via
 * `pnpm run lint:tokens`.
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const SRC_DIR = fileURLToPath(new URL("../src", import.meta.url));
const ROOT = fileURLToPath(new URL("..", import.meta.url));

// The one file allowed to declare raw color values.
const ALLOWLIST = new Set(["src/lib/config/tokens.ts"]);

const HEX = /#[0-9A-Fa-f]{3,8}\b/;
const FUNC = /\b(?:rgba?|hsla?)\s*\(/;

/** @param {string} dir */
function walk(dir) {
  /** @type {string[]} */
  const files = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      files.push(...walk(full));
    } else if (/\.(tsx?|css)$/.test(entry)) {
      files.push(full);
    }
  }
  return files;
}

const violations = [];
for (const file of walk(SRC_DIR)) {
  const rel = relative(ROOT, file).split("\\").join("/");
  if (ALLOWLIST.has(rel)) continue;
  // index.css holds the two documented bootstrap colors by necessity (CSS
  // cannot import the TS token module); allow it.
  if (rel === "src/index.css") continue;

  const lines = readFileSync(file, "utf8").split(/\r?\n/);
  lines.forEach((line, i) => {
    if (HEX.test(line) || FUNC.test(line)) {
      violations.push(`${rel}:${i + 1}: ${line.trim()}`);
    }
  });
}

if (violations.length > 0) {
  console.error(
    `\n✗ Found ${violations.length} raw color literal(s). Use tokens from ` +
      `lib/config/tokens.ts (colors.* or alpha()):\n`,
  );
  for (const v of violations) console.error(`  ${v}`);
  console.error("");
  process.exit(1);
}

console.log("✓ No raw color literals outside tokens.ts");
