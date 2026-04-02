import { and, eq } from "drizzle-orm";
import { randomUUID } from "node:crypto";
import {
  ensureWorkspaceWrite,
  requireProjectAccess,
} from "@/server/access/workspaceAccess";
import { badRequest, notFound } from "@/server/api/errors";
import { db } from "@/server/db";
import { labelsTable, projectsTable } from "@/server/db/schema";

export async function listLabels(projectId: string, userId: string) {
  await requireProjectAccess(projectId, userId);

  return db.select().from(labelsTable).where(eq(labelsTable.projectId, projectId));
}

export async function createLabel(
  projectId: string,
  userId: string,
  input: { name: string; color: string },
) {
  const access = await requireProjectAccess(projectId, userId);
  ensureWorkspaceWrite(access.role);

  const [existing] = await db
    .select({ id: labelsTable.id })
    .from(labelsTable)
    .where(and(eq(labelsTable.projectId, projectId), eq(labelsTable.name, input.name)))
    .limit(1);

  if (existing) {
    throw badRequest("Label already exists");
  }

  const now = new Date();
  const id = randomUUID();

  await db.insert(labelsTable).values({
    id,
    projectId,
    name: input.name,
    color: input.color,
    createdAt: now,
    updatedAt: now,
  });

  const [label] = await db
    .select()
    .from(labelsTable)
    .where(eq(labelsTable.id, id))
    .limit(1);

  if (!label) {
    throw notFound();
  }

  return label;
}

export async function updateLabel(
  labelId: string,
  userId: string,
  input: { name?: string; color?: string },
) {
  const [label] = await db
    .select({
      id: labelsTable.id,
      projectId: labelsTable.projectId,
    })
    .from(labelsTable)
    .where(eq(labelsTable.id, labelId))
    .limit(1);

  if (!label) {
    throw notFound();
  }

  const access = await requireProjectAccess(label.projectId, userId);
  ensureWorkspaceWrite(access.role);

  await db
    .update(labelsTable)
    .set({
      ...(input.name !== undefined ? { name: input.name } : {}),
      ...(input.color !== undefined ? { color: input.color } : {}),
    })
    .where(eq(labelsTable.id, labelId));

  const [updated] = await db
    .select()
    .from(labelsTable)
    .where(eq(labelsTable.id, labelId))
    .limit(1);

  if (!updated) {
    throw notFound();
  }

  return updated;
}

export async function deleteLabel(labelId: string, userId: string) {
  const [label] = await db
    .select({
      id: labelsTable.id,
      projectId: labelsTable.projectId,
    })
    .from(labelsTable)
    .where(eq(labelsTable.id, labelId))
    .limit(1);

  if (!label) {
    throw notFound();
  }

  const access = await requireProjectAccess(label.projectId, userId);
  ensureWorkspaceWrite(access.role);

  await db.delete(labelsTable).where(eq(labelsTable.id, labelId));
}

export async function findLabelWithProject(labelId: string) {
  const [label] = await db
    .select({
      id: labelsTable.id,
      projectId: labelsTable.projectId,
      name: labelsTable.name,
      color: labelsTable.color,
      createdAt: labelsTable.createdAt,
      updatedAt: labelsTable.updatedAt,
      projectWorkspaceId: projectsTable.workspaceId,
    })
    .from(labelsTable)
    .innerJoin(projectsTable, eq(labelsTable.projectId, projectsTable.id))
    .where(eq(labelsTable.id, labelId))
    .limit(1);

  return label ?? null;
}
