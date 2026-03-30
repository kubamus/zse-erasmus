import { parseUuidParam } from "@/server/api/params";
import { requireSessionUser } from "@/server/api/auth";
import { errorResponse, jsonResponse } from "@/server/api/responses";
import { createWorkspaceMemberRequestSchema } from "@/server/workspaces/schemas";
import { addMemberForUser, listMembersForUser } from "@/server/workspaces/service";

type RouteContext = {
  params: Promise<{ workspaceId: string }>;
};

export async function GET(request: Request, context: RouteContext) {
  try {
    const { userId } = await requireSessionUser(request);
    const { workspaceId: rawWorkspaceId } = await context.params;
    const workspaceId = parseUuidParam(rawWorkspaceId, "workspaceId");
    const members = await listMembersForUser(workspaceId, userId);

    return jsonResponse(members);
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(request: Request, context: RouteContext) {
  try {
    const { userId } = await requireSessionUser(request);
    const { workspaceId: rawWorkspaceId } = await context.params;
    const workspaceId = parseUuidParam(rawWorkspaceId, "workspaceId");
    const body = await request.json();
    const input = createWorkspaceMemberRequestSchema.parse(body);
    const member = await addMemberForUser(workspaceId, userId, input);

    return jsonResponse(member, 201);
  } catch (error) {
    return errorResponse(error);
  }
}
