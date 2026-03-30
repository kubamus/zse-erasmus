import { requireSessionUser } from "@/server/api/auth";
import { parseUuidParam } from "@/server/api/params";
import { errorResponse, noContentResponse } from "@/server/api/responses";
import { removeIssueLabel } from "@/server/issues/service";

type RouteContext = { params: Promise<{ issueId: string; labelId: string }> };

export async function DELETE(request: Request, context: RouteContext) {
  try {
    const { userId } = await requireSessionUser(request);
    const { issueId: rawIssueId, labelId: rawLabelId } = await context.params;
    const issueId = parseUuidParam(rawIssueId, "issueId");
    const labelId = parseUuidParam(rawLabelId, "labelId");
    await removeIssueLabel(issueId, userId, labelId);

    return noContentResponse();
  } catch (error) {
    return errorResponse(error);
  }
}
