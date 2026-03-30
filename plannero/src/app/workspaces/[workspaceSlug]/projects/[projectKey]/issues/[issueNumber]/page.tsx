import { IssueDetailPanel } from "@/components/issue-detail-panel";

export default async function IssuePage({
  params,
}: {
  params: Promise<{
    workspaceSlug: string;
    projectKey: string;
    issueNumber: string;
  }>;
}) {
  const { workspaceSlug, projectKey, issueNumber } = await params;

  return (
    <IssueDetailPanel
      workspaceSlug={workspaceSlug}
      projectKey={projectKey}
      issueId={issueNumber}
    />
  );
}
