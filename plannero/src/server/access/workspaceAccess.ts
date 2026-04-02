import { and, eq } from "drizzle-orm";
import { forbidden, notFound } from "@/server/api/errors";
import { db } from "@/server/db";
import {
  boardsTable,
  commentsTable,
  issuesTable,
  projectsTable,
  workspaceMembersTable,
  workspacesTable,
} from "@/server/db/schema";

export type WorkspaceRole = "owner" | "admin" | "member";

export function ensureWorkspaceWrite(role: WorkspaceRole) {
  if (role !== "owner" && role !== "admin" && role !== "member") {
    throw forbidden();
  }
}

export function ensureWorkspaceOwner(role: WorkspaceRole) {
  if (role !== "owner") {
    throw forbidden();
  }
}

export async function requireWorkspaceAccess(workspaceId: string, userId: string) {
  const [workspace] = await db
    .select({ id: workspacesTable.id })
    .from(workspacesTable)
    .where(
      and(eq(workspacesTable.id, workspaceId), eq(workspacesTable.isArchived, false)),
    )
    .limit(1);

  if (!workspace) {
    throw notFound();
  }

  const [membership] = await db
    .select({ role: workspaceMembersTable.role })
    .from(workspaceMembersTable)
    .where(
      and(
        eq(workspaceMembersTable.workspaceId, workspaceId),
        eq(workspaceMembersTable.userId, userId),
      ),
    )
    .limit(1);

  if (!membership) {
    throw forbidden();
  }

  return { workspaceId, role: membership.role as WorkspaceRole };
}

export async function requireProjectAccess(projectId: string, userId: string) {
  const [project] = await db
    .select({
      id: projectsTable.id,
      workspaceId: projectsTable.workspaceId,
      isArchived: projectsTable.isArchived,
    })
    .from(projectsTable)
    .where(eq(projectsTable.id, projectId))
    .limit(1);

  if (!project || project.isArchived) {
    throw notFound();
  }

  const access = await requireWorkspaceAccess(project.workspaceId, userId);

  return {
    projectId: project.id,
    workspaceId: project.workspaceId,
    role: access.role,
  };
}

export async function requireBoardAccess(boardId: string, userId: string) {
  const [board] = await db
    .select({
      id: boardsTable.id,
      projectId: boardsTable.projectId,
      isArchived: boardsTable.isArchived,
    })
    .from(boardsTable)
    .where(eq(boardsTable.id, boardId))
    .limit(1);

  if (!board || board.isArchived) {
    throw notFound();
  }

  const projectAccess = await requireProjectAccess(board.projectId, userId);

  return {
    boardId: board.id,
    projectId: board.projectId,
    workspaceId: projectAccess.workspaceId,
    role: projectAccess.role,
  };
}

export async function requireIssueAccess(issueId: string, userId: string) {
  const [issue] = await db
    .select({
      id: issuesTable.id,
      projectId: issuesTable.projectId,
      deletedAt: issuesTable.deletedAt,
    })
    .from(issuesTable)
    .where(eq(issuesTable.id, issueId))
    .limit(1);

  if (!issue || issue.deletedAt) {
    throw notFound();
  }

  const projectAccess = await requireProjectAccess(issue.projectId, userId);

  return {
    issueId: issue.id,
    projectId: issue.projectId,
    workspaceId: projectAccess.workspaceId,
    role: projectAccess.role,
  };
}

export async function requireCommentAccess(commentId: string, userId: string) {
  const [comment] = await db
    .select({
      id: commentsTable.id,
      issueId: commentsTable.issueId,
      authorId: commentsTable.authorId,
      deletedAt: commentsTable.deletedAt,
    })
    .from(commentsTable)
    .where(eq(commentsTable.id, commentId))
    .limit(1);

  if (!comment || comment.deletedAt) {
    throw notFound();
  }

  const issueAccess = await requireIssueAccess(comment.issueId, userId);

  return {
    commentId: comment.id,
    issueId: comment.issueId,
    authorId: comment.authorId,
    workspaceId: issueAccess.workspaceId,
    role: issueAccess.role,
  };
}
