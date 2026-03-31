"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AppFrame } from "@/components/app-frame";
import { authClient } from "@/lib/authClient";

type Workspace = {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
};

export default function WorkspacesPage() {
  const router = useRouter();
  const session = authClient.useSession();
  const [items, setItems] = useState<Workspace[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session.isPending) {
      return;
    }

    if (!session.data?.user?.id) {
      router.replace("/login");
      return;
    }

    fetch("/api/workspaces")
      .then((response) => response.json())
      .then((data) => setItems(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  }, [router, session.data?.user?.id, session.isPending]);

  return (
    <AppFrame
      title="Workspaces"
      subtitle="Pick your context and keep teams moving."
      actions={
        <Link href="/workspaces/new" className="rounded-xl bg-[var(--accent-1)] px-4 py-2 text-sm text-white">
          New Workspace
        </Link>
      }
    >
      {loading ? (
        <div className="surface rounded-3xl p-6 text-sm text-[var(--ink-2)]">Loading workspaces...</div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((workspace) => (
            <Link
              key={workspace.id}
              href={`/workspaces/${workspace.slug}`}
              className="surface group rounded-3xl p-6 transition"
            >
              <div className="flex items-center justify-between">
                <p className="text-xs uppercase tracking-[0.2em] text-[var(--ink-2)]">Workspace</p>
                <span className="soft-pill rounded-full px-2.5 py-1 text-[10px] uppercase tracking-[0.16em] text-[var(--ink-2)]">
                  Open
                </span>
              </div>
              <h2 className="title-display mt-3 text-3xl leading-tight">{workspace.name}</h2>
              <p className="mt-2 text-sm text-[var(--ink-2)]">/{workspace.slug}</p>
            </Link>
          ))}
          {items.length === 0 ? (
            <div className="surface rounded-3xl p-6 text-sm text-[var(--ink-2)]">No workspaces yet. Create one.</div>
          ) : null}
        </div>
      )}
    </AppFrame>
  );
}
