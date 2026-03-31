"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AppFrame } from "@/components/app-frame";
import { apiRequest } from "@/lib/client-api";

type Workspace = { id: string; slug: string };
type Project = { id: string; key: string; name: string };
type Board = { id: string; name: string; type: "kanban" | "scrum" };
type Column = { id: string; boardId: string; name: string; position: string };
type Issue = {
  id: string;
  issueNumber: number;
  title: string;
  priority: string;
  type: string;
};

export function IssueListPanel({
  workspaceSlug,
  projectKey,
}: {
  workspaceSlug: string;
  projectKey: string;
}) {
  const [project, setProject] = useState<Project | null>(null);
  const [boards, setBoards] = useState<Board[]>([]);
  const [columns, setColumns] = useState<Column[]>([]);
  const [issues, setIssues] = useState<Issue[]>([]);

  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [boardIdFilter, setBoardIdFilter] = useState("");
  const [columnIdFilter, setColumnIdFilter] = useState("");

  const [newIssueTitle, setNewIssueTitle] = useState("Investigate incident");
  const [newIssueDescription, setNewIssueDescription] = useState("");
  const [newIssueType, setNewIssueType] = useState<"task" | "bug" | "story" | "chore">("task");
  const [newIssuePriority, setNewIssuePriority] = useState<
    "low" | "medium" | "high" | "critical"
  >("medium");
  const [newIssueBoardId, setNewIssueBoardId] = useState("");
  const [newIssueColumnId, setNewIssueColumnId] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [estimatePoints, setEstimatePoints] = useState("");

  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const workspacesResponse = await apiRequest<Workspace[]>("/workspaces");
    const workspaces = Array.isArray(workspacesResponse.data) ? workspacesResponse.data : [];
    const workspace = workspaces.find((item) => item.slug === workspaceSlug);
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

    const boardsResponse = await apiRequest<Board[]>(`/projects/${currentProject.id}/boards`);
    const projectBoards = Array.isArray(boardsResponse.data) ? boardsResponse.data : [];
    setBoards(projectBoards);

    const columnsByBoard = await Promise.all(
      projectBoards.map(async (board) => {
        const columnsResponse = await apiRequest<Column[]>(`/boards/${board.id}/columns`);
        return Array.isArray(columnsResponse.data) ? columnsResponse.data : [];
      }),
    );

    const allColumns = columnsByBoard.flat();
    setColumns(allColumns);

    const params = new URLSearchParams();
    params.set("limit", "100");
    if (query) params.set("q", query);
    if (typeFilter) params.set("type", typeFilter);
    if (priorityFilter) params.set("priority", priorityFilter);
    if (boardIdFilter) params.set("boardId", boardIdFilter);
    if (columnIdFilter) params.set("columnId", columnIdFilter);

    const issuesResponse = await apiRequest<{ data: Issue[] }>(
      `/projects/${currentProject.id}/issues?${params.toString()}`,
    );
    setIssues(Array.isArray(issuesResponse.data?.data) ? issuesResponse.data.data : []);

    if (!newIssueBoardId && projectBoards.length > 0) {
      setNewIssueBoardId(projectBoards[0].id);
      const starterColumns = allColumns
        .filter((column) => column.boardId === projectBoards[0].id)
        .sort((a, b) => Number(a.position) - Number(b.position));
      setNewIssueColumnId(starterColumns[0]?.id ?? "");
    }

    setLoading(false);
  }, [
    boardIdFilter,
    columnIdFilter,
    newIssueBoardId,
    priorityFilter,
    projectKey,
    query,
    typeFilter,
    workspaceSlug,
  ]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, [load]);

  const createColumns = useMemo(
    () =>
      columns
        .filter((column) => column.boardId === newIssueBoardId)
        .sort((a, b) => Number(a.position) - Number(b.position)),
    [columns, newIssueBoardId],
  );

  async function createIssue() {
    if (!project || !newIssueBoardId || !newIssueColumnId || !newIssueTitle.trim()) {
      return;
    }

    const response = await apiRequest<Issue>(`/projects/${project.id}/issues`, {
      method: "POST",
      body: JSON.stringify({
        boardId: newIssueBoardId,
        columnId: newIssueColumnId,
        title: newIssueTitle,
        description: newIssueDescription || undefined,
        type: newIssueType,
        priority: newIssuePriority,
        dueDate: dueDate ? new Date(dueDate).toISOString() : null,
        estimatePoints: estimatePoints ? Number(estimatePoints) : null,
      }),
    });

    if (!response.ok) {
      setMessage("Could not create issue");
      return;
    }

    setNewIssueTitle("");
    setNewIssueDescription("");
    setDueDate("");
    setEstimatePoints("");
    setMessage("Issue created");
    await load();
  }

  return (
    <AppFrame title="Issue List" subtitle="Search, filter and create issues quickly.">
      <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
        <div className="grid gap-4">
          <div className="surface rounded-2xl p-4">
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search issues"
                className="rounded-xl border border-[var(--line)] bg-white/80 px-4 py-3"
              />
              <select
                value={typeFilter}
                onChange={(event) => setTypeFilter(event.target.value)}
                className="rounded-xl border border-[var(--line)] bg-white/80 px-4 py-3"
              >
                <option value="">all types</option>
                <option value="task">task</option>
                <option value="bug">bug</option>
                <option value="story">story</option>
                <option value="chore">chore</option>
              </select>
              <select
                value={priorityFilter}
                onChange={(event) => setPriorityFilter(event.target.value)}
                className="rounded-xl border border-[var(--line)] bg-white/80 px-4 py-3"
              >
                <option value="">all priorities</option>
                <option value="low">low</option>
                <option value="medium">medium</option>
                <option value="high">high</option>
                <option value="critical">critical</option>
              </select>
              <select
                value={boardIdFilter}
                onChange={(event) => {
                  const value = event.target.value;
                  setBoardIdFilter(value);
                  if (!value) {
                    setColumnIdFilter("");
                  }
                }}
                className="rounded-xl border border-[var(--line)] bg-white/80 px-4 py-3"
              >
                <option value="">all boards</option>
                {boards.map((board) => (
                  <option key={board.id} value={board.id}>
                    {board.name}
                  </option>
                ))}
              </select>
              <select
                value={columnIdFilter}
                onChange={(event) => setColumnIdFilter(event.target.value)}
                className="rounded-xl border border-[var(--line)] bg-white/80 px-4 py-3"
              >
                <option value="">all columns</option>
                {columns
                  .filter((column) => !boardIdFilter || column.boardId === boardIdFilter)
                  .sort((a, b) => Number(a.position) - Number(b.position))
                  .map((column) => (
                    <option key={column.id} value={column.id}>
                      {column.name}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          {loading ? (
            <div className="surface rounded-2xl p-6">Loading issues...</div>
          ) : (
            <div className="grid gap-2">
              {issues.map((issue) => (
                <Link
                  key={issue.id}
                  href={`/workspaces/${workspaceSlug}/projects/${projectKey}/issues/${issue.id}`}
                  className="surface rounded-2xl p-4"
                >
                  <p className="text-xs uppercase tracking-[0.14em] text-[var(--ink-2)]">#{issue.issueNumber}</p>
                  <p className="mt-1 font-semibold">{issue.title}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.12em] text-[var(--ink-2)]">
                    {issue.type} - {issue.priority}
                  </p>
                </Link>
              ))}
              {issues.length === 0 ? (
                <div className="surface rounded-2xl p-4 text-sm text-[var(--ink-2)]">No issues match this filter.</div>
              ) : null}
            </div>
          )}

          {project ? (
            <Link
              href={`/workspaces/${workspaceSlug}/projects/${projectKey}`}
              className="text-sm text-[var(--accent-2)]"
            >
              Back to {project.name}
            </Link>
          ) : null}
        </div>

        <div className="surface h-fit rounded-2xl p-5">
          <h2 className="title-display text-2xl">Create issue</h2>
          <div className="mt-3 grid gap-2">
            <input
              value={newIssueTitle}
              onChange={(event) => setNewIssueTitle(event.target.value)}
              placeholder="Issue title"
              className="rounded-xl border border-[var(--line)] bg-white/80 px-4 py-3"
            />
            <textarea
              value={newIssueDescription}
              onChange={(event) => setNewIssueDescription(event.target.value)}
              rows={4}
              placeholder="Description"
              className="rounded-xl border border-[var(--line)] bg-white/80 px-4 py-3"
            />
            <div className="grid grid-cols-2 gap-2">
              <select
                value={newIssueType}
                onChange={(event) =>
                  setNewIssueType(event.target.value as "task" | "bug" | "story" | "chore")
                }
                className="rounded-xl border border-[var(--line)] bg-white/80 px-4 py-3"
              >
                <option value="task">task</option>
                <option value="bug">bug</option>
                <option value="story">story</option>
                <option value="chore">chore</option>
              </select>
              <select
                value={newIssuePriority}
                onChange={(event) =>
                  setNewIssuePriority(event.target.value as "low" | "medium" | "high" | "critical")
                }
                className="rounded-xl border border-[var(--line)] bg-white/80 px-4 py-3"
              >
                <option value="low">low</option>
                <option value="medium">medium</option>
                <option value="high">high</option>
                <option value="critical">critical</option>
              </select>
            </div>
            <select
              value={newIssueBoardId}
              onChange={(event) => {
                const value = event.target.value;
                setNewIssueBoardId(value);
                const boardColumns = columns
                  .filter((column) => column.boardId === value)
                  .sort((a, b) => Number(a.position) - Number(b.position));
                setNewIssueColumnId(boardColumns[0]?.id ?? "");
              }}
              className="rounded-xl border border-[var(--line)] bg-white/80 px-4 py-3"
            >
              <option value="">select board</option>
              {boards.map((board) => (
                <option key={board.id} value={board.id}>
                  {board.name}
                </option>
              ))}
            </select>
            <select
              value={newIssueColumnId}
              onChange={(event) => setNewIssueColumnId(event.target.value)}
              className="rounded-xl border border-[var(--line)] bg-white/80 px-4 py-3"
            >
              <option value="">select column</option>
              {createColumns.map((column) => (
                <option key={column.id} value={column.id}>
                  {column.name}
                </option>
              ))}
            </select>
            <input
              type="datetime-local"
              value={dueDate}
              onChange={(event) => setDueDate(event.target.value)}
              className="rounded-xl border border-[var(--line)] bg-white/80 px-4 py-3"
            />
            <input
              type="number"
              step="0.5"
              min="0"
              value={estimatePoints}
              onChange={(event) => setEstimatePoints(event.target.value)}
              placeholder="Estimate points"
              className="rounded-xl border border-[var(--line)] bg-white/80 px-4 py-3"
            />
            <button
              type="button"
              onClick={createIssue}
              className="rounded-xl bg-[var(--accent-1)] px-4 py-3 text-white"
            >
              Create issue
            </button>
            {message ? <p className="text-xs text-[var(--ink-2)]">{message}</p> : null}
          </div>
        </div>
      </div>
    </AppFrame>
  );
}
