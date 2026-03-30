import { z } from "zod";

const issueTypeSchema = z.enum(["task", "bug", "story", "chore"]);
const issuePrioritySchema = z.enum(["low", "medium", "high", "critical"]);

export const createIssueRequestSchema = z.object({
  boardId: z.string().uuid(),
  columnId: z.string().uuid(),
  title: z.string().min(3).max(200),
  description: z.string().optional(),
  type: issueTypeSchema,
  priority: issuePrioritySchema,
  dueDate: z.string().datetime().nullable().optional(),
  estimatePoints: z.number().nullable().optional(),
  assigneeIds: z.array(z.string().uuid()).optional(),
  labelIds: z.array(z.string().uuid()).optional(),
});

export const updateIssueRequestSchema = z.object({
  columnId: z.string().uuid().optional(),
  title: z.string().min(3).max(200).optional(),
  description: z.string().optional(),
  type: issueTypeSchema.optional(),
  priority: issuePrioritySchema.optional(),
  dueDate: z.string().datetime().nullable().optional(),
  estimatePoints: z.number().nullable().optional(),
  position: z.number().optional(),
});

export const moveIssueRequestSchema = z.object({
  toColumnId: z.string().uuid(),
  position: z.number(),
});

export const assignIssueRequestSchema = z.object({
  userId: z.string().uuid(),
});

export const issueLabelRequestSchema = z.object({
  labelId: z.string().uuid(),
});

export const listIssuesQuerySchema = z.object({
  boardId: z.string().uuid().optional(),
  columnId: z.string().uuid().optional(),
  assigneeId: z.string().uuid().optional(),
  labelId: z.string().uuid().optional(),
  priority: issuePrioritySchema.optional(),
  type: issueTypeSchema.optional(),
  q: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(100).default(25),
  cursor: z.string().optional(),
});
