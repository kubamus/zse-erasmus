import { BoardSettingsPanel } from "@/components/board-settings-panel";

export default async function BoardSettingsPage({
  params,
}: {
  params: Promise<{ workspaceSlug: string; projectKey: string; boardId: string }>;
}) {
  const { workspaceSlug, projectKey, boardId } = await params;

  return (
    <BoardSettingsPanel
      workspaceSlug={workspaceSlug}
      projectKey={projectKey}
      boardId={boardId}
    />
  );
}
