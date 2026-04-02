import { BoardCanvas } from "@/components/board-canvas";

export default async function BoardPage({
  params,
}: {
  params: Promise<{ workspaceSlug: string; projectKey: string; boardId: string }>;
}) {
  const { workspaceSlug, projectKey, boardId } = await params;

  return <BoardCanvas workspaceSlug={workspaceSlug} projectKey={projectKey} boardId={boardId} />;
}
