import { ProjectSettingsPanel } from "@/components/project-settings-panel";

export default async function ProjectSettingsPage({
  params,
}: {
  params: Promise<{ workspaceSlug: string; projectKey: string }>;
}) {
  const { workspaceSlug, projectKey } = await params;

  return <ProjectSettingsPanel workspaceSlug={workspaceSlug} projectKey={projectKey} />;
}
