import { and, count, eq, isNull } from "drizzle-orm";
import { randomUUID } from "node:crypto";
import {
  ensureWorkspaceWrite,
  requireBoardAccess,
} from "@/server/access/workspaceAccess";
import { badRequest, notFound } from "@/server/api/errors";
import { db } from "@/server/db";
import { boardColumnsTable, issuesTable } from "@/server/db/schema";

export async function listBoardColumns(boardId: string, userId: string) {
  await requireBoardAccess(boardId, userId);

  return db
    .select()
    .from(boardColumnsTable)
    .where(eq(boardColumnsTable.boardId, boardId));
}

export async function createBoardColumn(
  boardId: string,
  userId: string,
  input: {
    name: string;
    position: number;
    wipLimit?: number | null;
    isDoneColumn?: boolean;
  },
) {
  const access = await requireBoardAccess(boardId, userId);
  ensureWorkspaceWrite(access.role);

  if (input.isDoneColumn) {
    const [done] = await db
      .select({ id: boardColumnsTable.id })
      .from(boardColumnsTable)
      .where(
        and(
          eq(boardColumnsTable.boardId, boardId),
          eq(boardColumnsTable.isDoneColumn, true),
        ),
      )
      .limit(1);

    if (done) {
      throw badRequest("Board already has a done column");
    }
  }

  const id = randomUUID();
  const now = new Date();

  await db.insert(boardColumnsTable).values({
    id,
    boardId,
    name: input.name,
    position: String(input.position),
    wipLimit: input.wipLimit ?? null,
    isDoneColumn: input.isDoneColumn ?? false,
    createdAt: now,
    updatedAt: now,
  });

  const [column] = await db
    .select()
    .from(boardColumnsTable)
    .where(eq(boardColumnsTable.id, id))
    .limit(1);

  if (!column) {
    throw notFound();
  }

  return column;
}

export async function updateBoardColumn(
  columnId: string,
  userId: string,
  input: {
    name?: string;
    position?: number;
    wipLimit?: number | null;
    isDoneColumn?: boolean;
  },
) {
  const [column] = await db
    .select({ id: boardColumnsTable.id, boardId: boardColumnsTable.boardId })
    .from(boardColumnsTable)
    .where(eq(boardColumnsTable.id, columnId))
    .limit(1);

  if (!column) {
    throw notFound();
  }

  const access = await requireBoardAccess(column.boardId, userId);
  ensureWorkspaceWrite(access.role);

  if (input.isDoneColumn) {
    const [done] = await db
      .select({ id: boardColumnsTable.id })
      .from(boardColumnsTable)
      .where(
        and(
          eq(boardColumnsTable.boardId, column.boardId),
          eq(boardColumnsTable.isDoneColumn, true),
        ),
      )
      .limit(1);

    if (done && done.id !== columnId) {
      throw badRequest("Board already has a done column");
    }
  }

  await db
    .update(boardColumnsTable)
    .set({
      ...(input.name !== undefined ? { name: input.name } : {}),
      ...(input.position !== undefined ? { position: String(input.position) } : {}),
      ...(input.wipLimit !== undefined ? { wipLimit: input.wipLimit } : {}),
      ...(input.isDoneColumn !== undefined ? { isDoneColumn: input.isDoneColumn } : {}),
    })
    .where(eq(boardColumnsTable.id, columnId));

  const [updated] = await db
    .select()
    .from(boardColumnsTable)
    .where(eq(boardColumnsTable.id, columnId))
    .limit(1);

  if (!updated) {
    throw notFound();
  }

  return updated;
}

export async function deleteBoardColumn(columnId: string, userId: string) {
  const [column] = await db
    .select({ id: boardColumnsTable.id, boardId: boardColumnsTable.boardId })
    .from(boardColumnsTable)
    .where(eq(boardColumnsTable.id, columnId))
    .limit(1);

  if (!column) {
    throw notFound();
  }

  const access = await requireBoardAccess(column.boardId, userId);
  ensureWorkspaceWrite(access.role);

  const [issueCount] = await db
    .select({ value: count() })
    .from(issuesTable)
    .where(and(eq(issuesTable.columnId, columnId), isNull(issuesTable.deletedAt)));

  if (Number(issueCount?.value ?? 0) > 0) {
    throw badRequest("Cannot delete a non-empty column");
  }

  await db.delete(boardColumnsTable).where(eq(boardColumnsTable.id, columnId));
}
