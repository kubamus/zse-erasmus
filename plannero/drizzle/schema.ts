import { mysqlTable, mysqlSchema, AnyMySqlColumn, index, foreignKey, primaryKey, varchar, text, json, mysqlEnum, decimal, int, unique } from "drizzle-orm/mysql-core"
import { sql } from "drizzle-orm"

export const account = mysqlTable("account", {
	id: varchar({ length: 36 }).notNull(),
	accountId: text("account_id").notNull(),
	providerId: text("provider_id").notNull(),
	userId: varchar("user_id", { length: 36 }).notNull().references(() => user.id, { onDelete: "cascade" } ),
	accessToken: text("access_token"),
	refreshToken: text("refresh_token"),
	idToken: text("id_token"),
	accessTokenExpiresAt: timestamp("access_token_expires_at", { fsp: 3, mode: 'string' }),
	refreshTokenExpiresAt: timestamp("refresh_token_expires_at", { fsp: 3, mode: 'string' }),
	scope: text(),
	password: text(),
	createdAt: timestamp("created_at", { fsp: 3, mode: 'string' }).default(sql`(now())`).notNull(),
	updatedAt: timestamp("updated_at", { fsp: 3, mode: 'string' }).notNull(),
},
(table) => [
	index("account_userId_idx").on(table.userId),
	primaryKey({ columns: [table.id], name: "account_id"}),
]);

export const activityEvent = mysqlTable("activity_event", {
	id: varchar({ length: 36 }).notNull(),
	issueId: varchar("issue_id", { length: 36 }).notNull().references(() => issue.id, { onDelete: "cascade" } ),
	actorId: varchar("actor_id", { length: 36 }).notNull().references(() => user.id, { onDelete: "restrict" } ),
	eventType: text("event_type").notNull(),
	oldValue: json("old_value"),
	newValue: json("new_value"),
	createdAt: timestamp("created_at", { fsp: 3, mode: 'string' }).default(sql`(now())`).notNull(),
},
(table) => [
	index("activity_event_issueId_createdAt_idx").on(table.issueId, table.createdAt),
	index("activity_event_actorId_idx").on(table.actorId),
	primaryKey({ columns: [table.id], name: "activity_event_id"}),
]);

export const board = mysqlTable("board", {
	id: varchar({ length: 36 }).notNull(),
	projectId: varchar("project_id", { length: 36 }).notNull().references(() => project.id, { onDelete: "cascade" } ),
	name: varchar({ length: 120 }).notNull(),
	type: mysqlEnum(['kanban','scrum']).notNull(),
	createdAt: timestamp("created_at", { fsp: 3, mode: 'string' }).default(sql`(now())`).notNull(),
	updatedAt: timestamp("updated_at", { fsp: 3, mode: 'string' }).default(sql`(now())`).notNull(),
},
(table) => [
	index("board_projectId_idx").on(table.projectId),
	primaryKey({ columns: [table.id], name: "board_id"}),
]);

export const boardColumn = mysqlTable("board_column", {
	id: varchar({ length: 36 }).notNull(),
	boardId: varchar("board_id", { length: 36 }).notNull().references(() => board.id, { onDelete: "cascade" } ),
	name: varchar({ length: 60 }).notNull(),
	position: decimal({ precision: 20, scale: 6 }).notNull(),
	wipLimit: int("wip_limit"),
	isDoneColumn: tinyint("is_done_column").default(0).notNull(),
	createdAt: timestamp("created_at", { fsp: 3, mode: 'string' }).default(sql`(now())`).notNull(),
	updatedAt: timestamp("updated_at", { fsp: 3, mode: 'string' }).default(sql`(now())`).notNull(),
},
(table) => [
	index("board_column_boardId_position_idx").on(table.boardId, table.position),
	primaryKey({ columns: [table.id], name: "board_column_id"}),
]);

export const comment = mysqlTable("comment", {
	id: varchar({ length: 36 }).notNull(),
	issueId: varchar("issue_id", { length: 36 }).notNull().references(() => issue.id, { onDelete: "cascade" } ),
	authorId: varchar("author_id", { length: 36 }).notNull().references(() => user.id, { onDelete: "restrict" } ),
	body: text().notNull(),
	createdAt: timestamp("created_at", { fsp: 3, mode: 'string' }).default(sql`(now())`).notNull(),
	updatedAt: timestamp("updated_at", { fsp: 3, mode: 'string' }).default(sql`(now())`).notNull(),
	deletedAt: timestamp("deleted_at", { fsp: 3, mode: 'string' }),
},
(table) => [
	index("comment_issueId_createdAt_idx").on(table.issueId, table.createdAt),
	index("comment_authorId_idx").on(table.authorId),
	primaryKey({ columns: [table.id], name: "comment_id"}),
]);

