import {
  index,
  mysqlTable,
  primaryKey,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm/relations";
import { issuesTable } from "./issuesTable";
import { usersTable } from "./usersTable";

export const issueAssigneesTable = mysqlTable(
  "issue_assignee",
  {
    issueId: varchar("issue_id", { length: 36 })
      .notNull()
      .references(() => issuesTable.id, { onDelete: "cascade" }),
    userId: varchar("user_id", { length: 36 })
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
    assignedAt: timestamp("assigned_at", { fsp: 3 }).defaultNow().notNull(),
  },
  (table) => [
    primaryKey({
      columns: [table.issueId, table.userId],
      name: "issue_assignee_issue_id_user_id",
    }),
    index("issue_assignee_userId_issueId_idx").on(table.userId, table.issueId),
  ],
);

export const issueAssigneeRelations = relations(
  issueAssigneesTable,
  ({ one }) => ({
    issue: one(issuesTable, {
      fields: [issueAssigneesTable.issueId],
      references: [issuesTable.id],
    }),
    user: one(usersTable, {
      fields: [issueAssigneesTable.userId],
      references: [usersTable.id],
    }),
  }),
);
