import { requireSessionUser } from "@/server/api/auth";
import { parseUuidParam } from "@/server/api/params";
import { errorResponse, jsonResponse, noContentResponse } from "@/server/api/responses";
import { updateProjectRequestSchema } from "@/server/projects/schemas";
import { archiveProject, getProject, updateProject } from "@/server/projects/service";

type RouteContext = { params: Promise<{ projectId: string }> };

export async function GET(request: Request, context: RouteContext) {
  try {
    const { userId } = await requireSessionUser(request);
    const { projectId: rawProjectId } = await context.params;
    const projectId = parseUuidParam(rawProjectId, "projectId");

    return jsonResponse(await getProject(projectId, userId));
  } catch (error) {
    return errorResponse(error);
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const { userId } = await requireSessionUser(request);
    const { projectId: rawProjectId } = await context.params;
    const projectId = parseUuidParam(rawProjectId, "projectId");
    const input = updateProjectRequestSchema.parse(await request.json());

    return jsonResponse(await updateProject(projectId, userId, input));
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(request: Request, context: RouteContext) {
  try {
    const { userId } = await requireSessionUser(request);
    const { projectId: rawProjectId } = await context.params;
    const projectId = parseUuidParam(rawProjectId, "projectId");
    await archiveProject(projectId, userId);

    return noContentResponse();
  } catch (error) {
    return errorResponse(error);
  }
}
