import {
  boolean,
  index,
  mysqlEnum,
  mysqlTable,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm/relations";
import { boardColumnsTable } from "./boardColumnsTable";
import { issuesTable } from "./issuesTable";
import { projectsTable } from "./projectsTable";

const boardTypeValues = ["kanban", "scrum"] as const;

export const boardsTable = mysqlTable(
  "board",
  {
    id: varchar("id", { length: 36 }).primaryKey(),
    projectId: varchar("project_id", { length: 36 })
      .notNull()
      .references(() => projectsTable.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 120 }).notNull(),
    type: mysqlEnum("type", boardTypeValues).notNull(),
    isArchived: boolean("is_archived").default(false).notNull(),
    archivedAt: timestamp("archived_at", { fsp: 3 }),
    createdAt: timestamp("created_at", { fsp: 3 }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { fsp: 3 })
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("board_projectId_idx").on(table.projectId)],
);

export const boardRelations = relations(boardsTable, ({ one, many }) => ({
  project: one(projectsTable, {
    fields: [boardsTable.projectId],
    references: [projectsTable.id],
  }),
  columns: many(boardColumnsTable),
  issues: many(issuesTable),
}));
