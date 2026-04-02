import { z } from "zod";

export const createProjectRequestSchema = z.object({
  key: z.string().min(2).max(10).regex(/^[A-Z][A-Z0-9_]*$/),
  name: z.string().min(2).max(120),
  description: z.string().optional(),
});

export const updateProjectRequestSchema = z.object({
  name: z.string().min(2).max(120).optional(),
  description: z.string().optional(),
  isArchived: z.boolean().optional(),
});
