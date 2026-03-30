import { requireSessionUser } from "@/server/api/auth";
import { parseUuidParam } from "@/server/api/params";
import { errorResponse, noContentResponse } from "@/server/api/responses";
import { unassignIssue } from "@/server/issues/service";

type RouteContext = { params: Promise<{ issueId: string; userId: string }> };

export async function DELETE(request: Request, context: RouteContext) {
  try {
    const { userId: actorUserId } = await requireSessionUser(request);
    const { issueId: rawIssueId, userId: rawTargetUserId } = await context.params;
    const issueId = parseUuidParam(rawIssueId, "issueId");
    const targetUserId = parseUuidParam(rawTargetUserId, "userId");
    await unassignIssue(issueId, actorUserId, targetUserId);

    return noContentResponse();
  } catch (error) {
    return errorResponse(error);
  }
}
