import { requireSessionUser } from "@/server/api/auth";
import { parseUuidParam } from "@/server/api/params";
import { errorResponse, jsonResponse } from "@/server/api/responses";
import { createProjectRequestSchema } from "@/server/projects/schemas";
import { createProject, listProjects } from "@/server/projects/service";

type RouteContext = { params: Promise<{ workspaceId: string }> };

export async function GET(request: Request, context: RouteContext) {
  try {
    const { userId } = await requireSessionUser(request);
    const { workspaceId: rawWorkspaceId } = await context.params;
    const workspaceId = parseUuidParam(rawWorkspaceId, "workspaceId");
    const projects = await listProjects(workspaceId, userId);

    return jsonResponse(projects);
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
    const input = createProjectRequestSchema.parse(body);
    const project = await createProject(workspaceId, userId, input);

    return jsonResponse(project, 201);
  } catch (error) {
    return errorResponse(error);
  }
}
