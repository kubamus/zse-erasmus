import { parseUuidParam } from "@/server/api/params";
import { requireSessionUser } from "@/server/api/auth";
import { errorResponse, jsonResponse, noContentResponse } from "@/server/api/responses";
import { updateWorkspaceRequestSchema } from "@/server/workspaces/schemas";
import {
  archiveWorkspaceForUser,
  getWorkspaceForUser,
  updateWorkspaceForUser,
} from "@/server/workspaces/service";

type RouteContext = {
  params: Promise<{ workspaceId: string }>;
};

export async function GET(request: Request, context: RouteContext) {
  try {
    const { userId } = await requireSessionUser(request);
    const { workspaceId: rawWorkspaceId } = await context.params;
    const workspaceId = parseUuidParam(rawWorkspaceId, "workspaceId");
    const workspace = await getWorkspaceForUser(workspaceId, userId);

    return jsonResponse(workspace);
  } catch (error) {
    return errorResponse(error);
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const { userId } = await requireSessionUser(request);
    const { workspaceId: rawWorkspaceId } = await context.params;
    const workspaceId = parseUuidParam(rawWorkspaceId, "workspaceId");
    const body = await request.json();
    const input = updateWorkspaceRequestSchema.parse(body);
    const workspace = await updateWorkspaceForUser(workspaceId, userId, input);

    return jsonResponse(workspace);
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(request: Request, context: RouteContext) {
  try {
    const { userId } = await requireSessionUser(request);
    const { workspaceId: rawWorkspaceId } = await context.params;
    const workspaceId = parseUuidParam(rawWorkspaceId, "workspaceId");

    await archiveWorkspaceForUser(workspaceId, userId);

    return noContentResponse();
  } catch (error) {
    return errorResponse(error);
  }
}
