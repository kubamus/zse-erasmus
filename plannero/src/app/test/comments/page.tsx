"use client";

import { useState } from "react";
import { authClient } from "@/lib/authClient";

function pretty(value: unknown) {
  return JSON.stringify(value, null, 2);
}

export default function TestCommentsPage() {
  const session = authClient.useSession();
  const [issueId, setIssueId] = useState("");
  const [commentId, setCommentId] = useState("");
  const [body, setBody] = useState("This needs an integration test.");
  const [result, setResult] = useState("Run an action to see output");
  const [loading, setLoading] = useState(false);

  async function runAction(action: () => Promise<Response>) {
    setLoading(true);
    try {
      const response = await action();
      const text = await response.text();
      const payload = text ? JSON.parse(text) : null;
      if (response.ok && payload?.id) {
        setCommentId(payload.id as string);
      }
      setResult(pretty({ status: response.status, ok: response.ok, body: payload }));
    } catch (error) {
      setResult(pretty({ error: error instanceof Error ? error.message : String(error) }));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-10">
      <h1 className="text-3xl font-semibold">Test Comments API</h1>
      <p className="mt-2 text-sm opacity-80">
        Current user: {session.data?.user?.email ?? "not signed in"}
      </p>

      <section className="mt-6 grid gap-3 rounded-xl border border-black/10 p-4">
        <input className="rounded-md border border-black/20 px-3 py-2" value={issueId} onChange={(event) => setIssueId(event.target.value)} placeholder="issueId" />
        <input className="rounded-md border border-black/20 px-3 py-2" value={commentId} onChange={(event) => setCommentId(event.target.value)} placeholder="commentId" />
        <textarea className="rounded-md border border-black/20 px-3 py-2" value={body} onChange={(event) => setBody(event.target.value)} placeholder="comment body" rows={4} />
      </section>

      <section className="mt-6 grid gap-2 sm:grid-cols-2">
        <button type="button" className="rounded-md border border-black/20 px-4 py-2 text-left" disabled={loading || !issueId} onClick={() => runAction(() => fetch(`/api/issues/${issueId}/comments`, { method: "GET" }))}>GET /api/issues/{"{issueId}"}/comments</button>
        <button type="button" className="rounded-md border border-black/20 px-4 py-2 text-left" disabled={loading || !issueId} onClick={() => runAction(() => fetch(`/api/issues/${issueId}/comments`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ body }) }))}>POST /api/issues/{"{issueId}"}/comments</button>
        <button type="button" className="rounded-md border border-black/20 px-4 py-2 text-left" disabled={loading || !commentId} onClick={() => runAction(() => fetch(`/api/comments/${commentId}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ body }) }))}>PATCH /api/comments/{"{commentId}"}</button>
        <button type="button" className="rounded-md border border-black/20 px-4 py-2 text-left" disabled={loading || !commentId} onClick={() => runAction(() => fetch(`/api/comments/${commentId}`, { method: "DELETE" }))}>DELETE /api/comments/{"{commentId}"}</button>
      </section>

      <pre className="mt-8 overflow-x-auto rounded-xl border border-black/10 bg-black/5 p-4 text-xs">{result}</pre>
    </main>
  );
}
