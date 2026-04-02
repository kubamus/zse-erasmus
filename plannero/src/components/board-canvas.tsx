"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AppFrame } from "@/components/app-frame";
import { apiRequest } from "@/lib/client-api";

type Workspace = { id: string; slug: string };
type Project = { id: string; key: string };
type Board = { id: string; projectId: string; name: string; type: "kanban" | "scrum" };
type BoardColumn = { id: string; boardId: string; name: string; position: string };
type Issue = {
  id: string;
  issueNumber: number;
  title: string;
  columnId: string;
  priority: string;
  type: string;
  position: number;
};

function computeBetween(previous: number | null, next: number | null) {
  if (previous === null && next === null) return 1000;
  if (previous === null) return (next ?? 1000) - 1024;
  if (next === null) return previous + 1024;
  return (previous + next) / 2;
}

function getIssueToneClass(columnName: string) {
  const name = columnName.trim().toLowerCase();

  if (
    name.includes("done") ||
    name.includes("closed") ||
    name.includes("resolved") ||
    name.includes("finished")
  ) {
    return "bg-[#d7f7d4]";
  }

  if (
    name.includes("review") ||
    name.includes("qa") ||
    name.includes("test") ||
    name.includes("verify")
  ) {
    return "bg-[#fff2b8]";
  }

  if (
    name.includes("progress") ||
    name.includes("doing") ||
    name.includes("wip") ||
    name.includes("develop")
  ) {
    return "bg-[#dce8ff]";
  }

  if (name.includes("backlog") || name.includes("todo") || name.includes("to do")) {
    return "bg-[#eef0f3]";
  }

  if (name.includes("block") || name.includes("stuck")) {
    return "bg-[#ffdede]";
  }

  return "bg-white";
}

