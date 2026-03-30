import { requireSessionUser } from "@/server/api/auth";
import { parseUuidParam } from "@/server/api/params";
import { errorResponse, jsonResponse, noContentResponse } from "@/server/api/responses";
import { updateLabelRequestSchema } from "@/server/labels/schemas";
import { deleteLabel, updateLabel } from "@/server/labels/service";

type RouteContext = { params: Promise<{ labelId: string }> };

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const { userId } = await requireSessionUser(request);
    const { labelId: rawLabelId } = await context.params;
    const labelId = parseUuidParam(rawLabelId, "labelId");
    const input = updateLabelRequestSchema.parse(await request.json());

    return jsonResponse(await updateLabel(labelId, userId, input));
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(request: Request, context: RouteContext) {
  try {
    const { userId } = await requireSessionUser(request);
    const { labelId: rawLabelId } = await context.params;
    const labelId = parseUuidParam(rawLabelId, "labelId");
    await deleteLabel(labelId, userId);

    return noContentResponse();
  } catch (error) {
    return errorResponse(error);
  }
}
