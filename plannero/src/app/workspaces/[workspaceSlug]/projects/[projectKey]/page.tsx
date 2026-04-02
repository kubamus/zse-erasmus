import { ProjectHub } from "@/components/project-hub";

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ workspaceSlug: string; projectKey: string }>;
}) {
  const { workspaceSlug, projectKey } = await params;

  return <ProjectHub workspaceSlug={workspaceSlug} projectKey={projectKey} />;
}
