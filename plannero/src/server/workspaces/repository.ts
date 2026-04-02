import { and, count, eq } from "drizzle-orm";
import { db } from "@/server/db";
import { usersTable, workspaceMembersTable, workspacesTable } from "@/server/db/schema";

export async function listVisibleWorkspacesForUser(userId: string) {
  return db
    .select({
      id: workspacesTable.id,
      name: workspacesTable.name,
      slug: workspacesTable.slug,
      createdAt: workspacesTable.createdAt,
      updatedAt: workspacesTable.updatedAt,
    })
    .from(workspaceMembersTable)
    .innerJoin(
      workspacesTable,
      eq(workspaceMembersTable.workspaceId, workspacesTable.id),
    )
    .where(
      and(
        eq(workspaceMembersTable.userId, userId),
        eq(workspacesTable.isArchived, false),
      ),
    );
}

export async function findActiveWorkspaceById(workspaceId: string) {
  const [workspace] = await db
    .select()
    .from(workspacesTable)
    .where(
      and(eq(workspacesTable.id, workspaceId), eq(workspacesTable.isArchived, false)),
    )
    .limit(1);

  return workspace ?? null;
}

export async function findMembership(workspaceId: string, userId: string) {
  const [membership] = await db
    .select()
    .from(workspaceMembersTable)
    .where(
      and(
        eq(workspaceMembersTable.workspaceId, workspaceId),
        eq(workspaceMembersTable.userId, userId),
      ),
    )
    .limit(1);

  return membership ?? null;
}

export async function listWorkspaceMembers(workspaceId: string) {
  return db
    .select({
      workspaceId: workspaceMembersTable.workspaceId,
      role: workspaceMembersTable.role,
      joinedAt: workspaceMembersTable.joinedAt,
      userId: usersTable.id,
      userName: usersTable.name,
      userEmail: usersTable.email,
      userImage: usersTable.image,
    })
    .from(workspaceMembersTable)
    .innerJoin(usersTable, eq(workspaceMembersTable.userId, usersTable.id))
    .where(eq(workspaceMembersTable.workspaceId, workspaceId));
}

export async function findWorkspaceMemberWithUser(workspaceId: string, userId: string) {
  const [member] = await db
    .select({
      workspaceId: workspaceMembersTable.workspaceId,
      role: workspaceMembersTable.role,
      joinedAt: workspaceMembersTable.joinedAt,
      userId: usersTable.id,
      userName: usersTable.name,
      userEmail: usersTable.email,
      userImage: usersTable.image,
    })
    .from(workspaceMembersTable)
    .innerJoin(usersTable, eq(workspaceMembersTable.userId, usersTable.id))
    .where(
      and(
        eq(workspaceMembersTable.workspaceId, workspaceId),
        eq(workspaceMembersTable.userId, userId),
      ),
    )
    .limit(1);

  return member ?? null;
}

export async function userExists(userId: string) {
  const [user] = await db
    .select({ id: usersTable.id })
    .from(usersTable)
    .where(eq(usersTable.id, userId))
    .limit(1);

  return Boolean(user);
}

export async function countWorkspaceOwners(workspaceId: string) {
  const [result] = await db
    .select({ value: count() })
    .from(workspaceMembersTable)
    .where(
      and(
        eq(workspaceMembersTable.workspaceId, workspaceId),
        eq(workspaceMembersTable.role, "owner"),
      ),
    );

  return Number(result?.value ?? 0);
}
