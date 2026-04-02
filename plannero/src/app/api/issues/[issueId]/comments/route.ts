import { requireSessionUser } from "@/server/api/auth";
import { parseUuidParam } from "@/server/api/params";
import { errorResponse, jsonResponse } from "@/server/api/responses";
import { createCommentRequestSchema } from "@/server/comments/schemas";
import { createComment, listIssueComments } from "@/server/comments/service";

type RouteContext = { params: Promise<{ issueId: string }> };

export async function GET(request: Request, context: RouteContext) {
  try {
    const { userId } = await requireSessionUser(request);
    const { issueId: rawIssueId } = await context.params;
    const issueId = parseUuidParam(rawIssueId, "issueId");

    const rows = await listIssueComments(issueId, userId);
    return jsonResponse(
      rows.map((row) => ({
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
      })),
    );
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(request: Request, context: RouteContext) {
  try {
    const { userId } = await requireSessionUser(request);
    const { issueId: rawIssueId } = await context.params;
    const issueId = parseUuidParam(rawIssueId, "issueId");
    const input = createCommentRequestSchema.parse(await request.json());
    const row = await createComment(issueId, userId, input);

    return jsonResponse(
      {
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
      },
      201,
    );
  } catch (error) {
    return errorResponse(error);
  }
}
