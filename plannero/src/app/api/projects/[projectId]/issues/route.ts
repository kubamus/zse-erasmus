import { requireSessionUser } from "@/server/api/auth";
import { parseUuidParam } from "@/server/api/params";
import { errorResponse, jsonResponse } from "@/server/api/responses";
import {
  createIssueRequestSchema,
  listIssuesQuerySchema,
} from "@/server/issues/schemas";
import { createIssue, listIssues } from "@/server/issues/service";

type RouteContext = { params: Promise<{ projectId: string }> };

export async function GET(request: Request, context: RouteContext) {
  try {
    const { userId } = await requireSessionUser(request);
    const { projectId: rawProjectId } = await context.params;
    const projectId = parseUuidParam(rawProjectId, "projectId");
    const url = new URL(request.url);

    const query = listIssuesQuerySchema.parse({
      boardId: url.searchParams.get("boardId") ?? undefined,
      columnId: url.searchParams.get("columnId") ?? undefined,
      assigneeId: url.searchParams.get("assigneeId") ?? undefined,
      labelId: url.searchParams.get("labelId") ?? undefined,
      priority: url.searchParams.get("priority") ?? undefined,
      type: url.searchParams.get("type") ?? undefined,
      q: url.searchParams.get("q") ?? undefined,
      limit: url.searchParams.get("limit") ?? undefined,
      cursor: url.searchParams.get("cursor") ?? undefined,
    });

    return jsonResponse(await listIssues(projectId, userId, query));
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(request: Request, context: RouteContext) {
  try {
    const { userId } = await requireSessionUser(request);
    const { projectId: rawProjectId } = await context.params;
    const projectId = parseUuidParam(rawProjectId, "projectId");
    const input = createIssueRequestSchema.parse(await request.json());

    return jsonResponse(await createIssue(projectId, userId, input), 201);
  } catch (error) {
    return errorResponse(error);
  }
}
