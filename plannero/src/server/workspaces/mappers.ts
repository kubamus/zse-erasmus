import type { WorkspaceMemberDto, WorkspaceRole } from "./types";

type WorkspaceRow = {
  id: string;
  name: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
};

type WorkspaceMemberRow = {
  workspaceId: string;
  role: string;
  joinedAt: Date;
  userId: string;
  userName: string;
  userEmail: string;
  userImage: string | null;
};

export function toWorkspaceDto(workspace: WorkspaceRow) {
  return {
    id: workspace.id,
    name: workspace.name,
    slug: workspace.slug,
    createdAt: workspace.createdAt,
    updatedAt: workspace.updatedAt,
  };
}

export function toWorkspaceMemberDto(member: WorkspaceMemberRow): WorkspaceMemberDto {
  return {
    workspaceId: member.workspaceId,
    role: member.role as WorkspaceRole,
    joinedAt: member.joinedAt,
    user: {
      id: member.userId,
      name: member.userName,
      email: member.userEmail,
      image: member.userImage,
    },
  };
}
