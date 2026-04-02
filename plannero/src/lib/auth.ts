import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../server/db";
import { env } from "@/env/client";
import {
  accountsTable,
  sessionsTable,
  usersTable,
  verificationTable,
} from "@/server/db/schema";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "mysql",
    schema: {
      user: usersTable,
      verification: verificationTable,
      account: accountsTable,
      session: sessionsTable,
    },
  }),
  baseURL: env.NEXT_PUBLIC_BASE_URL,
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
});
