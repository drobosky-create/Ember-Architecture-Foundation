import { config } from "dotenv";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

// Load the repo-root .env (DATABASE_URL, CLERK_*, PORT, …). This must be
// imported before ./app, since the DB client reads DATABASE_URL at import.
// The bundle runs at artifacts/api-server/dist/index.mjs, so the repo root is
// three levels up. dotenv does not override vars already set by the launcher.
const here = dirname(fileURLToPath(import.meta.url));
config({ path: resolve(here, "../../../.env") });
