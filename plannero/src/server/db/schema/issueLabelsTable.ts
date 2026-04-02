import { index, mysqlTable, primaryKey, varchar } from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm/relations";
import { issuesTable } from "./issuesTable";
import { labelsTable } from "./labelsTable";

export const issueLabelsTable = mysqlTable(
  "issue_label",
  {
    issueId: varchar("issue_id", { length: 36 })
      .notNull()
      .references(() => issuesTable.id, { onDelete: "cascade" }),
    labelId: varchar("label_id", { length: 36 })
      .notNull()
      .references(() => labelsTable.id, { onDelete: "cascade" }),
  },
  (table) => [
    primaryKey({
      columns: [table.issueId, table.labelId],
      name: "issue_label_issue_id_label_id",
    }),
    index("issue_label_labelId_idx").on(table.labelId),
  ],
);

export const issueLabelRelations = relations(issueLabelsTable, ({ one }) => ({
  issue: one(issuesTable, {
    fields: [issueLabelsTable.issueId],
    references: [issuesTable.id],
  }),
  label: one(labelsTable, {
    fields: [issueLabelsTable.labelId],
    references: [labelsTable.id],
  }),
}));
