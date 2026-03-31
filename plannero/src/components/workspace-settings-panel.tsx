"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppFrame } from "@/components/app-frame";
import { apiRequest } from "@/lib/client-api";

type Workspace = { id: string; name: string; slug: string };

export function WorkspaceSettingsPanel({ workspaceSlug }: { workspaceSlug: string }) {
  const router = useRouter();
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);

  const loadWorkspace = useCallback(async () => {
    const response = await apiRequest<Workspace[]>("/workspaces");
    const all = Array.isArray(response.data) ? response.data : [];
    const current = all.find((item) => item.slug === workspaceSlug) ?? null;
    setWorkspace(current);
    setName(current?.name ?? "");
    setLoading(false);
  }, [workspaceSlug]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadWorkspace();
  }, [loadWorkspace]);

  async function updateWorkspace() {
    if (!workspace) return;
    const response = await apiRequest(`/workspaces/${workspace.id}`, {
      method: "PATCH",
      body: JSON.stringify({ name }),
    });

    if (response.ok) {
      setMessage("Workspace updated.");
      await loadWorkspace();
    } else {
      setMessage("Could not update workspace.");
    }
  }

  async function archiveWorkspace() {
    if (!workspace) return;
    const response = await apiRequest(`/workspaces/${workspace.id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      router.push("/workspaces");
      return;
    }

    setMessage("Could not archive workspace.");
  }

  return (
    <AppFrame title="Workspace Settings" subtitle="Rename or archive this workspace.">
      {loading || !workspace ? (
        <div className="surface rounded-2xl p-6">Loading workspace...</div>
      ) : (
        <div className="grid gap-4">
          <div className="surface rounded-2xl p-6">
            <label htmlFor="workspace-name" className="text-sm text-[var(--ink-2)]">
              Workspace name
            </label>
            <input
              id="workspace-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="mt-2 w-full rounded-xl border border-[var(--line)] bg-white/80 px-4 py-3"
            />
            <button
              type="button"
              onClick={updateWorkspace}
              className="mt-4 rounded-xl bg-[var(--accent-2)] px-4 py-2 text-white"
            >
              Save
            </button>
          </div>

          <div className="surface rounded-2xl p-6">
            <p className="text-sm text-[var(--ink-2)]">
              Archiving hides this workspace and all nested entities from active views.
            </p>
            <button
              type="button"
              onClick={archiveWorkspace}
              className="mt-4 rounded-xl bg-[var(--accent-1)] px-4 py-2 text-white"
            >
              Archive Workspace
            </button>
          </div>

          {message ? <p className="text-sm text-[var(--ink-2)]">{message}</p> : null}
        </div>
      )}
    </AppFrame>
  );
}
