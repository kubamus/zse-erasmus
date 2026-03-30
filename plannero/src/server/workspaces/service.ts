import { and, eq } from "drizzle-orm";
import { randomUUID } from "node:crypto";
import { badRequest, forbidden, notFound } from "@/server/api/errors";
import { db } from "@/server/db";
import { workspaceMembersTable, workspacesTable } from "@/server/db/schema";
import { toWorkspaceDto, toWorkspaceMemberDto } from "./mappers";
import {
  countWorkspaceOwners,
  findActiveWorkspaceById,
  findMembership,
  findWorkspaceMemberWithUser,
  listVisibleWorkspacesForUser,
  listWorkspaceMembers,
  userExists,
} from "./repository";
import {
  ensureCanArchiveWorkspace,
  ensureCanAssignRole,
  ensureCanChangeTargetRole,
  ensureCanManageMembers,
  ensureCanRemoveTarget,
  ensureCanUpdateWorkspace,
} from "./policy";
import type { WorkspaceRole } from "./types";
import { createUniqueWorkspaceSlug } from "./slug";

type ActorContext = {
  actorRole: WorkspaceRole;
};

async function loadActorContext(workspaceId: string, actorUserId: string): Promise<ActorContext> {
  const workspace = await findActiveWorkspaceById(workspaceId);

  if (!workspace) {
    throw notFound("Resource not found");
  }

  const membership = await findMembership(workspaceId, actorUserId);

  if (!membership) {
    throw forbidden();
  }

  return {
    actorRole: membership.role,
  };
}

export async function listWorkspacesForUser(userId: string) {
  const items = await listVisibleWorkspacesForUser(userId);

  return items.map(toWorkspaceDto);
}

export async function createWorkspaceForUser(userId: string, input: { name: string }) {
  return db.transaction(async (tx) => {
    const id = randomUUID();
    const slug = await createUniqueWorkspaceSlug(input.name);
    const now = new Date();

    await tx.insert(workspacesTable).values({
      id,
      name: input.name,
      slug,
      isArchived: false,
      archivedAt: null,
      createdAt: now,
      updatedAt: now,
    });

    await tx.insert(workspaceMembersTable).values({
      workspaceId: id,
      userId,
      role: "owner",
      joinedAt: now,
    });

    const [workspace] = await tx
      .select()
      .from(workspacesTable)
      .where(eq(workspacesTable.id, id))
      .limit(1);

    if (!workspace) {
      throw notFound("Resource not found");
    }

    return toWorkspaceDto(workspace);
  });
}

export async function getWorkspaceForUser(workspaceId: string, actorUserId: string) {
  const workspace = await findActiveWorkspaceById(workspaceId);

  if (!workspace) {
    throw notFound("Resource not found");
  }

  const membership = await findMembership(workspaceId, actorUserId);

  if (!membership) {
    throw forbidden();
  }

  return toWorkspaceDto(workspace);
}

export async function updateWorkspaceForUser(
  workspaceId: string,
  actorUserId: string,
  input: { name?: string },
) {
  const { actorRole } = await loadActorContext(workspaceId, actorUserId);
  ensureCanUpdateWorkspace(actorRole);

  if (input.name) {
    await db
      .update(workspacesTable)
      .set({
        name: input.name,
      })
      .where(eq(workspacesTable.id, workspaceId));
  }

  const workspace = await findActiveWorkspaceById(workspaceId);

  if (!workspace) {
    throw notFound("Resource not found");
  }

  return toWorkspaceDto(workspace);
}

export async function archiveWorkspaceForUser(workspaceId: string, actorUserId: string) {
  const { actorRole } = await loadActorContext(workspaceId, actorUserId);
  ensureCanArchiveWorkspace(actorRole);

  await db
    .update(workspacesTable)
    .set({
      isArchived: true,
      archivedAt: new Date(),
    })
    .where(eq(workspacesTable.id, workspaceId));
}

export async function listMembersForUser(workspaceId: string, actorUserId: string) {
  await loadActorContext(workspaceId, actorUserId);

  const members = await listWorkspaceMembers(workspaceId);

  return members.map(toWorkspaceMemberDto);
}

export async function addMemberForUser(
  workspaceId: string,
  actorUserId: string,
  input: { userId: string; role: WorkspaceRole },
) {
  const { actorRole } = await loadActorContext(workspaceId, actorUserId);
  ensureCanManageMembers(actorRole);
  ensureCanAssignRole(actorRole, input.role);

  const exists = await userExists(input.userId);

  if (!exists) {
    throw badRequest("Invalid request data");
  }

  const alreadyMember = await findMembership(workspaceId, input.userId);

  if (alreadyMember) {
    throw badRequest("User is already a member", "member_exists");
  }

  await db.insert(workspaceMembersTable).values({
    workspaceId,
    userId: input.userId,
    role: input.role,
    joinedAt: new Date(),
  });

  const member = await findWorkspaceMemberWithUser(workspaceId, input.userId);

  if (!member) {
    throw notFound("Resource not found");
  }

  return toWorkspaceMemberDto(member);
}

export async function updateMemberRoleForUser(
  workspaceId: string,
  actorUserId: string,
  targetUserId: string,
  input: { role: WorkspaceRole },
) {
  const { actorRole } = await loadActorContext(workspaceId, actorUserId);
  ensureCanManageMembers(actorRole);

  const target = await findMembership(workspaceId, targetUserId);

  if (!target) {
    throw notFound("Resource not found");
  }

  ensureCanChangeTargetRole(actorRole, target.role, input.role);

  if (target.role === "owner" && input.role !== "owner") {
    const owners = await countWorkspaceOwners(workspaceId);

    if (owners <= 1) {
      throw forbidden("Workspace must have at least one owner");
    }
  }

  await db
    .update(workspaceMembersTable)
    .set({ role: input.role })
    .where(
      and(
        eq(workspaceMembersTable.workspaceId, workspaceId),
        eq(workspaceMembersTable.userId, targetUserId),
      ),
    );

  const member = await findWorkspaceMemberWithUser(workspaceId, targetUserId);

  if (!member) {
    throw notFound("Resource not found");
  }

  return toWorkspaceMemberDto(member);
}

export async function removeMemberForUser(
  workspaceId: string,
  actorUserId: string,
  targetUserId: string,
) {
  const { actorRole } = await loadActorContext(workspaceId, actorUserId);
  ensureCanManageMembers(actorRole);

  const target = await findMembership(workspaceId, targetUserId);

  if (!target) {
    throw notFound("Resource not found");
  }

  ensureCanRemoveTarget(actorRole, target.role);

  if (target.role === "owner") {
    const owners = await countWorkspaceOwners(workspaceId);

    if (owners <= 1) {
      throw forbidden("Workspace must have at least one owner");
    }
  }

  await db
    .delete(workspaceMembersTable)
    .where(
      and(
        eq(workspaceMembersTable.workspaceId, workspaceId),
        eq(workspaceMembersTable.userId, targetUserId),
      ),
    );
}
