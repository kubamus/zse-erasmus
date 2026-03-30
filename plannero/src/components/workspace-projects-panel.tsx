"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AppFrame } from "@/components/app-frame";
import { apiRequest } from "@/lib/client-api";

type Workspace = { id: string; name: string; slug: string };
type Project = {
  id: string;
  workspaceId: string;
  key: string;
  name: string;
  description?: string | null;
  isArchived: boolean;
};

export function WorkspaceProjectsPanel({ workspaceSlug }: { workspaceSlug: string }) {
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const workspaceResponse = await apiRequest<Workspace[]>("/workspaces");
    const all = Array.isArray(workspaceResponse.data) ? workspaceResponse.data : [];
    const current = all.find((item) => item.slug === workspaceSlug) ?? null;
    setWorkspace(current);

    if (!current) {
      setProjects([]);
      setLoading(false);
      return;
    }

    const projectsResponse = await apiRequest<Project[]>(`/workspaces/${current.id}/projects`);
    setProjects(Array.isArray(projectsResponse.data) ? projectsResponse.data : []);
    setLoading(false);
  }, [workspaceSlug]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, [load]);

  return (
    <AppFrame
      title="Projects"
      subtitle="Projects scope planning and delivery streams."
      actions={
        workspace ? (
          <Link
            href={`/workspaces/${workspace.slug}/projects/new`}
            className="rounded-xl bg-[var(--accent-2)] px-4 py-2 text-sm text-white"
          >
            New Project
          </Link>
        ) : null
      }
    >
      {loading ? (
        <div className="card rounded-2xl p-6">Loading projects...</div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <Link
              key={project.id}
              href={`/workspaces/${workspaceSlug}/projects/${project.key}`}
              className="card rounded-2xl p-5 transition hover:-translate-y-0.5"
            >
              <p className="text-xs uppercase tracking-[0.18em] text-[#574d45]">{project.key}</p>
              <h2 className="title-display mt-2 text-2xl">{project.name}</h2>
              <p className="mt-2 text-sm text-[#574d45]">{project.description ?? "No description"}</p>
            </Link>
          ))}
        </div>
      )}
    </AppFrame>
  );
}