export function BoardCanvas({
  workspaceSlug,
  projectKey,
  boardId,
}: {
  workspaceSlug: string;
  projectKey: string;
  boardId: string;
}) {
  const [project, setProject] = useState<Project | null>(null);
  const [board, setBoard] = useState<Board | null>(null);
  const [columns, setColumns] = useState<BoardColumn[]>([]);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [newIssueTitle, setNewIssueTitle] = useState("Draft release notes");
  const [newColumnName, setNewColumnName] = useState("In Review");
  const [newIssueType, setNewIssueType] = useState<"task" | "bug" | "story" | "chore">("task");
  const [newIssuePriority, setNewIssuePriority] = useState<
    "low" | "medium" | "high" | "critical"
  >("medium");
  const [draggingIssueId, setDraggingIssueId] = useState<string | null>(null);
  const [moving, setMoving] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const workspacesResponse = await apiRequest<Workspace[]>("/workspaces");
    const workspaces = Array.isArray(workspacesResponse.data) ? workspacesResponse.data : [];
    const currentWorkspace = workspaces.find((item) => item.slug === workspaceSlug) ?? null;
    if (!currentWorkspace) {
      setLoading(false);
      return;
    }

    const projectsResponse = await apiRequest<Project[]>(`/workspaces/${currentWorkspace.id}/projects`);
    const projects = Array.isArray(projectsResponse.data) ? projectsResponse.data : [];
    const currentProject = projects.find((item) => item.key === projectKey) ?? null;
    setProject(currentProject);
    if (!currentProject) {
      setLoading(false);
      return;
    }

    const boardResponse = await apiRequest<Board>(`/boards/${boardId}`);
    setBoard(boardResponse.ok ? (boardResponse.data as Board) : null);

    const columnsResponse = await apiRequest<BoardColumn[]>(`/boards/${boardId}/columns`);
    const allColumns = Array.isArray(columnsResponse.data) ? columnsResponse.data : [];
    setColumns(allColumns);

    const issuesResponse = await apiRequest<{ data: Issue[] }>(
      `/projects/${currentProject.id}/issues?boardId=${boardId}&limit=100`,
    );
    const payload = issuesResponse.data;
    setIssues(Array.isArray(payload?.data) ? payload.data : []);

    setLoading(false);
  }, [boardId, projectKey, workspaceSlug]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, [load]);

  async function createIssue(columnId: string) {
    if (!project || !board) return;
    await apiRequest(`/projects/${project.id}/issues`, {
      method: "POST",
      body: JSON.stringify({
        boardId: board.id,
        columnId,
        title: newIssueTitle,
        type: newIssueType,
        priority: newIssuePriority,
      }),
    });
    setNewIssueTitle("");
    await load();
  }

  async function createColumn() {
    if (!board || !newColumnName.trim()) return;
    const sorted = [...columns].sort((a, b) => Number(a.position) - Number(b.position));
    const last = sorted.at(-1);
    const nextPosition = Number(last?.position ?? 0) + 1024;

    await apiRequest(`/boards/${board.id}/columns`, {
      method: "POST",
      body: JSON.stringify({
        name: newColumnName,
        position: nextPosition,
      }),
    });

    setNewColumnName("");
    await load();
  }

  async function moveIssueToColumn(targetColumnId: string, beforeIssueId?: string) {
    if (!draggingIssueId || !board || moving) return;

    const sourceIssue = issues.find((issue) => issue.id === draggingIssueId);
    if (!sourceIssue) return;

    const columnIssues = issues
      .filter((issue) => issue.columnId === targetColumnId && issue.id !== draggingIssueId)
      .sort((a, b) => a.position - b.position);

    const beforeIndex = beforeIssueId
      ? columnIssues.findIndex((issue) => issue.id === beforeIssueId)
      : -1;

    let previous: number | null = null;
    let next: number | null = null;

    if (beforeIndex >= 0) {
      next = columnIssues[beforeIndex]?.position ?? null;
      previous = beforeIndex > 0 ? columnIssues[beforeIndex - 1]?.position ?? null : null;
    } else {
      previous = columnIssues.at(-1)?.position ?? null;
    }

    const position = computeBetween(previous, next);

    setMoving(true);
    await apiRequest(`/issues/${draggingIssueId}/move`, {
      method: "POST",
      body: JSON.stringify({
        toColumnId: targetColumnId,
        position,
      }),
    });
    setDraggingIssueId(null);
    setMoving(false);
    await load();
  }

  const columnsSorted = useMemo(
    () => [...columns].sort((a, b) => Number(a.position) - Number(b.position)),
    [columns],
  );

  return (
    <AppFrame
      title={board?.name ?? "Board"}
      subtitle="Drag-drop style visual flow for planning execution."
      actions={
        <Link
          href={`/workspaces/${workspaceSlug}/projects/${projectKey}/issues`}
          className="brutal-button-secondary rounded-md px-4 py-2 text-sm"
        >
          Issue List
        </Link>
      }
    >
      {loading ? (
        <div className="surface rounded-2xl p-6">Loading board...</div>
      ) : (
        <div className="grid gap-4 lg:grid-flow-col lg:auto-cols-[minmax(260px,1fr)]">
          {columnsSorted.map((column) => (
            <div key={column.id} className="surface rounded-[14px] p-4">
              <div className="flex items-center justify-between">
                <h2 className="title-display text-2xl">{column.name}</h2>
                <span className="caption-kicker">
                  {issues.filter((issue) => issue.columnId === column.id).length}
                </span>
              </div>
              <ul
                className="mt-3 grid min-h-20 gap-2 rounded-md border-2 border-dashed border-transparent p-1 transition hover:border-[var(--line-strong)]"
                onDragOver={(event) => event.preventDefault()}
                onDrop={(event) => {
                  event.preventDefault();
                  void moveIssueToColumn(column.id);
                }}
              >
                {issues
                  .filter((issue) => issue.columnId === column.id)
                  .sort((a, b) => a.position - b.position)
                  .map((issue) => (
                      <li
                        key={issue.id}
                        draggable
                        onDragStart={() => setDraggingIssueId(issue.id)}
                        onDragEnd={() => setDraggingIssueId(null)}
                        onDragOver={(event) => event.preventDefault()}
                        onDrop={(event) => {
                          event.preventDefault();
                          void moveIssueToColumn(column.id, issue.id);
                        }}
                        className={`sticker rounded-md px-3 py-3 ${getIssueToneClass(column.name)}`}
                      >
                      <Link href={`/workspaces/${workspaceSlug}/projects/${projectKey}/issues/${issue.id}`}>
                        <p className="font-semibold">#{issue.issueNumber} {issue.title}</p>
                        <p className="mt-1 text-xs uppercase tracking-[0.12em] text-[var(--ink-2)]">
                          {issue.type} - {issue.priority}
                        </p>
                      </Link>
                    </li>
                  ))}
              </ul>
              <div className="mt-4 grid gap-2">
                <input
                  value={newIssueTitle}
                  onChange={(event) => setNewIssueTitle(event.target.value)}
                  placeholder="Quick issue title"
                  className="brutal-input rounded-md px-3 py-2"
                />
                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={newIssueType}
                    onChange={(event) =>
                      setNewIssueType(event.target.value as "task" | "bug" | "story" | "chore")
                    }
                    className="brutal-input rounded-md px-3 py-2 text-sm"
                  >
                    <option value="task">task</option>
                    <option value="bug">bug</option>
                    <option value="story">story</option>
                    <option value="chore">chore</option>
                  </select>
                  <select
                    value={newIssuePriority}
                    onChange={(event) =>
                      setNewIssuePriority(
                        event.target.value as "low" | "medium" | "high" | "critical",
                      )
                    }
                    className="brutal-input rounded-md px-3 py-2 text-sm"
                  >
                    <option value="low">low</option>
                    <option value="medium">medium</option>
                    <option value="high">high</option>
                    <option value="critical">critical</option>
                  </select>
                </div>
                <button
                  type="button"
                  onClick={() => createIssue(column.id)}
                  className="brutal-button rounded-md px-3 py-2 text-sm"
                >
                  Add issue
                </button>
              </div>
            </div>
          ))}
          <div className="surface rounded-[14px] p-4">
            <h2 className="title-display text-2xl">Add column</h2>
            <div className="mt-3 grid gap-2">
              <input
                value={newColumnName}
                onChange={(event) => setNewColumnName(event.target.value)}
                placeholder="Column name"
                className="brutal-input rounded-md px-3 py-2"
              />
              <button
                type="button"
                onClick={createColumn}
                className="brutal-button rounded-md px-3 py-2 text-sm"
              >
                Create column
              </button>
            </div>
            {moving ? (
              <p className="mt-3 text-xs uppercase tracking-[0.12em] text-[var(--ink-2)]">Moving issue...</p>
            ) : null}
          </div>
        </div>
      )}
    </AppFrame>
  );
}
