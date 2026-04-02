import {
  boolean,
  index,
  mysqlTable,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm/relations";
import { boardsTable } from "./boardsTable";
import { issuesTable } from "./issuesTable";
import { labelsTable } from "./labelsTable";
import { workspacesTable } from "./workspacesTable";

export const projectsTable = mysqlTable(
  "project",
  {
    id: varchar("id", { length: 36 }).primaryKey(),
    workspaceId: varchar("workspace_id", { length: 36 })
      .notNull()
      .references(() => workspacesTable.id, { onDelete: "cascade" }),
    key: varchar("key", { length: 10 }).notNull(),
    name: varchar("name", { length: 120 }).notNull(),
    description: text("description"),
    isArchived: boolean("is_archived").default(false).notNull(),
    createdAt: timestamp("created_at", { fsp: 3 }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { fsp: 3 })
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    uniqueIndex("project_workspaceId_key_unique").on(table.workspaceId, table.key),
    index("project_workspaceId_idx").on(table.workspaceId),
  ],
);

export const projectRelations = relations(projectsTable, ({ one, many }) => ({
  workspace: one(workspacesTable, {
    fields: [projectsTable.workspaceId],
    references: [workspacesTable.id],
  }),
  boards: many(boardsTable),
  issues: many(issuesTable),
  labels: many(labelsTable),
}));
