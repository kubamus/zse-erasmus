import { z } from "zod";

export const createBoardColumnRequestSchema = z.object({
  name: z.string().min(1).max(60),
  position: z.number(),
  wipLimit: z.number().int().min(1).nullable().optional(),
  isDoneColumn: z.boolean().optional(),
});

export const updateBoardColumnRequestSchema = z.object({
  name: z.string().min(1).max(60).optional(),
  position: z.number().optional(),
  wipLimit: z.number().int().min(1).nullable().optional(),
  isDoneColumn: z.boolean().optional(),
});
