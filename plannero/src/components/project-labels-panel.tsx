"use client";

import { useCallback, useEffect, useState } from "react";
import { AppFrame } from "@/components/app-frame";
import { apiRequest } from "@/lib/client-api";

type Workspace = { id: string; slug: string };
type Project = { id: string; key: string };
type Label = { id: string; name: string; color: string };

export function ProjectLabelsPanel({
  workspaceSlug,
  projectKey,
}: {
  workspaceSlug: string;
  projectKey: string;
}) {
  const [project, setProject] = useState<Project | null>(null);
  const [labels, setLabels] = useState<Label[]>([]);
  const [name, setName] = useState("backend");
  const [color, setColor] = useState("#F97316");
  const [message, setMessage] = useState<string | null>(null);

  const load = useCallback(async () => {
    const workspacesResponse = await apiRequest<Workspace[]>("/workspaces");
    const all = Array.isArray(workspacesResponse.data) ? workspacesResponse.data : [];
    const workspace = all.find((item) => item.slug === workspaceSlug);
    if (!workspace) return;

    const projectsResponse = await apiRequest<Project[]>(`/workspaces/${workspace.id}/projects`);
    const projects = Array.isArray(projectsResponse.data) ? projectsResponse.data : [];
    const currentProject = projects.find((item) => item.key === projectKey) ?? null;
    setProject(currentProject);
    if (!currentProject) return;

    const labelsResponse = await apiRequest<Label[]>(`/projects/${currentProject.id}/labels`);
    setLabels(Array.isArray(labelsResponse.data) ? labelsResponse.data : []);
  }, [projectKey, workspaceSlug]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, [load]);

  async function createLabel() {
    if (!project) return;
    const response = await apiRequest(`/projects/${project.id}/labels`, {
      method: "POST",
      body: JSON.stringify({ name, color }),
    });
    setMessage(response.ok ? "Label created" : "Could not create label");
    if (response.ok) {
      setName("");
    }
    await load();
  }

  async function updateLabel(label: Label) {
    const response = await apiRequest(`/labels/${label.id}`, {
      method: "PATCH",
      body: JSON.stringify({ name: label.name, color: label.color }),
    });
    setMessage(response.ok ? "Label updated" : "Could not update label");
    await load();
  }

  async function deleteLabel(labelId: string) {
    const response = await apiRequest(`/labels/${labelId}`, { method: "DELETE" });
    setMessage(response.ok ? "Label deleted" : "Could not delete label");
    await load();
  }

  return (
    <AppFrame title="Project Labels" subtitle="Manage issue taxonomy and visual tags.">
      <div className="grid gap-4">
        <div className="surface rounded-[14px] p-6">
          <h2 className="title-display text-2xl">Create label</h2>
          <div className="mt-3 grid gap-2 sm:grid-cols-[1fr_auto_auto]">
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="brutal-input rounded-md px-3 py-2"
              placeholder="Label name"
            />
            <input
              value={color}
              onChange={(event) => setColor(event.target.value)}
              className="brutal-input w-32 rounded-md px-3 py-2"
              placeholder="#RRGGBB"
            />
            <button
              type="button"
              onClick={createLabel}
              className="brutal-button rounded-md px-4 py-2"
            >
              Add
            </button>
          </div>
        </div>

        <div className="surface rounded-[14px] p-6">
          <h2 className="title-display text-2xl">Labels</h2>
          <div className="mt-3 grid gap-2">
            {labels.map((label) => (
              <div
                key={label.id}
                className="sticker grid gap-2 rounded-md bg-white p-3 sm:grid-cols-[1fr_auto_auto]"
              >
                <input
                  value={label.name}
                  onChange={(event) => {
                    setLabels((prev) =>
                      prev.map((item) =>
                        item.id === label.id ? { ...item, name: event.target.value } : item,
                      ),
                    );
                  }}
                  className="brutal-input rounded-md px-3 py-2"
                />
                <input
                  value={label.color}
                  onChange={(event) => {
                    setLabels((prev) =>
                      prev.map((item) =>
                        item.id === label.id ? { ...item, color: event.target.value } : item,
                      ),
                    );
                  }}
                  className="brutal-input w-32 rounded-md px-3 py-2"
                />
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => updateLabel(label)}
                    className="brutal-button rounded-md px-3 py-2 text-sm"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteLabel(label.id)}
                    className="brutal-button rounded-md bg-[#11110f] px-3 py-2 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {message ? <p className="mt-4 text-sm text-[var(--ink-2)]">{message}</p> : null}
    </AppFrame>
  );
}
