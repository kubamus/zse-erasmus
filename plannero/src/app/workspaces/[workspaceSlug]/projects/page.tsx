import { WorkspaceProjectsPanel } from "@/components/workspace-projects-panel";

export default async function WorkspaceProjectsPage({
  params,
}: {
  params: Promise<{ workspaceSlug: string }>;
}) {
  const { workspaceSlug } = await params;

  return <WorkspaceProjectsPanel workspaceSlug={workspaceSlug} />;
}
