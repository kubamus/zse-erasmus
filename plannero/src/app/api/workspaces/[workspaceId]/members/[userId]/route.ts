import { parseUuidParam } from "@/server/api/params";
import { requireSessionUser } from "@/server/api/auth";
import { errorResponse, jsonResponse, noContentResponse } from "@/server/api/responses";
import { updateWorkspaceMemberRequestSchema } from "@/server/workspaces/schemas";
import {
  removeMemberForUser,
  updateMemberRoleForUser,
} from "@/server/workspaces/service";

type RouteContext = {
  params: Promise<{ workspaceId: string; userId: string }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const { userId: actorUserId } = await requireSessionUser(request);
    const { workspaceId: rawWorkspaceId, userId: rawTargetUserId } = await context.params;
    const workspaceId = parseUuidParam(rawWorkspaceId, "workspaceId");
    const targetUserId = parseUuidParam(rawTargetUserId, "userId");
    const body = await request.json();
    const input = updateWorkspaceMemberRequestSchema.parse(body);
    const member = await updateMemberRoleForUser(
      workspaceId,
      actorUserId,
      targetUserId,
      input,
    );

    return jsonResponse(member);
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(request: Request, context: RouteContext) {
  try {
    const { userId: actorUserId } = await requireSessionUser(request);
    const { workspaceId: rawWorkspaceId, userId: rawTargetUserId } = await context.params;
    const workspaceId = parseUuidParam(rawWorkspaceId, "workspaceId");
    const targetUserId = parseUuidParam(rawTargetUserId, "userId");

    await removeMemberForUser(workspaceId, actorUserId, targetUserId);

    return noContentResponse();
  } catch (error) {
    return errorResponse(error);
  }
}
