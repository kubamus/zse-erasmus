"use client";

import { useState } from "react";
import { authClient } from "@/lib/authClient";

function pretty(value: unknown) {
  return JSON.stringify(value, null, 2);
}

export default function TestProjectsPage() {
  const session = authClient.useSession();
  const [workspaceId, setWorkspaceId] = useState("");
  const [projectId, setProjectId] = useState("");
  const [key, setKey] = useState("APP");
  const [name, setName] = useState("Application");
  const [description, setDescription] = useState("Main app");
  const [result, setResult] = useState("Run an action to see output");
  const [loading, setLoading] = useState(false);

  async function runAction(action: () => Promise<Response>) {
    setLoading(true);
    try {
      const response = await action();
      const text = await response.text();
      const body = text ? JSON.parse(text) : null;
      if (response.ok && body?.id) {
        setProjectId(body.id as string);
      }
      setResult(pretty({ status: response.status, ok: response.ok, body }));
    } catch (error) {
      setResult(pretty({ error: error instanceof Error ? error.message : String(error) }));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-10">
      <h1 className="text-3xl font-semibold">Test Projects API</h1>
      <p className="mt-2 text-sm opacity-80">
        Current user: {session.data?.user?.email ?? "not signed in"}
      </p>

      <section className="mt-6 grid gap-3 rounded-xl border border-black/10 p-4">
        <input
          className="rounded-md border border-black/20 px-3 py-2"
          value={workspaceId}
          onChange={(event) => setWorkspaceId(event.target.value)}
          placeholder="workspaceId"
        />
        <input
          className="rounded-md border border-black/20 px-3 py-2"
          value={projectId}
          onChange={(event) => setProjectId(event.target.value)}
          placeholder="projectId"
        />
        <input
          className="rounded-md border border-black/20 px-3 py-2"
          value={key}
          onChange={(event) => setKey(event.target.value)}
          placeholder="project key"
        />
        <input
          className="rounded-md border border-black/20 px-3 py-2"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="project name"
        />
        <input
          className="rounded-md border border-black/20 px-3 py-2"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="project description"
        />
      </section>

      <section className="mt-6 grid gap-2 sm:grid-cols-2">
        <button
          type="button"
          className="rounded-md border border-black/20 px-4 py-2 text-left"
          disabled={loading || !workspaceId}
          onClick={() =>
            runAction(() => fetch(`/api/workspaces/${workspaceId}/projects`, { method: "GET" }))
          }
        >
          GET /api/workspaces/{"{workspaceId}"}/projects
        </button>
        <button
          type="button"
          className="rounded-md border border-black/20 px-4 py-2 text-left"
          disabled={loading || !workspaceId}
          onClick={() =>
            runAction(() =>
              fetch(`/api/workspaces/${workspaceId}/projects`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ key, name, description }),
              }),
            )
          }
        >
          POST /api/workspaces/{"{workspaceId}"}/projects
        </button>
        <button
          type="button"
          className="rounded-md border border-black/20 px-4 py-2 text-left"
          disabled={loading || !projectId}
          onClick={() => runAction(() => fetch(`/api/projects/${projectId}`, { method: "GET" }))}
        >
          GET /api/projects/{"{projectId}"}
        </button>
        <button
          type="button"
          className="rounded-md border border-black/20 px-4 py-2 text-left"
          disabled={loading || !projectId}
          onClick={() =>
            runAction(() =>
              fetch(`/api/projects/${projectId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, description }),
              }),
            )
          }
        >
          PATCH /api/projects/{"{projectId}"}
        </button>
        <button
          type="button"
          className="rounded-md border border-black/20 px-4 py-2 text-left"
          disabled={loading || !projectId}
          onClick={() => runAction(() => fetch(`/api/projects/${projectId}`, { method: "DELETE" }))}
        >
          DELETE /api/projects/{"{projectId}"}
        </button>
      </section>

      <pre className="mt-8 overflow-x-auto rounded-xl border border-black/10 bg-black/5 p-4 text-xs">
        {result}
      </pre>
    </main>
  );
}
