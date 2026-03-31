"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
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
type Board = {
  id: string;
  projectId: string;
  name: string;
  type: "kanban" | "scrum";
};

const BOARD_PRESETS: Array<{ name: string; position: number; isDoneColumn?: boolean }> = [
  { name: "Backlog", position: 1000 },
  { name: "In Progress", position: 2000 },
  { name: "Review", position: 3000 },
  { name: "Done", position: 4000, isDoneColumn: true },
];

export function ProjectHub({
  workspaceSlug,
  projectKey,
}: {
  workspaceSlug: string;
  projectKey: string;
}) {
  const [project, setProject] = useState<Project | null>(null);
  const [boards, setBoards] = useState<Board[]>([]);
  const [newBoardName, setNewBoardName] = useState("Delivery Board");
  const [newBoardType, setNewBoardType] = useState<"kanban" | "scrum">("kanban");
  const [creatingBoard, setCreatingBoard] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const workspaceResponse = await apiRequest<Workspace[]>("/workspaces");
    const workspaces = Array.isArray(workspaceResponse.data) ? workspaceResponse.data : [];
    const currentWorkspace = workspaces.find((item) => item.slug === workspaceSlug) ?? null;

    if (!currentWorkspace) {
      setLoading(false);
      return;
    }

    const projectsResponse = await apiRequest<Project[]>(`/workspaces/${currentWorkspace.id}/projects`);
    const allProjects = Array.isArray(projectsResponse.data) ? projectsResponse.data : [];
    const currentProject = allProjects.find((item) => item.key === projectKey) ?? null;
    setProject(currentProject);

    if (!currentProject) {
      setBoards([]);
      setLoading(false);
      return;
    }

    const boardsResponse = await apiRequest<Board[]>(`/projects/${currentProject.id}/boards`);
    setBoards(Array.isArray(boardsResponse.data) ? boardsResponse.data : []);
    setLoading(false);
  }, [projectKey, workspaceSlug]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, [load]);

  async function createBoard() {
    if (!project || !newBoardName.trim() || creatingBoard) {
      return;
    }

    setCreatingBoard(true);
    setError(null);

    const boardResponse = await apiRequest<Board>(`/projects/${project.id}/boards`, {
      method: "POST",
      body: JSON.stringify({
        name: newBoardName,
        type: newBoardType,
      }),
    });

    if (!boardResponse.ok || !boardResponse.data) {
      setError("Could not create board");
      setCreatingBoard(false);
      return;
    }

    const boardId = boardResponse.data.id;

    for (const preset of BOARD_PRESETS) {
      await apiRequest(`/boards/${boardId}/columns`, {
        method: "POST",
        body: JSON.stringify(preset),
      });
    }

    setNewBoardName("");
    setCreatingBoard(false);
    await load();
  }

  const fallbackBoard = useMemo(() => boards[0] ?? null, [boards]);

  return (
    <AppFrame
      title={project ? `${project.key} - ${project.name}` : "Project"}
      subtitle={project?.description ?? "Project planning overview"}
      actions={
        project ? (
          <>
            <Link
              href={`/workspaces/${workspaceSlug}/projects/${projectKey}/settings`}
              className="rounded-xl border border-[var(--line)] px-4 py-2 text-sm"
            >
              Settings
            </Link>
            <Link
              href={`/workspaces/${workspaceSlug}/projects/${projectKey}/issues`}
              className="rounded-xl bg-[var(--accent-2)] px-4 py-2 text-sm text-white"
            >
              Issues
            </Link>
            <Link
              href={`/workspaces/${workspaceSlug}/projects/${projectKey}/labels`}
              className="rounded-xl border border-[var(--line)] px-4 py-2 text-sm"
            >
              Labels
            </Link>
          </>
        ) : null
      }
    >
      {loading ? (
        <div className="surface rounded-2xl p-6">Loading project...</div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="surface rounded-2xl p-6">
            <h2 className="title-display text-2xl">Boards</h2>
            <p className="mt-1 text-sm text-[var(--ink-2)]">Enter board view to move issues quickly.</p>
            <div className="mt-4 grid gap-2 rounded-xl border border-[var(--line)] bg-white/60 p-3">
              <input
                value={newBoardName}
                onChange={(event) => setNewBoardName(event.target.value)}
                placeholder="Board name"
                className="rounded-xl border border-[var(--line)] bg-white/80 px-3 py-2"
              />
              <div className="grid grid-cols-[1fr_auto] gap-2">
                <select
                  value={newBoardType}
                  onChange={(event) => setNewBoardType(event.target.value as "kanban" | "scrum")}
                  className="rounded-xl border border-[var(--line)] bg-white/80 px-3 py-2"
                >
                  <option value="kanban">kanban</option>
                  <option value="scrum">scrum</option>
                </select>
                <button
                  type="button"
                  onClick={createBoard}
                  disabled={creatingBoard}
                  className="rounded-xl bg-[var(--accent-1)] px-4 py-2 text-sm text-white disabled:opacity-50"
                >
                  {creatingBoard ? "Creating..." : "Create"}
                </button>
              </div>
              {error ? <p className="text-xs text-red-700">{error}</p> : null}
            </div>
            <div className="mt-4 grid gap-2">
              {boards.map((board) => (
                <Link
                  key={board.id}
                  href={`/workspaces/${workspaceSlug}/projects/${projectKey}/boards/${board.id}`}
                  className="rounded-xl border border-[var(--line)] bg-white/70 px-4 py-3"
                >
                  <p className="font-semibold">{board.name}</p>
                  <p className="text-xs uppercase tracking-[0.14em] text-[var(--ink-2)]">{board.type}</p>
                </Link>
              ))}
              {boards.map((board) => (
                <Link
                  key={`${board.id}-settings`}
                  href={`/workspaces/${workspaceSlug}/projects/${projectKey}/boards/${board.id}/settings`}
                  className="rounded-xl border border-dashed border-[var(--line)] bg-white/40 px-4 py-2 text-xs uppercase tracking-[0.14em] text-[var(--ink-2)]"
                >
                  Configure {board.name}
                </Link>
              ))}
              {boards.length === 0 ? (
                <p className="rounded-xl border border-[var(--line)] bg-white/70 px-4 py-3 text-sm text-[var(--ink-2)]">
                  No boards yet.
                </p>
              ) : null}
            </div>
          </div>

          <div className="surface rounded-2xl p-6">
            <h2 className="title-display text-2xl">Quick actions</h2>
            <div className="mt-4 grid gap-2">
              <Link
                href={`/workspaces/${workspaceSlug}/projects/${projectKey}/issues`}
                className="rounded-xl border border-[var(--line)] bg-white/70 px-4 py-3"
              >
                Browse all issues
              </Link>
              {fallbackBoard ? (
                <Link
                  href={`/workspaces/${workspaceSlug}/projects/${projectKey}/boards/${fallbackBoard.id}`}
                  className="rounded-xl border border-[var(--line)] bg-white/70 px-4 py-3"
                >
                  Open default board
                </Link>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </AppFrame>
  );
}
