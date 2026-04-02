import { requireSessionUser } from "@/server/api/auth";
import { parseUuidParam } from "@/server/api/params";
import { errorResponse, jsonResponse, noContentResponse } from "@/server/api/responses";
import { updateBoardRequestSchema } from "@/server/boards/schemas";
import { archiveBoard, getBoard, updateBoard } from "@/server/boards/service";

type RouteContext = { params: Promise<{ boardId: string }> };

export async function GET(request: Request, context: RouteContext) {
  try {
    const { userId } = await requireSessionUser(request);
    const { boardId: rawBoardId } = await context.params;
    const boardId = parseUuidParam(rawBoardId, "boardId");

    return jsonResponse(await getBoard(boardId, userId));
  } catch (error) {
    return errorResponse(error);
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const { userId } = await requireSessionUser(request);
    const { boardId: rawBoardId } = await context.params;
    const boardId = parseUuidParam(rawBoardId, "boardId");
    const input = updateBoardRequestSchema.parse(await request.json());

    return jsonResponse(await updateBoard(boardId, userId, input));
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(request: Request, context: RouteContext) {
  try {
    const { userId } = await requireSessionUser(request);
    const { boardId: rawBoardId } = await context.params;
    const boardId = parseUuidParam(rawBoardId, "boardId");
    await archiveBoard(boardId, userId);

    return noContentResponse();
  } catch (error) {
    return errorResponse(error);
  }
}
