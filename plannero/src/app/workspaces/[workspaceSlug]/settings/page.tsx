import { WorkspaceSettingsPanel } from "@/components/workspace-settings-panel";

export default async function WorkspaceSettingsPage({
  params,
}: {
  params: Promise<{ workspaceSlug: string }>;
}) {
  const { workspaceSlug } = await params;

  return <WorkspaceSettingsPanel workspaceSlug={workspaceSlug} />;
}
