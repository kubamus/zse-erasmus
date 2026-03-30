"use client";

import { useState } from "react";
import { authClient } from "@/lib/authClient";

function pretty(value: unknown) {
  return JSON.stringify(value, null, 2);
}

export default function TestColumnsPage() {
  const session = authClient.useSession();
  const [boardId, setBoardId] = useState("");
  const [columnId, setColumnId] = useState("");
  const [name, setName] = useState("To Do");
  const [position, setPosition] = useState("1000");
  const [wipLimit, setWipLimit] = useState("5");
  const [isDoneColumn, setIsDoneColumn] = useState(false);
  const [result, setResult] = useState("Run an action to see output");
  const [loading, setLoading] = useState(false);

  async function runAction(action: () => Promise<Response>) {
    setLoading(true);
    try {
      const response = await action();
      const text = await response.text();
      const body = text ? JSON.parse(text) : null;
      if (response.ok && body?.id) {
        setColumnId(body.id as string);
      }
      setResult(pretty({ status: response.status, ok: response.ok, body }));
    } catch (error) {
      setResult(pretty({ error: error instanceof Error ? error.message : String(error) }));
    } finally {
      setLoading(false);
    }
  }

  const parsedPosition = Number(position);
  const parsedWipLimit = wipLimit ? Number(wipLimit) : null;

  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-10">
      <h1 className="text-3xl font-semibold">Test Columns API</h1>
      <p className="mt-2 text-sm opacity-80">
        Current user: {session.data?.user?.email ?? "not signed in"}
      </p>

      <section className="mt-6 grid gap-3 rounded-xl border border-black/10 p-4">
        <input
          className="rounded-md border border-black/20 px-3 py-2"
          value={boardId}
          onChange={(event) => setBoardId(event.target.value)}
          placeholder="boardId"
        />
        <input
          className="rounded-md border border-black/20 px-3 py-2"
          value={columnId}
          onChange={(event) => setColumnId(event.target.value)}
          placeholder="columnId"
        />
        <input
          className="rounded-md border border-black/20 px-3 py-2"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="column name"
        />
        <input
          className="rounded-md border border-black/20 px-3 py-2"
          value={position}
          onChange={(event) => setPosition(event.target.value)}
          placeholder="position"
        />
        <input
          className="rounded-md border border-black/20 px-3 py-2"
          value={wipLimit}
          onChange={(event) => setWipLimit(event.target.value)}
          placeholder="wipLimit (optional)"
        />
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={isDoneColumn}
            onChange={(event) => setIsDoneColumn(event.target.checked)}
          />
          isDoneColumn
        </label>
      </section>

      <section className="mt-6 grid gap-2 sm:grid-cols-2">
        <button
          type="button"
          className="rounded-md border border-black/20 px-4 py-2 text-left"
          disabled={loading || !boardId}
          onClick={() => runAction(() => fetch(`/api/boards/${boardId}/columns`, { method: "GET" }))}
        >
          GET /api/boards/{"{boardId}"}/columns
        </button>
        <button
          type="button"
          className="rounded-md border border-black/20 px-4 py-2 text-left"
          disabled={loading || !boardId || Number.isNaN(parsedPosition)}
          onClick={() =>
            runAction(() =>
              fetch(`/api/boards/${boardId}/columns`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  name,
                  position: parsedPosition,
                  wipLimit: Number.isNaN(parsedWipLimit ?? 0) ? null : parsedWipLimit,
                  isDoneColumn,
                }),
              }),
            )
          }
        >
          POST /api/boards/{"{boardId}"}/columns
        </button>
        <button
          type="button"
          className="rounded-md border border-black/20 px-4 py-2 text-left"
          disabled={loading || !columnId || Number.isNaN(parsedPosition)}
          onClick={() =>
            runAction(() =>
              fetch(`/api/columns/${columnId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  name,
                  position: parsedPosition,
                  wipLimit: Number.isNaN(parsedWipLimit ?? 0) ? null : parsedWipLimit,
                  isDoneColumn,
                }),
              }),
            )
          }
        >
          PATCH /api/columns/{"{columnId}"}
        </button>
        <button
          type="button"
          className="rounded-md border border-black/20 px-4 py-2 text-left"
          disabled={loading || !columnId}
          onClick={() => runAction(() => fetch(`/api/columns/${columnId}`, { method: "DELETE" }))}
        >
          DELETE /api/columns/{"{columnId}"}
        </button>
      </section>

      <pre className="mt-8 overflow-x-auto rounded-xl border border-black/10 bg-black/5 p-4 text-xs">
        {result}
      </pre>
    </main>
  );
}