export const issue = mysqlTable("issue", {
	id: varchar({ length: 36 }).notNull(),
	projectId: varchar("project_id", { length: 36 }).notNull().references(() => project.id, { onDelete: "cascade" } ),
	boardId: varchar("board_id", { length: 36 }).notNull().references(() => board.id, { onDelete: "cascade" } ),
	columnId: varchar("column_id", { length: 36 }).notNull().references(() => boardColumn.id, { onDelete: "restrict" } ),
	issueNumber: int("issue_number").notNull(),
	title: varchar({ length: 200 }).notNull(),
	description: text(),
	type: mysqlEnum(['task','bug','story','chore']).notNull(),
	priority: mysqlEnum(['low','medium','high','critical']).notNull(),
	reporterId: varchar("reporter_id", { length: 36 }).notNull().references(() => user.id, { onDelete: "restrict" } ),
	dueDate: timestamp("due_date", { fsp: 3, mode: 'string' }),
	estimatePoints: decimal("estimate_points", { precision: 10, scale: 2 }),
	position: decimal({ precision: 20, scale: 6 }).notNull(),
	createdAt: timestamp("created_at", { fsp: 3, mode: 'string' }).default(sql`(now())`).notNull(),
	updatedAt: timestamp("updated_at", { fsp: 3, mode: 'string' }).default(sql`(now())`).notNull(),
	deletedAt: timestamp("deleted_at", { fsp: 3, mode: 'string' }),
},
(table) => [
	index("issue_columnId_position_idx").on(table.columnId, table.position),
	index("issue_reporterId_idx").on(table.reporterId),
	index("issue_dueDate_idx").on(table.dueDate),
	index("issue_projectId_idx").on(table.projectId),
	primaryKey({ columns: [table.id], name: "issue_id"}),
	unique("issue_projectId_issueNumber_unique").on(table.projectId, table.issueNumber),
]);

export const issueAssignee = mysqlTable("issue_assignee", {
	issueId: varchar("issue_id", { length: 36 }).notNull().references(() => issue.id, { onDelete: "cascade" } ),
	userId: varchar("user_id", { length: 36 }).notNull().references(() => user.id, { onDelete: "cascade" } ),
	assignedAt: timestamp("assigned_at", { fsp: 3, mode: 'string' }).default(sql`(now())`).notNull(),
},
(table) => [
	index("issue_assignee_userId_issueId_idx").on(table.userId, table.issueId),
	primaryKey({ columns: [table.issueId, table.userId], name: "issue_assignee_issue_id_user_id"}),
]);

export const issueLabel = mysqlTable("issue_label", {
	issueId: varchar("issue_id", { length: 36 }).notNull().references(() => issue.id, { onDelete: "cascade" } ),
	labelId: varchar("label_id", { length: 36 }).notNull().references(() => label.id, { onDelete: "cascade" } ),
},
(table) => [
	index("issue_label_labelId_idx").on(table.labelId),
	primaryKey({ columns: [table.issueId, table.labelId], name: "issue_label_issue_id_label_id"}),
]);

export const label = mysqlTable("label", {
	id: varchar({ length: 36 }).notNull(),
	projectId: varchar("project_id", { length: 36 }).notNull().references(() => project.id, { onDelete: "cascade" } ),
	name: varchar({ length: 40 }).notNull(),
	color: varchar({ length: 7 }).notNull(),
	createdAt: timestamp("created_at", { fsp: 3, mode: 'string' }).default(sql`(now())`).notNull(),
	updatedAt: timestamp("updated_at", { fsp: 3, mode: 'string' }).default(sql`(now())`).notNull(),
},
(table) => [
	index("label_projectId_idx").on(table.projectId),
	primaryKey({ columns: [table.id], name: "label_id"}),
	unique("label_projectId_name_unique").on(table.projectId, table.name),
]);

