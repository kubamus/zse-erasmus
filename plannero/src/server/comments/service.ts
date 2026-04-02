import { and, eq, isNull } from "drizzle-orm";
import { randomUUID } from "node:crypto";
import {
  requireCommentAccess,
  requireIssueAccess,
} from "@/server/access/workspaceAccess";
import { forbidden, notFound } from "@/server/api/errors";
import { db } from "@/server/db";
import {
  activityEventsTable,
  commentsTable,
  usersTable,
} from "@/server/db/schema";

async function appendCommentActivity(
  issueId: string,
  actorId: string,
  eventType: string,
  oldValue: Record<string, unknown> | null,
  newValue: Record<string, unknown> | null,
) {
  await db.insert(activityEventsTable).values({
    id: randomUUID(),
    issueId,
    actorId,
    eventType,
    oldValue,
    newValue,
    createdAt: new Date(),
  });
}

export async function listIssueComments(issueId: string, userId: string) {
  await requireIssueAccess(issueId, userId);

  return db
    .select({
      id: commentsTable.id,
      issueId: commentsTable.issueId,
      body: commentsTable.body,
      createdAt: commentsTable.createdAt,
      updatedAt: commentsTable.updatedAt,
      deletedAt: commentsTable.deletedAt,
      authorId: usersTable.id,
      authorName: usersTable.name,
      authorEmail: usersTable.email,
      authorImage: usersTable.image,
    })
    .from(commentsTable)
    .innerJoin(usersTable, eq(commentsTable.authorId, usersTable.id))
    .where(and(eq(commentsTable.issueId, issueId), isNull(commentsTable.deletedAt)));
}

export async function createComment(issueId: string, userId: string, input: { body: string }) {
  await requireIssueAccess(issueId, userId);
  const now = new Date();
  const id = randomUUID();

  await db.insert(commentsTable).values({
    id,
    issueId,
    authorId: userId,
    body: input.body,
    createdAt: now,
    updatedAt: now,
    deletedAt: null,
  });

  await appendCommentActivity(issueId, userId, "comment.created", null, { body: input.body });

  const [comment] = await db
    .select({
      id: commentsTable.id,
      issueId: commentsTable.issueId,
      body: commentsTable.body,
      createdAt: commentsTable.createdAt,
      updatedAt: commentsTable.updatedAt,
      deletedAt: commentsTable.deletedAt,
      authorId: usersTable.id,
      authorName: usersTable.name,
      authorEmail: usersTable.email,
      authorImage: usersTable.image,
    })
    .from(commentsTable)
    .innerJoin(usersTable, eq(commentsTable.authorId, usersTable.id))
    .where(eq(commentsTable.id, id))
    .limit(1);

  if (!comment) {
    throw notFound();
  }

  return comment;
}

export async function updateComment(commentId: string, userId: string, input: { body: string }) {
  const access = await requireCommentAccess(commentId, userId);

  if (access.authorId !== userId && access.role !== "owner" && access.role !== "admin") {
    throw forbidden();
  }

  await db
    .update(commentsTable)
    .set({ body: input.body })
    .where(eq(commentsTable.id, commentId));

  await appendCommentActivity(access.issueId, userId, "comment.updated", null, {
    commentId,
    body: input.body,
  });

  const [comment] = await db
    .select({
      id: commentsTable.id,
      issueId: commentsTable.issueId,
      body: commentsTable.body,
      createdAt: commentsTable.createdAt,
      updatedAt: commentsTable.updatedAt,
      deletedAt: commentsTable.deletedAt,
      authorId: usersTable.id,
      authorName: usersTable.name,
      authorEmail: usersTable.email,
      authorImage: usersTable.image,
    })
    .from(commentsTable)
    .innerJoin(usersTable, eq(commentsTable.authorId, usersTable.id))
    .where(eq(commentsTable.id, commentId))
    .limit(1);

  if (!comment) {
    throw notFound();
  }

  return comment;
}

export async function deleteComment(commentId: string, userId: string) {
  const access = await requireCommentAccess(commentId, userId);

  if (access.authorId !== userId && access.role !== "owner" && access.role !== "admin") {
    throw forbidden();
  }

  await db
    .update(commentsTable)
    .set({ deletedAt: new Date() })
    .where(eq(commentsTable.id, commentId));

  await appendCommentActivity(access.issueId, userId, "comment.deleted", { commentId }, null);
}
