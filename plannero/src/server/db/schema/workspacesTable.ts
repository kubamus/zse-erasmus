import { mysqlTable, timestamp, varchar } from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm/relations";
import { projectsTable } from "./projectsTable";
import { workspaceMembersTable } from "./workspaceMembersTable";

export const workspacesTable = mysqlTable("workspace", {
  id: varchar("id", { length: 36 }).primaryKey(),
  name: varchar("name", { length: 80 }).notNull(),
  slug: varchar("slug", { length: 120 }).notNull().unique(),
  createdAt: timestamp("created_at", { fsp: 3 }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { fsp: 3 })
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const workspaceRelations = relations(workspacesTable, ({ many }) => ({
  projects: many(projectsTable),
  members: many(workspaceMembersTable),
}));
