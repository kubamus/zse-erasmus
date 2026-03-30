import { requireSessionUser } from "@/server/api/auth";
import { parseUuidParam } from "@/server/api/params";
import { errorResponse, jsonResponse } from "@/server/api/responses";
import { assignIssueRequestSchema } from "@/server/issues/schemas";
import { assignIssue, listIssueAssignees } from "@/server/issues/service";

type RouteContext = { params: Promise<{ issueId: string }> };

export async function GET(request: Request, context: RouteContext) {
  try {
    const { userId } = await requireSessionUser(request);
    const { issueId: rawIssueId } = await context.params;
    const issueId = parseUuidParam(rawIssueId, "issueId");

    return jsonResponse(await listIssueAssignees(issueId, userId));
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(request: Request, context: RouteContext) {
  try {
    const { userId } = await requireSessionUser(request);
    const { issueId: rawIssueId } = await context.params;
    const issueId = parseUuidParam(rawIssueId, "issueId");
    const input = assignIssueRequestSchema.parse(await request.json());

    return jsonResponse(await assignIssue(issueId, userId, input), 201);
  } catch (error) {
    return errorResponse(error);
  }
}
