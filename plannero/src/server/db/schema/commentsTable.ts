import {
  datetime,
  index,
  mysqlTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm/relations";
import { issuesTable } from "./issuesTable";
import { usersTable } from "./usersTable";

export const commentsTable = mysqlTable(
  "comment",
  {
    id: varchar("id", { length: 36 }).primaryKey(),
    issueId: varchar("issue_id", { length: 36 })
      .notNull()
      .references(() => issuesTable.id, { onDelete: "cascade" }),
    authorId: varchar("author_id", { length: 36 })
      .notNull()
      .references(() => usersTable.id, { onDelete: "restrict" }),
    body: text("body").notNull(),
    createdAt: timestamp("created_at", { fsp: 3 }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { fsp: 3 })
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
    deletedAt: datetime("deleted_at", { fsp: 3 }),
  },
  (table) => [
    index("comment_issueId_createdAt_idx").on(table.issueId, table.createdAt),
    index("comment_authorId_idx").on(table.authorId),
  ],
);

export const commentRelations = relations(commentsTable, ({ one }) => ({
  issue: one(issuesTable, {
    fields: [commentsTable.issueId],
    references: [issuesTable.id],
  }),
  author: one(usersTable, {
    fields: [commentsTable.authorId],
    references: [usersTable.id],
  }),
}));
