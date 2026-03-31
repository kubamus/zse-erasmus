"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AppFrame } from "@/components/app-frame";
import { apiRequest } from "@/lib/client-api";

type Workspace = { id: string; slug: string };
type Project = { id: string; key: string };
type Board = { id: string; projectId: string; name: string; type: "kanban" | "scrum" };
type Column = {
  id: string;
  boardId: string;
  name: string;
  position: string;
  wipLimit: number | null;
  isDoneColumn: boolean;
};

export function BoardSettingsPanel({
  workspaceSlug,
  projectKey,
  boardId,
}: {
  workspaceSlug: string;
  projectKey: string;
  boardId: string;
}) {
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [board, setBoard] = useState<Board | null>(null);
  const [columns, setColumns] = useState<Column[]>([]);
  const [boardName, setBoardName] = useState("");
  const [boardType, setBoardType] = useState<"kanban" | "scrum">("kanban");
  const [newColumnName, setNewColumnName] = useState("Ready for QA");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const workspacesResponse = await apiRequest<Workspace[]>("/workspaces");
    const all = Array.isArray(workspacesResponse.data) ? workspacesResponse.data : [];
    const workspace = all.find((item) => item.slug === workspaceSlug);
    if (!workspace) {
      setLoading(false);
      return;
    }

    const projectsResponse = await apiRequest<Project[]>(`/workspaces/${workspace.id}/projects`);
    const projects = Array.isArray(projectsResponse.data) ? projectsResponse.data : [];
    const currentProject = projects.find((item) => item.key === projectKey) ?? null;
    setProject(currentProject);
    if (!currentProject) {
      setLoading(false);
      return;
    }

    const boardResponse = await apiRequest<Board>(`/boards/${boardId}`);
    const currentBoard = boardResponse.ok ? (boardResponse.data as Board) : null;
    setBoard(currentBoard);
    setBoardName(currentBoard?.name ?? "");
    setBoardType(currentBoard?.type ?? "kanban");

    const columnsResponse = await apiRequest<Column[]>(`/boards/${boardId}/columns`);
    setColumns(Array.isArray(columnsResponse.data) ? columnsResponse.data : []);

    setLoading(false);
  }, [boardId, projectKey, workspaceSlug]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, [load]);

  const sortedColumns = useMemo(
    () => [...columns].sort((a, b) => Number(a.position) - Number(b.position)),
    [columns],
  );

  async function saveBoard() {
    if (!board) return;
    const response = await apiRequest(`/boards/${board.id}`, {
      method: "PATCH",
      body: JSON.stringify({ name: boardName, type: boardType }),
    });
    setMessage(response.ok ? "Board updated" : "Could not update board");
    await load();
  }

  async function archiveBoard() {
    if (!board) return;
    const response = await apiRequest(`/boards/${board.id}`, { method: "DELETE" });
    if (response.ok) {
      router.push(`/workspaces/${workspaceSlug}/projects/${projectKey}`);
      return;
    }
    setMessage("Could not archive board");
  }

  async function createColumn() {
    if (!board || !newColumnName.trim()) return;
    const nextPosition = Number(sortedColumns.at(-1)?.position ?? 0) + 1024;
    const response = await apiRequest(`/boards/${board.id}/columns`, {
      method: "POST",
      body: JSON.stringify({ name: newColumnName, position: nextPosition }),
    });
    setMessage(response.ok ? "Column created" : "Could not create column");
    setNewColumnName("");
    await load();
  }

  async function updateColumn(
    column: Column,
    patch: {
      name?: string;
      position?: number;
      wipLimit?: number | null;
      isDoneColumn?: boolean;
    },
  ) {
    const response = await apiRequest(`/columns/${column.id}`, {
      method: "PATCH",
      body: JSON.stringify({
        name: patch.name ?? column.name,
        position: Number(patch.position ?? column.position),
        wipLimit: patch.wipLimit ?? column.wipLimit,
        isDoneColumn: patch.isDoneColumn ?? column.isDoneColumn,
      }),
    });
    setMessage(response.ok ? "Column updated" : "Could not update column");
    await load();
  }

  async function moveColumn(column: Column, direction: -1 | 1) {
    const index = sortedColumns.findIndex((item) => item.id === column.id);
    const targetIndex = index + direction;
    if (index < 0 || targetIndex < 0 || targetIndex >= sortedColumns.length) return;

    const target = sortedColumns[targetIndex];
    await updateColumn(column, { position: Number(target.position) });
    await updateColumn(target, { position: Number(column.position) });
  }

  async function deleteColumn(columnId: string) {
    const response = await apiRequest(`/columns/${columnId}`, { method: "DELETE" });
    setMessage(response.ok ? "Column deleted" : "Could not delete column");
    await load();
  }

  if (loading || !board || !project) {
    return (
      <AppFrame title="Board settings" subtitle="Loading...">
        <div className="surface rounded-2xl p-6">Please wait</div>
      </AppFrame>
    );
  }

  return (
    <AppFrame title="Board Settings" subtitle="Tune board and columns.">
      <div className="grid gap-4">
        <div className="surface rounded-2xl p-6">
          <h2 className="title-display text-2xl">Board</h2>
          <div className="mt-3 grid gap-2 sm:grid-cols-[1fr_auto_auto]">
            <input
              value={boardName}
              onChange={(event) => setBoardName(event.target.value)}
              className="rounded-xl border border-[var(--line)] bg-white/80 px-3 py-2"
            />
            <select
              value={boardType}
              onChange={(event) => setBoardType(event.target.value as "kanban" | "scrum")}
              className="rounded-xl border border-[var(--line)] bg-white/80 px-3 py-2"
            >
              <option value="kanban">kanban</option>
              <option value="scrum">scrum</option>
            </select>
            <button
              type="button"
              onClick={saveBoard}
              className="rounded-xl bg-[var(--accent-2)] px-4 py-2 text-white"
            >
              Save board
            </button>
          </div>
          <button
            type="button"
            onClick={archiveBoard}
            className="mt-3 rounded-xl bg-[var(--accent-1)] px-4 py-2 text-white"
          >
            Archive board
          </button>
        </div>

        <div className="surface rounded-2xl p-6">
          <h2 className="title-display text-2xl">Columns</h2>
          <div className="mt-3 grid gap-2 sm:grid-cols-[1fr_auto]">
            <input
              value={newColumnName}
              onChange={(event) => setNewColumnName(event.target.value)}
              className="rounded-xl border border-[var(--line)] bg-white/80 px-3 py-2"
              placeholder="New column"
            />
            <button
              type="button"
              onClick={createColumn}
              className="rounded-xl bg-[var(--accent-1)] px-4 py-2 text-white"
            >
              Create column
            </button>
          </div>

          <div className="mt-4 grid gap-2">
            {sortedColumns.map((column, index) => (
              <div
                key={column.id}
                className="grid gap-2 rounded-xl border border-[var(--line)] bg-white/70 p-3 sm:grid-cols-[1fr_auto_auto_auto_auto]"
              >
                <input
                  value={column.name}
                  onChange={(event) => {
                    setColumns((prev) =>
                      prev.map((item) =>
                        item.id === column.id ? { ...item, name: event.target.value } : item,
                      ),
                    );
                  }}
                  className="rounded-xl border border-[var(--line)] bg-white px-3 py-2"
                />
                <input
                  type="number"
                  value={column.wipLimit ?? ""}
                  onChange={(event) => {
                    const value = event.target.value;
                    setColumns((prev) =>
                      prev.map((item) =>
                        item.id === column.id
                          ? { ...item, wipLimit: value ? Number(value) : null }
                          : item,
                      ),
                    );
                  }}
                  placeholder="WIP"
                  className="w-24 rounded-xl border border-[var(--line)] bg-white px-3 py-2"
                />
                <label className="flex items-center gap-2 rounded-xl border border-[var(--line)] bg-white px-3 py-2 text-xs uppercase tracking-[0.12em]">
                  <input
                    type="checkbox"
                    checked={column.isDoneColumn}
                    onChange={(event) => {
                      setColumns((prev) =>
                        prev.map((item) =>
                          item.id === column.id
                            ? { ...item, isDoneColumn: event.target.checked }
                            : item,
                        ),
                      );
                    }}
                  />
                  Done
                </label>
                <div className="flex gap-1">
                  <button
                    type="button"
                    disabled={index === 0}
                    onClick={() => moveColumn(column, -1)}
                    className="rounded-xl border border-[var(--line)] bg-white px-3 py-2 text-sm disabled:opacity-40"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    disabled={index === sortedColumns.length - 1}
                    onClick={() => moveColumn(column, 1)}
                    className="rounded-xl border border-[var(--line)] bg-white px-3 py-2 text-sm disabled:opacity-40"
                  >
                    ↓
                  </button>
                </div>
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => updateColumn(column, {})}
                    className="rounded-xl bg-[var(--accent-2)] px-3 py-2 text-sm text-white"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteColumn(column.id)}
                    className="rounded-xl bg-[var(--accent-1)] px-3 py-2 text-sm text-white"
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
