import "dotenv/config";
import { defineConfig } from "drizzle-kit";
import { env } from "./env/server";

export default defineConfig({
  out: "./drizzle",
  schema: "./server/db/schema.ts",
  dialect: "mysql",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
});
