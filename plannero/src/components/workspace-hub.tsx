"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { AppFrame } from "@/components/app-frame";
import { apiRequest } from "@/lib/client-api";

type Workspace = {
  id: string;
  name: string;
  slug: string;
};

type WorkspaceHubProps = {
  workspaceSlug: string;
};

export function WorkspaceHub({ workspaceSlug }: WorkspaceHubProps) {
  const router = useRouter();
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiRequest<Workspace[]>("/workspaces").then((response) => {
      if (response.status === 401) {
        router.replace("/login");
        return;
      }
      setWorkspaces(Array.isArray(response.data) ? response.data : []);
      setLoading(false);
    });
  }, [router]);

  const current = useMemo(
    () => workspaces.find((workspace) => workspace.slug === workspaceSlug),
    [workspaceSlug, workspaces],
  );

  useEffect(() => {
    if (!loading && !current) {
      router.replace("/workspaces");
    }
  }, [current, loading, router]);

  if (loading || !current) {
    return (
      <AppFrame title="Loading workspace" subtitle="Resolving workspace context...">
        <div className="card rounded-2xl p-6 text-sm text-[#574d45]">Please wait.</div>
      </AppFrame>
    );
  }

  return (
    <AppFrame
      title={current.name}
      subtitle="Track projects, boards and delivery flow from one place."
      actions={
        <Link
          href={`/workspaces/${current.slug}/projects/new`}
          className="rounded-xl bg-[var(--accent-1)] px-4 py-2 text-sm text-white"
        >
          New Project
        </Link>
      }
    >
      <div className="grid gap-4 md:grid-cols-3">
        <Link
          href={`/workspaces/${current.slug}/projects`}
          className="card rounded-2xl p-6 transition hover:-translate-y-0.5"
        >
          <p className="text-xs uppercase tracking-[0.18em] text-[#574d45]">Projects</p>
          <h2 className="title-display mt-2 text-2xl">View all projects</h2>
        </Link>
        <Link
          href={`/workspaces/${current.slug}/members`}
          className="card rounded-2xl p-6 transition hover:-translate-y-0.5"
        >
          <p className="text-xs uppercase tracking-[0.18em] text-[#574d45]">Members</p>
          <h2 className="title-display mt-2 text-2xl">Manage team access</h2>
        </Link>
        <Link
          href={`/workspaces/${current.slug}/settings`}
          className="card rounded-2xl p-6 transition hover:-translate-y-0.5"
        >
          <p className="text-xs uppercase tracking-[0.18em] text-[#574d45]">Settings</p>
          <h2 className="title-display mt-2 text-2xl">Workspace controls</h2>
        </Link>
      </div>
    </AppFrame>
  );
}