export const project = mysqlTable("project", {
	id: varchar({ length: 36 }).notNull(),
	workspaceId: varchar("workspace_id", { length: 36 }).notNull().references(() => workspace.id, { onDelete: "cascade" } ),
	key: varchar({ length: 10 }).notNull(),
	name: varchar({ length: 120 }).notNull(),
	description: text(),
	isArchived: tinyint("is_archived").default(0).notNull(),
	createdAt: timestamp("created_at", { fsp: 3, mode: 'string' }).default(sql`(now())`).notNull(),
	updatedAt: timestamp("updated_at", { fsp: 3, mode: 'string' }).default(sql`(now())`).notNull(),
},
(table) => [
	index("project_workspaceId_idx").on(table.workspaceId),
	primaryKey({ columns: [table.id], name: "project_id"}),
	unique("project_workspaceId_key_unique").on(table.workspaceId, table.key),
]);

export const session = mysqlTable("session", {
	id: varchar({ length: 36 }).notNull(),
	expiresAt: timestamp("expires_at", { fsp: 3, mode: 'string' }).notNull(),
	token: varchar({ length: 255 }).notNull(),
	createdAt: timestamp("created_at", { fsp: 3, mode: 'string' }).default(sql`(now())`).notNull(),
	updatedAt: timestamp("updated_at", { fsp: 3, mode: 'string' }).notNull(),
	ipAddress: text("ip_address"),
	userAgent: text("user_agent"),
	userId: varchar("user_id", { length: 36 }).notNull().references(() => user.id, { onDelete: "cascade" } ),
},
(table) => [
	index("session_userId_idx").on(table.userId),
	primaryKey({ columns: [table.id], name: "session_id"}),
	unique("session_token_unique").on(table.token),
]);

export const user = mysqlTable("user", {
	id: varchar({ length: 36 }).notNull(),
	name: varchar({ length: 255 }).notNull(),
	email: varchar({ length: 255 }).notNull(),
	emailVerified: tinyint("email_verified").default(0).notNull(),
	image: text(),
	createdAt: timestamp("created_at", { fsp: 3, mode: 'string' }).default(sql`(now())`).notNull(),
	updatedAt: timestamp("updated_at", { fsp: 3, mode: 'string' }).default(sql`(now())`).notNull(),
},
(table) => [
	primaryKey({ columns: [table.id], name: "user_id"}),
	unique("user_email_unique").on(table.email),
]);

export const verification = mysqlTable("verification", {
	id: varchar({ length: 36 }).notNull(),
	identifier: varchar({ length: 255 }).notNull(),
	value: text().notNull(),
	expiresAt: timestamp("expires_at", { fsp: 3, mode: 'string' }).notNull(),
	createdAt: timestamp("created_at", { fsp: 3, mode: 'string' }).default(sql`(now())`).notNull(),
	updatedAt: timestamp("updated_at", { fsp: 3, mode: 'string' }).default(sql`(now())`).notNull(),
},
(table) => [
	index("verification_identifier_idx").on(table.identifier),
	primaryKey({ columns: [table.id], name: "verification_id"}),
]);

export const workspace = mysqlTable("workspace", {
	id: varchar({ length: 36 }).notNull(),
	name: varchar({ length: 80 }).notNull(),
	slug: varchar({ length: 120 }).notNull(),
	createdAt: timestamp("created_at", { fsp: 3, mode: 'string' }).default(sql`(now())`).notNull(),
	updatedAt: timestamp("updated_at", { fsp: 3, mode: 'string' }).default(sql`(now())`).notNull(),
},
(table) => [
	primaryKey({ columns: [table.id], name: "workspace_id"}),
	unique("workspace_slug_unique").on(table.slug),
]);

export const workspaceMember = mysqlTable("workspace_member", {
	workspaceId: varchar("workspace_id", { length: 36 }).notNull().references(() => workspace.id, { onDelete: "cascade" } ),
	userId: varchar("user_id", { length: 36 }).notNull().references(() => user.id, { onDelete: "cascade" } ),
	role: mysqlEnum(['owner','admin','member']).notNull(),
	joinedAt: timestamp("joined_at", { fsp: 3, mode: 'string' }).default(sql`(now())`).notNull(),
},
(table) => [
	index("workspace_member_userId_idx").on(table.userId),
	primaryKey({ columns: [table.workspaceId, table.userId], name: "workspace_member_workspace_id_user_id"}),
]);
