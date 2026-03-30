import { z } from "zod";
import { workspaceRoleValues } from "./types";

export const createWorkspaceRequestSchema = z.object({
  name: z.string().min(2).max(80),
});

export const updateWorkspaceRequestSchema = z.object({
  name: z.string().min(2).max(80).optional(),
});

export const createWorkspaceMemberRequestSchema = z.object({
  userId: z.string().uuid(),
  role: z.enum(workspaceRoleValues),
});

export const updateWorkspaceMemberRequestSchema = z.object({
  role: z.enum(workspaceRoleValues),
});
