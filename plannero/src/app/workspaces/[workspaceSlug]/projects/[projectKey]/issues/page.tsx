import { IssueListPanel } from "@/components/issue-list-panel";

export default async function IssuesPage({
  params,
}: {
  params: Promise<{ workspaceSlug: string; projectKey: string }>;
}) {
  const { workspaceSlug, projectKey } = await params;

  return <IssueListPanel workspaceSlug={workspaceSlug} projectKey={projectKey} />;
}
