import { z } from "zod";

export const createCommentRequestSchema = z.object({
  body: z.string().min(1).max(10000),
});

export const updateCommentRequestSchema = z.object({
  body: z.string().min(1).max(10000),
});
