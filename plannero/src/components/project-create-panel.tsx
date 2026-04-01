"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppFrame } from "@/components/app-frame";
import { apiRequest } from "@/lib/client-api";

type Workspace = { id: string; name: string; slug: string };

export function ProjectCreatePanel({ workspaceSlug }: { workspaceSlug: string }) {
  const router = useRouter();
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [key, setKey] = useState("APP");
  const [name, setName] = useState("Application Core");
  const [description, setDescription] = useState("Main delivery stream");
  const [message, setMessage] = useState<string | null>(null);

  const loadWorkspace = useCallback(async () => {
    const response = await apiRequest<Workspace[]>("/workspaces");
    const all = Array.isArray(response.data) ? response.data : [];
    setWorkspace(all.find((item) => item.slug === workspaceSlug) ?? null);
  }, [workspaceSlug]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadWorkspace();
  }, [loadWorkspace]);

  async function createProject(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!workspace) return;

    const response = await apiRequest<{ key: string }>(`/workspaces/${workspace.id}/projects`, {
      method: "POST",
      body: JSON.stringify({ key, name, description }),
    });

    if (!response.ok || !response.data) {
      setMessage("Could not create project.");
      return;
    }

    router.push(`/workspaces/${workspace.slug}/projects/${response.data.key}`);
    router.refresh();
  }

  return (
    <AppFrame title="New Project" subtitle="Define a scope with a stable key and mission.">
      <form onSubmit={createProject} className="surface max-w-xl rounded-[16px] p-6">
        <label htmlFor="project-key" className="caption-kicker">
          Project key
        </label>
        <input
          id="project-key"
          value={key}
          onChange={(event) => setKey(event.target.value.toUpperCase())}
          className="brutal-input mt-2 w-full rounded-md px-4 py-3"
        />
        <label htmlFor="project-name" className="caption-kicker mt-4 block">
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
        <button type="submit" className="brutal-button mt-5 rounded-md px-4 py-2">
          Create project
        </button>
        {message ? <p className="mt-3 text-sm text-red-700">{message}</p> : null}
      </form>
    </AppFrame>
  );
}
