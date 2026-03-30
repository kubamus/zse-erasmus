import { requireSessionUser } from "@/server/api/auth";
import { parseUuidParam } from "@/server/api/params";
import { errorResponse, jsonResponse, noContentResponse } from "@/server/api/responses";
import { updateIssueRequestSchema } from "@/server/issues/schemas";
import { deleteIssue, getIssue, updateIssue } from "@/server/issues/service";

type RouteContext = { params: Promise<{ issueId: string }> };

export async function GET(request: Request, context: RouteContext) {
  try {
    const { userId } = await requireSessionUser(request);
    const { issueId: rawIssueId } = await context.params;
    const issueId = parseUuidParam(rawIssueId, "issueId");

    return jsonResponse(await getIssue(issueId, userId));
  } catch (error) {
    return errorResponse(error);
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const { userId } = await requireSessionUser(request);
    const { issueId: rawIssueId } = await context.params;
    const issueId = parseUuidParam(rawIssueId, "issueId");
    const input = updateIssueRequestSchema.parse(await request.json());

    return jsonResponse(await updateIssue(issueId, userId, input));
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(request: Request, context: RouteContext) {
  try {
    const { userId } = await requireSessionUser(request);
    const { issueId: rawIssueId } = await context.params;
    const issueId = parseUuidParam(rawIssueId, "issueId");
    await deleteIssue(issueId, userId);

    return noContentResponse();
  } catch (error) {
    return errorResponse(error);
  }
}
