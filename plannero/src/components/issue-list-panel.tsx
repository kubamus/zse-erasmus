"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AppFrame } from "@/components/app-frame";
import { apiRequest } from "@/lib/client-api";

type Workspace = { id: string; slug: string };
type Project = { id: string; key: string; name: string };
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
  const [issues, setIssues] = useState<Issue[]>([]);
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
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

    const issuesResponse = await apiRequest<{ data: Issue[] }>(
      `/projects/${currentProject.id}/issues?q=${encodeURIComponent(query)}&type=${encodeURIComponent(typeFilter)}&priority=${encodeURIComponent(priorityFilter)}&limit=100`,
    );
    setIssues(Array.isArray(issuesResponse.data?.data) ? issuesResponse.data.data : []);
    setLoading(false);
  }, [priorityFilter, projectKey, query, typeFilter, workspaceSlug]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, [load]);

  return (
    <AppFrame title="Issue List" subtitle="Search and triage issues across this project.">
      <div className="card rounded-2xl p-4">
        <div className="grid gap-2 sm:grid-cols-3">
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
        </div>
      </div>
      {loading ? (
        <div className="mt-4 card rounded-2xl p-6">Loading issues...</div>
      ) : (
        <div className="mt-4 grid gap-2">
          {issues.map((issue) => (
            <Link
              key={issue.id}
              href={`/workspaces/${workspaceSlug}/projects/${projectKey}/issues/${issue.id}`}
              className="card rounded-2xl p-4"
            >
              <p className="text-xs uppercase tracking-[0.14em] text-[#574d45]">#{issue.issueNumber}</p>
              <p className="mt-1 font-semibold">{issue.title}</p>
              <p className="mt-1 text-xs uppercase tracking-[0.12em] text-[#574d45]">
                {issue.type} - {issue.priority}
              </p>
            </Link>
          ))}
        </div>
      )}
      {project ? (
        <div className="mt-4">
          <Link
            href={`/workspaces/${workspaceSlug}/projects/${projectKey}`}
            className="text-sm text-[var(--accent-2)]"
          >
            Back to {project.name}
          </Link>
        </div>
      ) : null}
    </AppFrame>
  );
}
