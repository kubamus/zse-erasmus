import { requireSessionUser } from "@/server/api/auth";
import { parseUuidParam } from "@/server/api/params";
import { errorResponse, jsonResponse, noContentResponse } from "@/server/api/responses";
import { updateCommentRequestSchema } from "@/server/comments/schemas";
import { deleteComment, updateComment } from "@/server/comments/service";

type RouteContext = { params: Promise<{ commentId: string }> };

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const { userId } = await requireSessionUser(request);
    const { commentId: rawCommentId } = await context.params;
    const commentId = parseUuidParam(rawCommentId, "commentId");
    const input = updateCommentRequestSchema.parse(await request.json());
    const row = await updateComment(commentId, userId, input);

    return jsonResponse({
      id: row.id,
      issueId: row.issueId,
      author: {
        id: row.authorId,
        name: row.authorName,
        email: row.authorEmail,
        image: row.authorImage,
      },
      body: row.body,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      deletedAt: row.deletedAt,
    });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(request: Request, context: RouteContext) {
  try {
    const { userId } = await requireSessionUser(request);
    const { commentId: rawCommentId } = await context.params;
    const commentId = parseUuidParam(rawCommentId, "commentId");
    await deleteComment(commentId, userId);

    return noContentResponse();
  } catch (error) {
    return errorResponse(error);
  }
}
