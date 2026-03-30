import { requireSessionUser } from "@/server/api/auth";
import { parseUuidParam } from "@/server/api/params";
import { errorResponse, jsonResponse } from "@/server/api/responses";
import { createLabelRequestSchema } from "@/server/labels/schemas";
import { createLabel, listLabels } from "@/server/labels/service";

type RouteContext = { params: Promise<{ projectId: string }> };

export async function GET(request: Request, context: RouteContext) {
  try {
    const { userId } = await requireSessionUser(request);
    const { projectId: rawProjectId } = await context.params;
    const projectId = parseUuidParam(rawProjectId, "projectId");

    return jsonResponse(await listLabels(projectId, userId));
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(request: Request, context: RouteContext) {
  try {
    const { userId } = await requireSessionUser(request);
    const { projectId: rawProjectId } = await context.params;
    const projectId = parseUuidParam(rawProjectId, "projectId");
    const input = createLabelRequestSchema.parse(await request.json());

    return jsonResponse(await createLabel(projectId, userId, input), 201);
  } catch (error) {
    return errorResponse(error);
  }
}
