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
        <div className="card rounded-2xl p-6 text-sm text-[#574d45]">Loading workspaces...</div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((workspace) => (
            <Link
              key={workspace.id}
              href={`/workspaces/${workspace.slug}`}
              className="card rounded-2xl p-5 transition hover:-translate-y-0.5"
            >
              <p className="text-xs uppercase tracking-[0.18em] text-[#574d45]">Workspace</p>
              <h2 className="title-display mt-2 text-2xl">{workspace.name}</h2>
              <p className="mt-2 text-sm text-[#574d45]">/{workspace.slug}</p>
            </Link>
          ))}
          {items.length === 0 ? (
            <div className="card rounded-2xl p-6 text-sm text-[#574d45]">No workspaces yet. Create one.</div>
          ) : null}
        </div>
      )}
    </AppFrame>
  );
}
