import { and, eq } from "drizzle-orm";
import { randomUUID } from "node:crypto";
import { badRequest, notFound } from "@/server/api/errors";
import { requireProjectAccess, requireWorkspaceAccess, ensureWorkspaceWrite } from "@/server/access/workspaceAccess";
import { db } from "@/server/db";
import { projectsTable } from "@/server/db/schema";

export async function listProjects(workspaceId: string, userId: string) {
  await requireWorkspaceAccess(workspaceId, userId);

  return db
    .select({
      id: projectsTable.id,
      workspaceId: projectsTable.workspaceId,
      key: projectsTable.key,
      name: projectsTable.name,
      description: projectsTable.description,
      isArchived: projectsTable.isArchived,
      createdAt: projectsTable.createdAt,
      updatedAt: projectsTable.updatedAt,
    })
    .from(projectsTable)
    .where(
      and(
        eq(projectsTable.workspaceId, workspaceId),
        eq(projectsTable.isArchived, false),
      ),
    );
}

export async function createProject(
  workspaceId: string,
  userId: string,
  input: { key: string; name: string; description?: string },
) {
  const access = await requireWorkspaceAccess(workspaceId, userId);
  ensureWorkspaceWrite(access.role);

  const [existing] = await db
    .select({ id: projectsTable.id })
    .from(projectsTable)
    .where(
      and(
        eq(projectsTable.workspaceId, workspaceId),
        eq(projectsTable.key, input.key),
      ),
    )
    .limit(1);

  if (existing) {
    throw badRequest("Project key already exists");
  }

  const id = randomUUID();
  const now = new Date();

  await db.insert(projectsTable).values({
    id,
    workspaceId,
    key: input.key,
    name: input.name,
    description: input.description ?? null,
    isArchived: false,
    createdAt: now,
    updatedAt: now,
  });

  const [project] = await db
    .select()
    .from(projectsTable)
    .where(eq(projectsTable.id, id))
    .limit(1);

  if (!project) {
    throw notFound();
  }

  return project;
}

export async function getProject(projectId: string, userId: string) {
  const { projectId: accessibleProjectId } = await requireProjectAccess(projectId, userId);
  const [project] = await db
    .select()
    .from(projectsTable)
    .where(and(eq(projectsTable.id, accessibleProjectId), eq(projectsTable.isArchived, false)))
    .limit(1);

  if (!project) {
    throw notFound();
  }

  return project;
}

export async function updateProject(
  projectId: string,
  userId: string,
  input: { name?: string; description?: string; isArchived?: boolean },
) {
  const access = await requireProjectAccess(projectId, userId);
  ensureWorkspaceWrite(access.role);

  await db
    .update(projectsTable)
    .set({
      ...(input.name !== undefined ? { name: input.name } : {}),
      ...(input.description !== undefined ? { description: input.description } : {}),
      ...(input.isArchived !== undefined ? { isArchived: input.isArchived } : {}),
    })
    .where(eq(projectsTable.id, projectId));

  const [project] = await db
    .select()
    .from(projectsTable)
    .where(eq(projectsTable.id, projectId))
    .limit(1);

  if (!project || project.isArchived) {
    throw notFound();
  }

  return project;
}

export async function archiveProject(projectId: string, userId: string) {
  const access = await requireProjectAccess(projectId, userId);
  ensureWorkspaceWrite(access.role);

  await db
    .update(projectsTable)
    .set({ isArchived: true })
    .where(eq(projectsTable.id, projectId));
}
