import { defineConfig } from "drizzle-kit";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL, ensure the database is provisioned");
}

export default defineConfig({
  // Forward-slash relative path (resolved from this config's dir). A
  // path.join(__dirname, …) here yields backslashes on Windows, which break
  // drizzle-kit's internal glob and produce "No schema files found".
  schema: "./src/schema/index.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
});
