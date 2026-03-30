import { requireSessionUser } from "@/server/api/auth";
import { parseUuidParam } from "@/server/api/params";
import { errorResponse, jsonResponse } from "@/server/api/responses";
import { moveIssueRequestSchema } from "@/server/issues/schemas";
import { moveIssue } from "@/server/issues/service";

type RouteContext = { params: Promise<{ issueId: string }> };

export async function POST(request: Request, context: RouteContext) {
  try {
    const { userId } = await requireSessionUser(request);
    const { issueId: rawIssueId } = await context.params;
    const issueId = parseUuidParam(rawIssueId, "issueId");
    const input = moveIssueRequestSchema.parse(await request.json());

    return jsonResponse(await moveIssue(issueId, userId, input));
  } catch (error) {
    return errorResponse(error);
  }
}
