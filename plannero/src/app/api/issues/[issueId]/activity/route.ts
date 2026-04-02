import { requireSessionUser } from "@/server/api/auth";
import { parseLimitParam, parseUuidParam } from "@/server/api/params";
import { errorResponse, jsonResponse } from "@/server/api/responses";
import { listIssueActivity } from "@/server/issues/service";

type RouteContext = { params: Promise<{ issueId: string }> };

export async function GET(request: Request, context: RouteContext) {
  try {
    const { userId } = await requireSessionUser(request);
    const { issueId: rawIssueId } = await context.params;
    const issueId = parseUuidParam(rawIssueId, "issueId");
    const url = new URL(request.url);
    const limit = parseLimitParam(url.searchParams.get("limit"), 50, 1, 200);
    const cursor = url.searchParams.get("cursor") ?? undefined;

    return jsonResponse(await listIssueActivity(issueId, userId, { limit, cursor }));
  } catch (error) {
    return errorResponse(error);
  }
}
