import { WorkspaceHub } from "@/components/workspace-hub";

export default async function WorkspaceDashboardPage({
  params,
}: {
  params: Promise<{ workspaceSlug: string }>;
}) {
  const { workspaceSlug } = await params;

  return <WorkspaceHub workspaceSlug={workspaceSlug} />;
}
