"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { AppFrame } from "@/components/app-frame";
import { apiRequest } from "@/lib/client-api";

type Issue = {
  id: string;
  issueNumber: number;
  title: string;
  description?: string | null;
  priority: "low" | "medium" | "high" | "critical";
  type: "task" | "bug" | "story" | "chore";
  assignees?: Array<{ id: string; name: string; email: string }>;
  labels?: Array<{ id: string; name: string; color: string }>;
};
type Comment = {
  id: string;
  body: string;
  author: { name: string; email: string };
};
type Activity = {
  id: string;
  eventType: string;
  actor: { name: string; email: string };
  createdAt: string;
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
  const [issue, setIssue] = useState<Issue | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [activity, setActivity] = useState<Activity[]>([]);
  const [commentBody, setCommentBody] = useState("Need QA validation.");
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newType, setNewType] = useState<"task" | "bug" | "story" | "chore">("task");
  const [newPriority, setNewPriority] = useState<"low" | "medium" | "high" | "critical">(
    "medium",
  );
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
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
  }, [issueId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, [load]);

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
    await apiRequest(`/issues/${issue.id}`, {
      method: "PATCH",
      body: JSON.stringify({
        title: newTitle,
        description: newDescription,
        type: newType,
        priority: newPriority,
      }),
    });
    setSaving(false);
    await load();
  }

  if (loading) {
    return (
      <AppFrame title="Issue" subtitle="Loading issue details...">
        <div className="card rounded-2xl p-6">Please wait...</div>
      </AppFrame>
    );
  }

  if (!issue) {
    return (
      <AppFrame title="Issue not found" subtitle="This issue is unavailable.">
        <div className="card rounded-2xl p-6">
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
          href={`/workspaces/${workspaceSlug}/projects/${projectKey}/issues`}
          className="rounded-xl border border-[var(--line)] px-4 py-2 text-sm"
        >
          Back to issues
        </Link>
      }
    >
      <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
        <div className="card rounded-2xl p-6">
          <h2 className="title-display text-2xl">Description</h2>
          <div className="mt-3 grid gap-2">
            <input
              value={newTitle}
              onChange={(event) => setNewTitle(event.target.value)}
              className="rounded-xl border border-[var(--line)] bg-white/80 px-4 py-3"
            />
            <textarea
              value={newDescription}
              onChange={(event) => setNewDescription(event.target.value)}
              rows={5}
              className="rounded-xl border border-[var(--line)] bg-white/80 px-4 py-3"
            />
            <div className="grid grid-cols-2 gap-2">
              <select
                value={newType}
                onChange={(event) =>
                  setNewType(event.target.value as "task" | "bug" | "story" | "chore")
                }
                className="rounded-xl border border-[var(--line)] bg-white/80 px-4 py-3"
              >
                <option value="task">task</option>
                <option value="bug">bug</option>
                <option value="story">story</option>
                <option value="chore">chore</option>
              </select>
              <select
                value={newPriority}
                onChange={(event) =>
                  setNewPriority(
                    event.target.value as "low" | "medium" | "high" | "critical",
                  )
                }
                className="rounded-xl border border-[var(--line)] bg-white/80 px-4 py-3"
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
              className="w-fit rounded-xl bg-[var(--accent-1)] px-4 py-2 text-white disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save issue"}
            </button>
          </div>

          <div className="mt-6 rounded-xl border border-[var(--line)] bg-white/70 p-4">
            <h3 className="font-semibold">Assignees</h3>
            <div className="mt-2 flex flex-wrap gap-2">
              {(issue.assignees ?? []).map((assignee) => (
                <span
                  key={assignee.id}
                  className="rounded-full border border-[var(--line)] bg-white px-3 py-1 text-xs"
                >
                  {assignee.name}
                </span>
              ))}
              {(issue.assignees ?? []).length === 0 ? (
                <span className="text-xs text-[#574d45]">No assignees yet</span>
              ) : null}
            </div>
            <h3 className="mt-4 font-semibold">Labels</h3>
            <div className="mt-2 flex flex-wrap gap-2">
              {(issue.labels ?? []).map((label) => (
                <span
                  key={label.id}
                  className="rounded-full border border-[var(--line)] px-3 py-1 text-xs"
                  style={{ backgroundColor: `${label.color}22`, borderColor: `${label.color}66` }}
                >
                  {label.name}
                </span>
              ))}
              {(issue.labels ?? []).length === 0 ? (
                <span className="text-xs text-[#574d45]">No labels yet</span>
              ) : null}
            </div>
          </div>

          <div className="mt-6">
            <h3 className="font-semibold">Add comment</h3>
            <textarea
              value={commentBody}
              onChange={(event) => setCommentBody(event.target.value)}
              rows={4}
              className="mt-2 w-full rounded-xl border border-[var(--line)] bg-white/80 px-4 py-3"
            />
            <button
              type="button"
              onClick={addComment}
              className="mt-3 rounded-xl bg-[var(--accent-2)] px-4 py-2 text-white"
            >
              Post comment
            </button>
          </div>
          <div className="mt-6 grid gap-2">
            {comments.map((comment) => (
              <div key={comment.id} className="rounded-xl border border-[var(--line)] bg-white/70 px-4 py-3">
                <p className="text-sm">{comment.body}</p>
                <p className="mt-1 text-xs text-[#574d45]">
                  {comment.author.name} ({comment.author.email})
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="card rounded-2xl p-6">
          <h2 className="title-display text-2xl">Activity</h2>
          <div className="mt-4 grid gap-2">
            {activity.map((event) => (
              <div key={event.id} className="rounded-xl border border-[var(--line)] bg-white/70 px-4 py-3">
                <p className="text-sm font-semibold">{event.eventType}</p>
                <p className="mt-1 text-xs text-[#574d45]">
                  {event.actor.name} - {new Date(event.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppFrame>
  );
}
