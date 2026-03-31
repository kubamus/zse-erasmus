import { ProjectLabelsPanel } from "@/components/project-labels-panel";

export default async function ProjectLabelsPage({
  params,
}: {
  params: Promise<{ workspaceSlug: string; projectKey: string }>;
}) {
  const { workspaceSlug, projectKey } = await params;

  return <ProjectLabelsPanel workspaceSlug={workspaceSlug} projectKey={projectKey} />;
}
