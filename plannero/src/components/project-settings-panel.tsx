"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppFrame } from "@/components/app-frame";
import { apiRequest } from "@/lib/client-api";

type Workspace = { id: string; slug: string };
type Project = {
  id: string;
  key: string;
  name: string;
  description?: string | null;
};

export function ProjectSettingsPanel({
  workspaceSlug,
  projectKey,
}: {
  workspaceSlug: string;
  projectKey: string;
}) {
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  const load = useCallback(async () => {
    const workspaceResponse = await apiRequest<Workspace[]>("/workspaces");
    const workspaces = Array.isArray(workspaceResponse.data) ? workspaceResponse.data : [];
    const workspace = workspaces.find((item) => item.slug === workspaceSlug);
    if (!workspace) {
      setProject(null);
      return;
    }
    const projectsResponse = await apiRequest<Project[]>(`/workspaces/${workspace.id}/projects`);
    const projects = Array.isArray(projectsResponse.data) ? projectsResponse.data : [];
    const current = projects.find((item) => item.key === projectKey) ?? null;
    setProject(current);
    setName(current?.name ?? "");
    setDescription(current?.description ?? "");
  }, [projectKey, workspaceSlug]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, [load]);

  async function save() {
    if (!project) return;
    const response = await apiRequest(`/projects/${project.id}`, {
      method: "PATCH",
      body: JSON.stringify({ name, description }),
    });
    setMessage(response.ok ? "Project updated." : "Could not update project.");
  }

  async function archive() {
    if (!project) return;
    const response = await apiRequest(`/projects/${project.id}`, { method: "DELETE" });
    if (response.ok) {
      router.push(`/workspaces/${workspaceSlug}/projects`);
      return;
    }
    setMessage("Could not archive project.");
  }

  return (
    <AppFrame title="Project Settings" subtitle="Keep naming and scope clean.">
      <div className="grid gap-4">
        <div className="surface rounded-[14px] p-6">
          <label htmlFor="project-name" className="caption-kicker">
            Name
          </label>
          <input
            id="project-name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="brutal-input mt-2 w-full rounded-md px-4 py-3"
          />
          <label htmlFor="project-description" className="caption-kicker mt-4 block">
            Description
          </label>
          <textarea
            id="project-description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows={4}
            className="brutal-input mt-2 w-full rounded-md px-4 py-3"
          />
          <button type="button" onClick={save} className="brutal-button mt-4 rounded-md px-4 py-2">
            Save changes
          </button>
        </div>
        <div className="surface rounded-[14px] p-6">
          <p className="text-sm text-[var(--ink-2)]">Archive this project to hide it from active planning views.</p>
          <button
            type="button"
            onClick={archive}
            className="brutal-button mt-3 rounded-md bg-[#11110f] px-4 py-2"
          >
            Archive project
          </button>
        </div>
        {message ? <p className="text-sm text-[var(--ink-2)]">{message}</p> : null}
      </div>
    </AppFrame>
  );
}
