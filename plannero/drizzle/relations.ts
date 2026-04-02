import { relations } from "drizzle-orm/relations";
import { user, account, activityEvent, issue, project, board, boardColumn, comment, issueAssignee, issueLabel, label, workspace, session, workspaceMember } from "./schema";

export const accountRelations = relations(account, ({one}) => ({
	user: one(user, {
		fields: [account.userId],
		references: [user.id]
	}),
}));

export const userRelations = relations(user, ({many}) => ({
	accounts: many(account),
	activityEvents: many(activityEvent),
	comments: many(comment),
	issues: many(issue),
	issueAssignees: many(issueAssignee),
	sessions: many(session),
	workspaceMembers: many(workspaceMember),
}));

export const activityEventRelations = relations(activityEvent, ({one}) => ({
	user: one(user, {
		fields: [activityEvent.actorId],
		references: [user.id]
	}),
	issue: one(issue, {
		fields: [activityEvent.issueId],
		references: [issue.id]
	}),
}));

export const issueRelations = relations(issue, ({one, many}) => ({
	activityEvents: many(activityEvent),
	comments: many(comment),
	board: one(board, {
		fields: [issue.boardId],
		references: [board.id]
	}),
	boardColumn: one(boardColumn, {
		fields: [issue.columnId],
		references: [boardColumn.id]
	}),
	project: one(project, {
		fields: [issue.projectId],
		references: [project.id]
	}),
	user: one(user, {
		fields: [issue.reporterId],
		references: [user.id]
	}),
	issueAssignees: many(issueAssignee),
	issueLabels: many(issueLabel),
}));

export const boardRelations = relations(board, ({one, many}) => ({
	project: one(project, {
		fields: [board.projectId],
		references: [project.id]
	}),
	boardColumns: many(boardColumn),
	issues: many(issue),
}));

export const projectRelations = relations(project, ({one, many}) => ({
	boards: many(board),
	issues: many(issue),
	labels: many(label),
	workspace: one(workspace, {
		fields: [project.workspaceId],
		references: [workspace.id]
	}),
}));

export const boardColumnRelations = relations(boardColumn, ({one, many}) => ({
	board: one(board, {
		fields: [boardColumn.boardId],
		references: [board.id]
	}),
	issues: many(issue),
}));

export const commentRelations = relations(comment, ({one}) => ({
	user: one(user, {
		fields: [comment.authorId],
		references: [user.id]
	}),
	issue: one(issue, {
		fields: [comment.issueId],
		references: [issue.id]
	}),
}));

export const issueAssigneeRelations = relations(issueAssignee, ({one}) => ({
	issue: one(issue, {
		fields: [issueAssignee.issueId],
		references: [issue.id]
	}),
	user: one(user, {
		fields: [issueAssignee.userId],
		references: [user.id]
	}),
}));

export const issueLabelRelations = relations(issueLabel, ({one}) => ({
	issue: one(issue, {
		fields: [issueLabel.issueId],
		references: [issue.id]
	}),
	label: one(label, {
		fields: [issueLabel.labelId],
		references: [label.id]
	}),
}));

export const labelRelations = relations(label, ({one, many}) => ({
	issueLabels: many(issueLabel),
	project: one(project, {
		fields: [label.projectId],
		references: [project.id]
	}),
}));

export const workspaceRelations = relations(workspace, ({many}) => ({
	projects: many(project),
	workspaceMembers: many(workspaceMember),
}));

export const sessionRelations = relations(session, ({one}) => ({
	user: one(user, {
		fields: [session.userId],
		references: [user.id]
	}),
}));

export const workspaceMemberRelations = relations(workspaceMember, ({one}) => ({
	user: one(user, {
		fields: [workspaceMember.userId],
		references: [user.id]
	}),
	workspace: one(workspace, {
		fields: [workspaceMember.workspaceId],
		references: [workspace.id]
	}),
}));