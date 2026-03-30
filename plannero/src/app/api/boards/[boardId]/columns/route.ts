import { requireSessionUser } from "@/server/api/auth";
import { parseUuidParam } from "@/server/api/params";
import { errorResponse, jsonResponse } from "@/server/api/responses";
import { createBoardColumnRequestSchema } from "@/server/columns/schemas";
import { createBoardColumn, listBoardColumns } from "@/server/columns/service";

type RouteContext = { params: Promise<{ boardId: string }> };

export async function GET(request: Request, context: RouteContext) {
  try {
    const { userId } = await requireSessionUser(request);
    const { boardId: rawBoardId } = await context.params;
    const boardId = parseUuidParam(rawBoardId, "boardId");

    return jsonResponse(await listBoardColumns(boardId, userId));
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(request: Request, context: RouteContext) {
  try {
    const { userId } = await requireSessionUser(request);
    const { boardId: rawBoardId } = await context.params;
    const boardId = parseUuidParam(rawBoardId, "boardId");
    const input = createBoardColumnRequestSchema.parse(await request.json());

    return jsonResponse(await createBoardColumn(boardId, userId, input), 201);
  } catch (error) {
    return errorResponse(error);
  }
}
