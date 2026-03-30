import { requireSessionUser } from "@/server/api/auth";
import { errorResponse, jsonResponse } from "@/server/api/responses";
import {
  createWorkspaceRequestSchema,
} from "@/server/workspaces/schemas";
import {
  createWorkspaceForUser,
  listWorkspacesForUser,
} from "@/server/workspaces/service";

export async function GET(request: Request) {
  try {
    const { userId } = await requireSessionUser(request);
    const workspaces = await listWorkspacesForUser(userId);

    return jsonResponse(workspaces);
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(request: Request) {
  try {
    const { userId } = await requireSessionUser(request);
    const body = await request.json();
    const input = createWorkspaceRequestSchema.parse(body);
    const workspace = await createWorkspaceForUser(userId, input);

    return jsonResponse(workspace, 201);
  } catch (error) {
    return errorResponse(error);
  }
}
