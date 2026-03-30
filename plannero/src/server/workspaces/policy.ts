import { forbidden } from "@/server/api/errors";
import type { WorkspaceRole } from "./types";

export function ensureCanViewWorkspace(role: WorkspaceRole) {
  if (!role) {
    throw forbidden();
  }
}

export function ensureCanUpdateWorkspace(role: WorkspaceRole) {
  if (role !== "owner" && role !== "admin") {
    throw forbidden();
  }
}

export function ensureCanArchiveWorkspace(role: WorkspaceRole) {
  if (role !== "owner") {
    throw forbidden();
  }
}

export function ensureCanManageMembers(role: WorkspaceRole) {
  if (role !== "owner" && role !== "admin") {
    throw forbidden();
  }
}

export function ensureCanAssignRole(
  actorRole: WorkspaceRole,
  targetRole: WorkspaceRole,
) {
  if (actorRole === "admin" && targetRole === "owner") {
    throw forbidden("Only owner can assign owner role");
  }
}

export function ensureCanChangeTargetRole(
  actorRole: WorkspaceRole,
  currentTargetRole: WorkspaceRole,
  nextTargetRole: WorkspaceRole,
) {
  if (actorRole === "admin" && currentTargetRole === "owner") {
    throw forbidden("Admin cannot change owner role");
  }

  if (actorRole === "admin" && nextTargetRole === "owner") {
    throw forbidden("Admin cannot assign owner role");
  }
}

export function ensureCanRemoveTarget(
  actorRole: WorkspaceRole,
  currentTargetRole: WorkspaceRole,
) {
  if (actorRole === "admin" && currentTargetRole === "owner") {
    throw forbidden("Admin cannot remove owner");
  }
}
