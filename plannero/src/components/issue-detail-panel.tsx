"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AppFrame } from "@/components/app-frame";
import { apiRequest } from "@/lib/client-api";

type Workspace = { id: string; slug: string };
type Project = { id: string; key: string; name: string };
type UserRef = { id: string; name: string; email: string; image?: string | null };
type LabelRef = { id: string; name: string; color: string; projectId: string };
type Issue = {
  id: string;
  issueNumber: number;
  title: string;
  description?: string | null;
  priority: "low" | "medium" | "high" | "critical";
  type: "task" | "bug" | "story" | "chore";
  assignees: UserRef[];
  labels: LabelRef[];
};
type Comment = {
  id: string;
  body: string;
  author: { id: string; name: string; email: string };
};
type Activity = {
  id: string;
  eventType: string;
  actor: { name: string; email: string };
  createdAt: string;
};
type WorkspaceMember = {
  workspaceId: string;
  user: UserRef;
  role: "owner" | "admin" | "member";
};

export function IssueDetailPanel({
  workspaceSlug,
  projectKey,
  issueId,
}: {
  workspaceSlug: string;
  projectKey: string;
  issueId: string;
}) {
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [project, setProject] = useState<Project | null>(null);
  const [issue, setIssue] = useState<Issue | null>(null);
  const [members, setMembers] = useState<WorkspaceMember[]>([]);
  const [projectLabels, setProjectLabels] = useState<LabelRef[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [activity, setActivity] = useState<Activity[]>([]);

  const [commentBody, setCommentBody] = useState("Need QA validation.");
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newType, setNewType] = useState<"task" | "bug" | "story" | "chore">("task");
  const [newPriority, setNewPriority] = useState<"low" | "medium" | "high" | "critical">(
    "medium",
  );
  const [assigneeUserId, setAssigneeUserId] = useState("");
  const [labelId, setLabelId] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const workspacesResponse = await apiRequest<Workspace[]>("/workspaces");
    const allWorkspaces = Array.isArray(workspacesResponse.data) ? workspacesResponse.data : [];
    const currentWorkspace = allWorkspaces.find((item) => item.slug === workspaceSlug) ?? null;
    setWorkspace(currentWorkspace);

    if (!currentWorkspace) {
      setLoading(false);
      return;
    }

    const projectsResponse = await apiRequest<Project[]>(`/workspaces/${currentWorkspace.id}/projects`);
    const projects = Array.isArray(projectsResponse.data) ? projectsResponse.data : [];
    const currentProject = projects.find((item) => item.key === projectKey) ?? null;
    setProject(currentProject);

    const membersResponse = await apiRequest<WorkspaceMember[]>(
      `/workspaces/${currentWorkspace.id}/members`,
    );
    setMembers(Array.isArray(membersResponse.data) ? membersResponse.data : []);

    if (currentProject) {
      const labelsResponse = await apiRequest<LabelRef[]>(`/projects/${currentProject.id}/labels`);
      setProjectLabels(Array.isArray(labelsResponse.data) ? labelsResponse.data : []);
    } else {
      setProjectLabels([]);
    }

    const issueResponse = await apiRequest<Issue>(`/issues/${issueId}`);
    if (!issueResponse.ok || !issueResponse.data) {
      setIssue(null);
      setLoading(false);
      return;
    }

    setIssue(issueResponse.data);
    setNewTitle(issueResponse.data.title);
    setNewDescription(issueResponse.data.description ?? "");
    setNewType(issueResponse.data.type);
    setNewPriority(issueResponse.data.priority);

    const commentsResponse = await apiRequest<Comment[]>(`/issues/${issueId}/comments`);
    setComments(Array.isArray(commentsResponse.data) ? commentsResponse.data : []);

    const activityResponse = await apiRequest<{ data: Activity[] }>(`/issues/${issueId}/activity?limit=20`);
    setActivity(Array.isArray(activityResponse.data?.data) ? activityResponse.data.data : []);

    setLoading(false);
  }, [issueId, projectKey, workspaceSlug]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, [load]);

  const availableAssignees = useMemo(
    () =>
      members
        .map((member) => member.user)
        .filter((member) => !(issue?.assignees ?? []).some((assignee) => assignee.id === member.id)),
    [issue?.assignees, members],
  );

  const availableLabels = useMemo(
    () => projectLabels.filter((candidate) => !(issue?.labels ?? []).some((label) => label.id === candidate.id)),
    [issue?.labels, projectLabels],
  );

  async function addComment() {
    await apiRequest(`/issues/${issueId}/comments`, {
      method: "POST",
      body: JSON.stringify({ body: commentBody }),
    });
    setCommentBody("");
    await load();
  }

  async function saveIssue() {
    if (!issue || saving) return;

    setSaving(true);
    const response = await apiRequest(`/issues/${issue.id}`, {
      method: "PATCH",
      body: JSON.stringify({
        title: newTitle,
        description: newDescription,
        type: newType,
        priority: newPriority,
      }),
    });
    setSaving(false);
    setMessage(response.ok ? "Issue updated" : "Could not update issue");
    await load();
  }

  async function addAssignee() {
    if (!assigneeUserId || !issue) return;
    const response = await apiRequest(`/issues/${issue.id}/assignees`, {
      method: "POST",
      body: JSON.stringify({ userId: assigneeUserId }),
    });
    setMessage(response.ok ? "Assignee added" : "Could not add assignee");
    setAssigneeUserId("");
    await load();
  }

  async function removeAssignee(userId: string) {
    if (!issue) return;
    const response = await apiRequest(`/issues/${issue.id}/assignees/${userId}`, {
      method: "DELETE",
    });
    setMessage(response.ok ? "Assignee removed" : "Could not remove assignee");
    await load();
  }

  async function addLabel() {
    if (!labelId || !issue) return;
    const response = await apiRequest(`/issues/${issue.id}/labels`, {
      method: "POST",
      body: JSON.stringify({ labelId }),
    });
    setMessage(response.ok ? "Label added" : "Could not add label");
    setLabelId("");
    await load();
  }

  async function removeLabel(currentLabelId: string) {
    if (!issue) return;
    const response = await apiRequest(`/issues/${issue.id}/labels/${currentLabelId}`, {
      method: "DELETE",
    });
    setMessage(response.ok ? "Label removed" : "Could not remove label");
    await load();
  }

  if (loading) {
    return (
      <AppFrame title="Issue" subtitle="Loading issue details...">
        <div className="surface rounded-2xl p-6">Please wait...</div>
      </AppFrame>
    );
  }

  if (!issue || !project || !workspace) {
    return (
      <AppFrame title="Issue not found" subtitle="This issue is unavailable.">
        <div className="surface rounded-2xl p-6">
          <Link href={`/workspaces/${workspaceSlug}/projects/${projectKey}/issues`}>Back to issues</Link>
        </div>
      </AppFrame>
    );
  }

  return (
    <AppFrame
      title={`#${issue.issueNumber} ${issue.title}`}
      subtitle={`${issue.type} - ${issue.priority}`}
      actions={
        <Link
          href={`/workspaces/${workspace.slug}/projects/${project.key}/issues`}
          className="brutal-button-secondary rounded-md px-4 py-2 text-sm"
        >
          Back to issues
        </Link>
      }
    >
      <div className="grid gap-4 xl:grid-cols-[1.4fr_1fr]">
        <div className="surface rounded-[14px] p-6">
          <h2 className="title-display text-2xl">Issue review</h2>
          <div className="mt-3 grid gap-2">
            <input
              value={newTitle}
              onChange={(event) => setNewTitle(event.target.value)}
              className="brutal-input rounded-md px-4 py-3"
            />
            <textarea
              value={newDescription}
              onChange={(event) => setNewDescription(event.target.value)}
              rows={6}
              className="brutal-input rounded-md px-4 py-3"
            />
            <div className="grid grid-cols-2 gap-2">
              <select
                value={newType}
                onChange={(event) => setNewType(event.target.value as "task" | "bug" | "story" | "chore")}
                className="brutal-input rounded-md px-4 py-3"
              >
                <option value="task">task</option>
                <option value="bug">bug</option>
                <option value="story">story</option>
                <option value="chore">chore</option>
              </select>
              <select
                value={newPriority}
                onChange={(event) =>
                  setNewPriority(event.target.value as "low" | "medium" | "high" | "critical")
                }
                className="brutal-input rounded-md px-4 py-3"
              >
                <option value="low">low</option>
                <option value="medium">medium</option>
                <option value="high">high</option>
                <option value="critical">critical</option>
              </select>
            </div>
            <button
              type="button"
              onClick={saveIssue}
              disabled={saving}
              className="brutal-button w-fit rounded-md px-4 py-2"
            >
              {saving ? "Saving..." : "Save issue"}
            </button>
          </div>

          <div className="mt-6">
            <h3 className="font-semibold">Comments</h3>
            <textarea
              value={commentBody}
              onChange={(event) => setCommentBody(event.target.value)}
              rows={4}
              className="brutal-input mt-2 w-full rounded-md px-4 py-3"
            />
            <button
              type="button"
              onClick={addComment}
              className="brutal-button mt-3 rounded-md px-4 py-2"
            >
              Post comment
            </button>
            <div className="mt-4 grid gap-2">
              {comments.map((comment) => (
                <div key={comment.id} className="sticker rounded-md bg-white px-4 py-3">
                  <p className="text-sm">{comment.body}</p>
                  <p className="mt-1 text-xs text-[var(--ink-2)]">
                    {comment.author.name} ({comment.author.email})
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-4">
          <div className="surface rounded-[14px] p-5">
            <h3 className="font-semibold">Assignees</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {issue.assignees.map((assignee) => (
                <button
                  type="button"
                  key={assignee.id}
                  onClick={() => removeAssignee(assignee.id)}
                  className="sticker rounded-full bg-white px-3 py-1 text-xs"
                >
                  {assignee.name} - remove
                </button>
              ))}
              {issue.assignees.length === 0 ? (
                <span className="text-xs text-[var(--ink-2)]">No assignees yet</span>
              ) : null}
            </div>
            <div className="mt-3 grid gap-2">
              <select
                value={assigneeUserId}
                onChange={(event) => setAssigneeUserId(event.target.value)}
                className="brutal-input rounded-md px-3 py-2"
              >
                <option value="">select member</option>
                {availableAssignees.map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.name} ({member.email})
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={addAssignee}
                className="brutal-button rounded-md px-3 py-2 text-sm"
              >
                Add assignee
              </button>
            </div>
          </div>

          <div className="surface rounded-[14px] p-5">
            <h3 className="font-semibold">Labels</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {issue.labels.map((currentLabel) => (
                <button
                  type="button"
                  key={currentLabel.id}
                  onClick={() => removeLabel(currentLabel.id)}
                  className="rounded-full border-2 px-3 py-1 text-xs"
                  style={{
                    backgroundColor: `${currentLabel.color}22`,
                    borderColor: `${currentLabel.color}66`,
                  }}
                >
                  {currentLabel.name} - remove
                </button>
              ))}
              {issue.labels.length === 0 ? (
                <span className="text-xs text-[var(--ink-2)]">No labels yet</span>
              ) : null}
            </div>
            <div className="mt-3 grid gap-2">
              <select
                value={labelId}
                onChange={(event) => setLabelId(event.target.value)}
                className="brutal-input rounded-md px-3 py-2"
              >
                <option value="">select label</option>
                {availableLabels.map((candidate) => (
                  <option key={candidate.id} value={candidate.id}>
                    {candidate.name}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={addLabel}
                className="brutal-button rounded-md px-3 py-2 text-sm"
              >
                Add label
              </button>
            </div>
          </div>

          <div className="surface rounded-[14px] p-5">
            <h3 className="font-semibold">Activity</h3>
            <div className="mt-3 grid gap-2">
              {activity.map((event) => (
                <div key={event.id} className="sticker rounded-md bg-white px-3 py-2">
                  <p className="text-sm font-semibold">{event.eventType}</p>
                  <p className="mt-1 text-xs text-[var(--ink-2)]">
                    {event.actor.name} - {new Date(event.createdAt).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {message ? <p className="mt-4 text-sm text-[var(--ink-2)]">{message}</p> : null}
    </AppFrame>
  );
}
