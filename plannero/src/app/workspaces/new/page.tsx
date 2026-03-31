"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { AppFrame } from "@/components/app-frame";

export default function NewWorkspacePage() {
  const router = useRouter();
  const [name, setName] = useState("Product Studio");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const response = await fetch("/api/workspaces", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });

    const payload = await response.json().catch(() => null);

    if (!response.ok) {
      setError(payload?.message ?? "Could not create workspace");
      setLoading(false);
      return;
    }

    router.push(`/workspaces/${payload.slug}`);
    router.refresh();
  }

  return (
    <AppFrame title="Create Workspace" subtitle="Start a dedicated space for your team.">
      <form onSubmit={submit} className="surface max-w-xl rounded-2xl p-6">
        <label htmlFor="workspace-name" className="text-sm text-[var(--ink-2)]">
          Workspace name
        </label>
        <input
          id="workspace-name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="mt-2 w-full rounded-xl border border-[var(--line)] bg-white/80 px-4 py-3"
          minLength={2}
          maxLength={80}
          required
        />
        {error ? <p className="mt-3 text-sm text-red-700">{error}</p> : null}
        <button
          type="submit"
          disabled={loading}
          className="mt-5 rounded-xl bg-[var(--accent-2)] px-4 py-2 text-white disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create Workspace"}
        </button>
      </form>
    </AppFrame>
  );
}
