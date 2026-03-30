import { and, eq } from "drizzle-orm";
import { randomUUID } from "node:crypto";
import {
  ensureWorkspaceWrite,
  requireBoardAccess,
  requireProjectAccess,
} from "@/server/access/workspaceAccess";
import { notFound } from "@/server/api/errors";
import { db } from "@/server/db";
import { boardsTable } from "@/server/db/schema";

export async function listBoards(projectId: string, userId: string) {
  await requireProjectAccess(projectId, userId);

  return db
    .select()
    .from(boardsTable)
    .where(and(eq(boardsTable.projectId, projectId), eq(boardsTable.isArchived, false)));
}

export async function createBoard(
  projectId: string,
  userId: string,
  input: { name: string; type: "kanban" | "scrum" },
) {
  const access = await requireProjectAccess(projectId, userId);
  ensureWorkspaceWrite(access.role);

  const now = new Date();
  const id = randomUUID();

  await db.insert(boardsTable).values({
    id,
    projectId,
    name: input.name,
    type: input.type,
    isArchived: false,
    archivedAt: null,
    createdAt: now,
    updatedAt: now,
  });

  const [board] = await db
    .select()
    .from(boardsTable)
    .where(eq(boardsTable.id, id))
    .limit(1);

  if (!board) {
    throw notFound();
  }

  return board;
}

export async function getBoard(boardId: string, userId: string) {
  const access = await requireBoardAccess(boardId, userId);
  const [board] = await db
    .select()
    .from(boardsTable)
    .where(and(eq(boardsTable.id, access.boardId), eq(boardsTable.isArchived, false)))
    .limit(1);

  if (!board) {
    throw notFound();
  }

  return board;
}

export async function updateBoard(
  boardId: string,
  userId: string,
  input: { name?: string; type?: "kanban" | "scrum" },
) {
  const access = await requireBoardAccess(boardId, userId);
  ensureWorkspaceWrite(access.role);

  await db
    .update(boardsTable)
    .set({
      ...(input.name !== undefined ? { name: input.name } : {}),
      ...(input.type !== undefined ? { type: input.type } : {}),
    })
    .where(eq(boardsTable.id, boardId));

  const [board] = await db
    .select()
    .from(boardsTable)
    .where(and(eq(boardsTable.id, boardId), eq(boardsTable.isArchived, false)))
    .limit(1);

  if (!board) {
    throw notFound();
  }

  return board;
}

export async function archiveBoard(boardId: string, userId: string) {
  const access = await requireBoardAccess(boardId, userId);
  ensureWorkspaceWrite(access.role);

  await db
    .update(boardsTable)
    .set({
      isArchived: true,
      archivedAt: new Date(),
    })
    .where(eq(boardsTable.id, boardId));
}
