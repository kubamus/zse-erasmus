import { requireSessionUser } from "@/server/api/auth";
import { parseUuidParam } from "@/server/api/params";
import { errorResponse, jsonResponse, noContentResponse } from "@/server/api/responses";
import { updateBoardColumnRequestSchema } from "@/server/columns/schemas";
import { deleteBoardColumn, updateBoardColumn } from "@/server/columns/service";

type RouteContext = { params: Promise<{ columnId: string }> };

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const { userId } = await requireSessionUser(request);
    const { columnId: rawColumnId } = await context.params;
    const columnId = parseUuidParam(rawColumnId, "columnId");
    const input = updateBoardColumnRequestSchema.parse(await request.json());

    return jsonResponse(await updateBoardColumn(columnId, userId, input));
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(request: Request, context: RouteContext) {
  try {
    const { userId } = await requireSessionUser(request);
    const { columnId: rawColumnId } = await context.params;
    const columnId = parseUuidParam(rawColumnId, "columnId");
    await deleteBoardColumn(columnId, userId);

    return noContentResponse();
  } catch (error) {
    return errorResponse(error);
  }
}
