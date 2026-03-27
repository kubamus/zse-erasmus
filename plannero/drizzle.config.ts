import "dotenv/config";
import { defineConfig } from "drizzle-kit";
import { env } from "./src/env/server";

export default defineConfig({
  out: "./drizzle",
  schema: "./src/server/db/schema.ts",
  dialect: "mysql",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
});
