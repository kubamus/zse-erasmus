import {
  datetime,
  decimal,
  index,
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm/relations";
import { boardsTable } from "./boardsTable";
import { boardColumnsTable } from "./boardColumnsTable";
import { activityEventsTable } from "./activityEventsTable";
import { commentsTable } from "./commentsTable";
import { issueAssigneesTable } from "./issueAssigneesTable";
import { issueLabelsTable } from "./issueLabelsTable";
import { projectsTable } from "./projectsTable";
import { usersTable } from "./usersTable";

const issueTypeValues = ["task", "bug", "story", "chore"] as const;
const issuePriorityValues = ["low", "medium", "high", "critical"] as const;

export const issuesTable = mysqlTable(
  "issue",
  {
    id: varchar("id", { length: 36 }).primaryKey(),
    projectId: varchar("project_id", { length: 36 })
      .notNull()
      .references(() => projectsTable.id, { onDelete: "cascade" }),
    boardId: varchar("board_id", { length: 36 })
      .notNull()
      .references(() => boardsTable.id, { onDelete: "cascade" }),
    columnId: varchar("column_id", { length: 36 })
      .notNull()
      .references(() => boardColumnsTable.id, { onDelete: "restrict" }),
    issueNumber: int("issue_number").notNull(),
    title: varchar("title", { length: 200 }).notNull(),
    description: text("description"),
    type: mysqlEnum("type", issueTypeValues).notNull(),
    priority: mysqlEnum("priority", issuePriorityValues).notNull(),
    reporterId: varchar("reporter_id", { length: 36 })
      .notNull()
      .references(() => usersTable.id, { onDelete: "restrict" }),
    dueDate: datetime("due_date", { fsp: 3 }),
    estimatePoints: decimal("estimate_points", { precision: 10, scale: 2 }),
    position: decimal("position", { precision: 20, scale: 6 }).notNull(),
    createdAt: timestamp("created_at", { fsp: 3 }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { fsp: 3 })
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
    deletedAt: datetime("deleted_at", { fsp: 3 }),
  },
  (table) => [
    uniqueIndex("issue_projectId_issueNumber_unique").on(
      table.projectId,
      table.issueNumber,
    ),
    index("issue_columnId_position_idx").on(table.columnId, table.position),
    index("issue_reporterId_idx").on(table.reporterId),
    index("issue_dueDate_idx").on(table.dueDate),
    index("issue_projectId_idx").on(table.projectId),
  ],
);

export const issueRelations = relations(issuesTable, ({ one, many }) => ({
  project: one(projectsTable, {
    fields: [issuesTable.projectId],
    references: [projectsTable.id],
  }),
  board: one(boardsTable, {
    fields: [issuesTable.boardId],
    references: [boardsTable.id],
  }),
  column: one(boardColumnsTable, {
    fields: [issuesTable.columnId],
    references: [boardColumnsTable.id],
  }),
  reporter: one(usersTable, {
    fields: [issuesTable.reporterId],
    references: [usersTable.id],
  }),
  assignees: many(issueAssigneesTable),
  labels: many(issueLabelsTable),
  comments: many(commentsTable),
  activityEvents: many(activityEventsTable),
}));
