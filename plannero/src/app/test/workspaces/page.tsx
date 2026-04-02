"use client";

import { useState } from "react";

type Workspace = {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
};

function pretty(value: unknown) {
  return JSON.stringify(value, null, 2);
}

export default function WorkspaceTestPage() {
  const [workspaceId, setWorkspaceId] = useState("");
  const [workspaceName, setWorkspaceName] = useState("Engineering");
  const [renameValue, setRenameValue] = useState("Engineering Team");
  const [lastCreated, setLastCreated] = useState<Workspace | null>(null);
  const [result, setResult] = useState("Run an action to see output");
  const [loading, setLoading] = useState(false);

  async function runAction(action: () => Promise<Response>) {
    setLoading(true);
    try {
      const response = await action();
      const text = await response.text();
      const body = text ? JSON.parse(text) : null;

      if (response.ok && body?.id) {
        setLastCreated(body);
        setWorkspaceId(body.id);
      }

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
      <h1 className="text-3xl font-semibold">Test /workspaces</h1>
      <p className="mt-2 text-sm opacity-80">
        Validates: list, create, get by id, update, archive.
      </p>

      <section className="mt-8 grid gap-4 rounded-xl border border-black/10 p-4">
        <h2 className="text-lg font-medium">Inputs</h2>

        <label className="grid gap-1 text-sm">
          <span>Workspace Name (for create)</span>
          <input
            className="rounded-md border border-black/20 px-3 py-2"
            value={workspaceName}
            onChange={(event) => setWorkspaceName(event.target.value)}
          />
        </label>

        <label className="grid gap-1 text-sm">
          <span>Workspace ID (for get/update/delete)</span>
          <input
            className="rounded-md border border-black/20 px-3 py-2"
            value={workspaceId}
            onChange={(event) => setWorkspaceId(event.target.value)}
            placeholder="uuid"
          />
        </label>

        <label className="grid gap-1 text-sm">
          <span>New Name (for update)</span>
          <input
            className="rounded-md border border-black/20 px-3 py-2"
            value={renameValue}
            onChange={(event) => setRenameValue(event.target.value)}
          />
        </label>
      </section>

      <section className="mt-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        <button
          type="button"
          className="rounded-md border border-black/20 px-4 py-2 text-left"
          disabled={loading}
          onClick={() => runAction(() => fetch("/api/workspaces", { method: "GET" }))}
        >
          GET /api/workspaces
        </button>
        <button
          type="button"
          className="rounded-md border border-black/20 px-4 py-2 text-left"
          disabled={loading}
          onClick={() =>
            runAction(() =>
              fetch("/api/workspaces", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: workspaceName }),
              }),
            )
          }
        >
          POST /api/workspaces
        </button>
        <button
          type="button"
          className="rounded-md border border-black/20 px-4 py-2 text-left"
          disabled={loading || !workspaceId}
          onClick={() => runAction(() => fetch(`/api/workspaces/${workspaceId}`, { method: "GET" }))}
        >
          GET /api/workspaces/{"{workspaceId}"}
        </button>
        <button
          type="button"
          className="rounded-md border border-black/20 px-4 py-2 text-left"
          disabled={loading || !workspaceId}
          onClick={() =>
            runAction(() =>
              fetch(`/api/workspaces/${workspaceId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: renameValue }),
              }),
            )
          }
        >
          PATCH /api/workspaces/{"{workspaceId}"}
        </button>
        <button
          type="button"
          className="rounded-md border border-black/20 px-4 py-2 text-left"
          disabled={loading || !workspaceId}
          onClick={() =>
            runAction(() => fetch(`/api/workspaces/${workspaceId}`, { method: "DELETE" }))
          }
        >
          DELETE /api/workspaces/{"{workspaceId}"}
        </button>
      </section>

      <section className="mt-8 grid gap-4">
        <h2 className="text-lg font-medium">Example curl usage</h2>
        <pre className="overflow-x-auto rounded-xl border border-black/10 bg-black/5 p-4 text-xs">
{`# list workspaces
curl -i http://localhost:3000/api/workspaces

# create workspace
curl -i -X POST http://localhost:3000/api/workspaces \\
  -H 'Content-Type: application/json' \\
  -d '{"name":"Engineering"}'

# get workspace by id
curl -i http://localhost:3000/api/workspaces/${workspaceId || "<workspace-id>"}

# update workspace name
curl -i -X PATCH http://localhost:3000/api/workspaces/${workspaceId || "<workspace-id>"} \\
  -H 'Content-Type: application/json' \\
  -d '{"name":"Engineering Team"}'

# archive workspace
curl -i -X DELETE http://localhost:3000/api/workspaces/${workspaceId || "<workspace-id>"}`}
        </pre>
      </section>

      <section className="mt-8 grid gap-2">
        <h2 className="text-lg font-medium">Last created workspace</h2>
        <pre className="overflow-x-auto rounded-xl border border-black/10 bg-black/5 p-4 text-xs">
          {pretty(lastCreated)}
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
