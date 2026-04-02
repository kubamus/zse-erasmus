"use client";

import { useState } from "react";
import { authClient } from "@/lib/authClient";

function pretty(value: unknown) {
  return JSON.stringify(value, null, 2);
}

export default function TestIssuesPage() {
  const session = authClient.useSession();
  const [projectId, setProjectId] = useState("");
  const [issueId, setIssueId] = useState("");
  const [boardId, setBoardId] = useState("");
  const [columnId, setColumnId] = useState("");
  const [targetUserId, setTargetUserId] = useState("");
  const [labelId, setLabelId] = useState("");
  const [title, setTitle] = useState("Fix login");
  const [type, setType] = useState<"task" | "bug" | "story" | "chore">("bug");
  const [priority, setPriority] = useState<"low" | "medium" | "high" | "critical">("high");
  const [position, setPosition] = useState("3000");
  const [result, setResult] = useState("Run an action to see output");
  const [loading, setLoading] = useState(false);

  async function runAction(action: () => Promise<Response>) {
    setLoading(true);
    try {
      const response = await action();
      const text = await response.text();
      const body = text ? JSON.parse(text) : null;
      if (response.ok && body?.id) {
        setIssueId(body.id as string);
      }
      setResult(pretty({ status: response.status, ok: response.ok, body }));
    } catch (error) {
      setResult(pretty({ error: error instanceof Error ? error.message : String(error) }));
    } finally {
      setLoading(false);
    }
  }

  const parsedPosition = Number(position);

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-10">
      <h1 className="text-3xl font-semibold">Test Issues API</h1>
      <p className="mt-2 text-sm opacity-80">
        Current user: {session.data?.user?.email ?? "not signed in"}
      </p>

      <section className="mt-6 grid gap-3 rounded-xl border border-black/10 p-4 sm:grid-cols-2">
        <input className="rounded-md border border-black/20 px-3 py-2" value={projectId} onChange={(event) => setProjectId(event.target.value)} placeholder="projectId" />
        <input className="rounded-md border border-black/20 px-3 py-2" value={issueId} onChange={(event) => setIssueId(event.target.value)} placeholder="issueId" />
        <input className="rounded-md border border-black/20 px-3 py-2" value={boardId} onChange={(event) => setBoardId(event.target.value)} placeholder="boardId" />
        <input className="rounded-md border border-black/20 px-3 py-2" value={columnId} onChange={(event) => setColumnId(event.target.value)} placeholder="columnId" />
        <input className="rounded-md border border-black/20 px-3 py-2" value={targetUserId} onChange={(event) => setTargetUserId(event.target.value)} placeholder="userId for assignees" />
        <input className="rounded-md border border-black/20 px-3 py-2" value={labelId} onChange={(event) => setLabelId(event.target.value)} placeholder="labelId" />
        <input className="rounded-md border border-black/20 px-3 py-2" value={title} onChange={(event) => setTitle(event.target.value)} placeholder="issue title" />
        <input className="rounded-md border border-black/20 px-3 py-2" value={position} onChange={(event) => setPosition(event.target.value)} placeholder="position" />
        <select className="rounded-md border border-black/20 px-3 py-2" value={type} onChange={(event) => setType(event.target.value as "task" | "bug" | "story" | "chore")}> <option value="task">task</option><option value="bug">bug</option><option value="story">story</option><option value="chore">chore</option></select>
        <select className="rounded-md border border-black/20 px-3 py-2" value={priority} onChange={(event) => setPriority(event.target.value as "low" | "medium" | "high" | "critical")}> <option value="low">low</option><option value="medium">medium</option><option value="high">high</option><option value="critical">critical</option></select>
      </section>

      <section className="mt-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        <button type="button" className="rounded-md border border-black/20 px-4 py-2 text-left" disabled={loading || !projectId} onClick={() => runAction(() => fetch(`/api/projects/${projectId}/issues`, { method: "GET" }))}>GET /api/projects/{"{projectId}"}/issues</button>
        <button type="button" className="rounded-md border border-black/20 px-4 py-2 text-left" disabled={loading || !projectId || !boardId || !columnId} onClick={() => runAction(() => fetch(`/api/projects/${projectId}/issues`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ boardId, columnId, title, type, priority }) }))}>POST /api/projects/{"{projectId}"}/issues</button>
        <button type="button" className="rounded-md border border-black/20 px-4 py-2 text-left" disabled={loading || !issueId} onClick={() => runAction(() => fetch(`/api/issues/${issueId}`, { method: "GET" }))}>GET /api/issues/{"{issueId}"}</button>
        <button type="button" className="rounded-md border border-black/20 px-4 py-2 text-left" disabled={loading || !issueId} onClick={() => runAction(() => fetch(`/api/issues/${issueId}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ title, type, priority }) }))}>PATCH /api/issues/{"{issueId}"}</button>
        <button type="button" className="rounded-md border border-black/20 px-4 py-2 text-left" disabled={loading || !issueId} onClick={() => runAction(() => fetch(`/api/issues/${issueId}/move`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ toColumnId: columnId, position: Number.isNaN(parsedPosition) ? 3000 : parsedPosition }) }))}>POST /api/issues/{"{issueId}"}/move</button>
        <button type="button" className="rounded-md border border-black/20 px-4 py-2 text-left" disabled={loading || !issueId || !targetUserId} onClick={() => runAction(() => fetch(`/api/issues/${issueId}/assignees`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ userId: targetUserId }) }))}>POST /api/issues/{"{issueId}"}/assignees</button>
        <button type="button" className="rounded-md border border-black/20 px-4 py-2 text-left" disabled={loading || !issueId} onClick={() => runAction(() => fetch(`/api/issues/${issueId}/assignees`, { method: "GET" }))}>GET /api/issues/{"{issueId}"}/assignees</button>
        <button type="button" className="rounded-md border border-black/20 px-4 py-2 text-left" disabled={loading || !issueId || !targetUserId} onClick={() => runAction(() => fetch(`/api/issues/${issueId}/assignees/${targetUserId}`, { method: "DELETE" }))}>DELETE /api/issues/{"{issueId}"}/assignees/{"{userId}"}</button>
        <button type="button" className="rounded-md border border-black/20 px-4 py-2 text-left" disabled={loading || !issueId || !labelId} onClick={() => runAction(() => fetch(`/api/issues/${issueId}/labels`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ labelId }) }))}>POST /api/issues/{"{issueId}"}/labels</button>
        <button type="button" className="rounded-md border border-black/20 px-4 py-2 text-left" disabled={loading || !issueId} onClick={() => runAction(() => fetch(`/api/issues/${issueId}/labels`, { method: "GET" }))}>GET /api/issues/{"{issueId}"}/labels</button>
        <button type="button" className="rounded-md border border-black/20 px-4 py-2 text-left" disabled={loading || !issueId || !labelId} onClick={() => runAction(() => fetch(`/api/issues/${issueId}/labels/${labelId}`, { method: "DELETE" }))}>DELETE /api/issues/{"{issueId}"}/labels/{"{labelId}"}</button>
        <button type="button" className="rounded-md border border-black/20 px-4 py-2 text-left" disabled={loading || !issueId} onClick={() => runAction(() => fetch(`/api/issues/${issueId}`, { method: "DELETE" }))}>DELETE /api/issues/{"{issueId}"}</button>
      </section>

      <pre className="mt-8 overflow-x-auto rounded-xl border border-black/10 bg-black/5 p-4 text-xs">{result}</pre>
    </main>
  );
}
