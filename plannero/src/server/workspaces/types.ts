export const workspaceRoleValues = ["owner", "admin", "member"] as const;

export type WorkspaceRole = (typeof workspaceRoleValues)[number];

export type WorkspaceDto = {
  id: string;
  name: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
};

export type UserRefDto = {
  id: string;
  name: string;
  email: string;
  image: string | null;
};

export type WorkspaceMemberDto = {
  workspaceId: string;
  user: UserRefDto;
  role: WorkspaceRole;
  joinedAt: Date;
};
