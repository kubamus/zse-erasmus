import {
  index,
  mysqlTable,
  primaryKey,
  timestamp,
  varchar,
  mysqlEnum,
} from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm/relations";
import { usersTable } from "./usersTable";
import { workspacesTable } from "./workspacesTable";

const workspaceRoleValues = ["owner", "admin", "member"] as const;

export const workspaceMembersTable = mysqlTable(
  "workspace_member",
  {
    workspaceId: varchar("workspace_id", { length: 36 })
      .notNull()
      .references(() => workspacesTable.id, { onDelete: "cascade" }),
    userId: varchar("user_id", { length: 36 })
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
    role: mysqlEnum("role", workspaceRoleValues).notNull(),
    joinedAt: timestamp("joined_at", { fsp: 3 }).defaultNow().notNull(),
  },
  (table) => [
    primaryKey({
      columns: [table.workspaceId, table.userId],
      name: "workspace_member_workspace_id_user_id",
    }),
    index("workspace_member_userId_idx").on(table.userId),
    index("workspace_member_workspaceId_role_idx").on(table.workspaceId, table.role),
  ],
);

export const workspaceMemberRelations = relations(
  workspaceMembersTable,
  ({ one }) => ({
    workspace: one(workspacesTable, {
      fields: [workspaceMembersTable.workspaceId],
      references: [workspacesTable.id],
    }),
    user: one(usersTable, {
      fields: [workspaceMembersTable.userId],
      references: [usersTable.id],
    }),
  }),
);
