import {
  index,
  mysqlTable,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm/relations";
import { issueLabelsTable } from "./issueLabelsTable";
import { projectsTable } from "./projectsTable";

export const labelsTable = mysqlTable(
  "label",
  {
    id: varchar("id", { length: 36 }).primaryKey(),
    projectId: varchar("project_id", { length: 36 })
      .notNull()
      .references(() => projectsTable.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 40 }).notNull(),
    color: varchar("color", { length: 7 }).notNull(),
    createdAt: timestamp("created_at", { fsp: 3 }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { fsp: 3 })
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    uniqueIndex("label_projectId_name_unique").on(table.projectId, table.name),
    index("label_projectId_idx").on(table.projectId),
  ],
);

export const labelRelations = relations(labelsTable, ({ one, many }) => ({
  project: one(projectsTable, {
    fields: [labelsTable.projectId],
    references: [projectsTable.id],
  }),
  issueLabels: many(issueLabelsTable),
}));
