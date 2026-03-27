import {
  index,
  json,
  mysqlTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm/relations";
import { issuesTable } from "./issuesTable";
import { usersTable } from "./usersTable";

export const activityEventsTable = mysqlTable(
  "activity_event",
  {
    id: varchar("id", { length: 36 }).primaryKey(),
    issueId: varchar("issue_id", { length: 36 })
      .notNull()
      .references(() => issuesTable.id, { onDelete: "cascade" }),
    actorId: varchar("actor_id", { length: 36 })
      .notNull()
      .references(() => usersTable.id, { onDelete: "restrict" }),
    eventType: text("event_type").notNull(),
    oldValue: json("old_value"),
    newValue: json("new_value"),
    createdAt: timestamp("created_at", { fsp: 3 }).defaultNow().notNull(),
  },
  (table) => [
    index("activity_event_issueId_createdAt_idx").on(table.issueId, table.createdAt),
    index("activity_event_actorId_idx").on(table.actorId),
  ],
);

export const activityEventRelations = relations(activityEventsTable, ({ one }) => ({
  issue: one(issuesTable, {
    fields: [activityEventsTable.issueId],
    references: [issuesTable.id],
  }),
  actor: one(usersTable, {
    fields: [activityEventsTable.actorId],
    references: [usersTable.id],
  }),
}));
