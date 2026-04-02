import { IssueDetailPanel } from "@/components/issue-detail-panel";

export default async function IssuePage({
  params,
}: {
  params: Promise<{
    workspaceSlug: string;
    projectKey: string;
    issueId: string;
  }>;
}) {
  const { workspaceSlug, projectKey, issueId } = await params;

  return <IssueDetailPanel workspaceSlug={workspaceSlug} projectKey={projectKey} issueId={issueId} />;
}
