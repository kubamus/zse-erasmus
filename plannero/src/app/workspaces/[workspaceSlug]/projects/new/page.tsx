import { ProjectCreatePanel } from "@/components/project-create-panel";

export default async function NewProjectPage({
  params,
}: {
  params: Promise<{ workspaceSlug: string }>;
}) {
  const { workspaceSlug } = await params;

  return <ProjectCreatePanel workspaceSlug={workspaceSlug} />;
}
