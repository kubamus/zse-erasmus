import { requireSessionUser } from "@/server/api/auth";
import { parseUuidParam } from "@/server/api/params";
import { errorResponse, jsonResponse } from "@/server/api/responses";
import { issueLabelRequestSchema } from "@/server/issues/schemas";
import { addIssueLabel, listIssueLabels } from "@/server/issues/service";

type RouteContext = { params: Promise<{ issueId: string }> };

export async function GET(request: Request, context: RouteContext) {
  try {
    const { userId } = await requireSessionUser(request);
    const { issueId: rawIssueId } = await context.params;
    const issueId = parseUuidParam(rawIssueId, "issueId");

    return jsonResponse(await listIssueLabels(issueId, userId));
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(request: Request, context: RouteContext) {
  try {
    const { userId } = await requireSessionUser(request);
    const { issueId: rawIssueId } = await context.params;
    const issueId = parseUuidParam(rawIssueId, "issueId");
    const input = issueLabelRequestSchema.parse(await request.json());

    return jsonResponse(await addIssueLabel(issueId, userId, input), 201);
  } catch (error) {
    return errorResponse(error);
  }
}
