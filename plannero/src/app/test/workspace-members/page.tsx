"use client";

import { useState } from "react";

function pretty(value: unknown) {
  return JSON.stringify(value, null, 2);
}

export default function WorkspaceMembersTestPage() {
  const [workspaceId, setWorkspaceId] = useState("");
  const [targetUserId, setTargetUserId] = useState("");
  const [role, setRole] = useState<"owner" | "admin" | "member">("member");
  const [result, setResult] = useState("Run an action to see output");
  const [loading, setLoading] = useState(false);

  async function runAction(action: () => Promise<Response>) {
    setLoading(true);
    try {
      const response = await action();
      const text = await response.text();
      const body = text ? JSON.parse(text) : null;

      setResult(
        pretty({
          status: response.status,
          ok: response.ok,
          body,
        }),
      );
    } catch (error) {
      setResult(pretty({ error: error instanceof Error ? error.message : String(error) }));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-10">
      <h1 className="text-3xl font-semibold">Test /workspaces/:workspaceId/members</h1>
      <p className="mt-2 text-sm opacity-80">
        Validates: list members, add member, update role, remove member.
      </p>

      <section className="mt-8 grid gap-4 rounded-xl border border-black/10 p-4">
        <h2 className="text-lg font-medium">Inputs</h2>

        <label className="grid gap-1 text-sm">
          <span>Workspace ID</span>
          <input
            className="rounded-md border border-black/20 px-3 py-2"
            value={workspaceId}
            onChange={(event) => setWorkspaceId(event.target.value)}
            placeholder="workspace uuid"
          />
        </label>

        <label className="grid gap-1 text-sm">
          <span>Target User ID</span>
          <input
            className="rounded-md border border-black/20 px-3 py-2"
            value={targetUserId}
            onChange={(event) => setTargetUserId(event.target.value)}
            placeholder="user uuid"
          />
        </label>

        <label className="grid gap-1 text-sm">
          <span>Role</span>
          <select
            className="rounded-md border border-black/20 px-3 py-2"
            value={role}
            onChange={(event) => setRole(event.target.value as "owner" | "admin" | "member")}
          >
            <option value="owner">owner</option>
            <option value="admin">admin</option>
            <option value="member">member</option>
          </select>
        </label>
      </section>

      <section className="mt-6 grid gap-2 sm:grid-cols-2">
        <button
          type="button"
          className="rounded-md border border-black/20 px-4 py-2 text-left"
          disabled={loading || !workspaceId}
          onClick={() =>
            runAction(() => fetch(`/api/workspaces/${workspaceId}/members`, { method: "GET" }))
          }
        >
          GET /api/workspaces/{"{workspaceId}"}/members
        </button>

        <button
          type="button"
          className="rounded-md border border-black/20 px-4 py-2 text-left"
          disabled={loading || !workspaceId || !targetUserId}
          onClick={() =>
            runAction(() =>
              fetch(`/api/workspaces/${workspaceId}/members`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: targetUserId, role }),
              }),
            )
          }
        >
          POST /api/workspaces/{"{workspaceId}"}/members
        </button>

        <button
          type="button"
          className="rounded-md border border-black/20 px-4 py-2 text-left"
          disabled={loading || !workspaceId || !targetUserId}
          onClick={() =>
            runAction(() =>
              fetch(`/api/workspaces/${workspaceId}/members/${targetUserId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ role }),
              }),
            )
          }
        >
          PATCH /api/workspaces/{"{workspaceId}"}/members/{"{userId}"}
        </button>

        <button
          type="button"
          className="rounded-md border border-black/20 px-4 py-2 text-left"
          disabled={loading || !workspaceId || !targetUserId}
          onClick={() =>
            runAction(() =>
              fetch(`/api/workspaces/${workspaceId}/members/${targetUserId}`, {
                method: "DELETE",
              }),
            )
          }
        >
          DELETE /api/workspaces/{"{workspaceId}"}/members/{"{userId}"}
        </button>
      </section>

      <section className="mt-8 grid gap-4">
        <h2 className="text-lg font-medium">Example curl usage</h2>
        <pre className="overflow-x-auto rounded-xl border border-black/10 bg-black/5 p-4 text-xs">
{`# list members
curl -i http://localhost:3000/api/workspaces/${workspaceId || "<workspace-id>"}/members

# add member
curl -i -X POST http://localhost:3000/api/workspaces/${workspaceId || "<workspace-id>"}/members \\
  -H 'Content-Type: application/json' \\
  -d '{"userId":"${targetUserId || "<user-id>"}","role":"${role}"}'

# update member role
curl -i -X PATCH http://localhost:3000/api/workspaces/${workspaceId || "<workspace-id>"}/members/${targetUserId || "<user-id>"} \\
  -H 'Content-Type: application/json' \\
  -d '{"role":"admin"}'

# remove member
curl -i -X DELETE http://localhost:3000/api/workspaces/${workspaceId || "<workspace-id>"}/members/${targetUserId || "<user-id>"}`}
        </pre>
      </section>

      <section className="mt-8 grid gap-2">
        <h2 className="text-lg font-medium">Latest response</h2>
        <pre className="overflow-x-auto rounded-xl border border-black/10 bg-black/5 p-4 text-xs">
          {result}
        </pre>
      </section>
    </main>
  );
}
