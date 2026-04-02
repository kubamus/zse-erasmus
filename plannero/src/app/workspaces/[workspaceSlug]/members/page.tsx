import { WorkspaceMembersPanel } from "@/components/workspace-members-panel";

export default async function WorkspaceMembersPage({
  params,
}: {
  params: Promise<{ workspaceSlug: string }>;
}) {
  const { workspaceSlug } = await params;

  return <WorkspaceMembersPanel workspaceSlug={workspaceSlug} />;
}
