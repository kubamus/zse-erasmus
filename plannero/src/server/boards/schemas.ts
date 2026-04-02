import { z } from "zod";

export const createBoardRequestSchema = z.object({
  name: z.string().min(2).max(120),
  type: z.enum(["kanban", "scrum"]),
});

export const updateBoardRequestSchema = z.object({
  name: z.string().min(2).max(120).optional(),
  type: z.enum(["kanban", "scrum"]).optional(),
});
