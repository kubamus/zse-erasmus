"use client";

import { useCallback, useEffect, useState } from "react";
import { AppFrame } from "@/components/app-frame";
import { apiRequest } from "@/lib/client-api";

type Workspace = { id: string; name: string; slug: string };
type WorkspaceMember = {
  workspaceId: string;
  user: { id: string; name: string; email: string; image?: string | null };
  role: "owner" | "admin" | "member";
};

export function WorkspaceMembersPanel({ workspaceSlug }: { workspaceSlug: string }) {
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [members, setMembers] = useState<WorkspaceMember[]>([]);
  const [userId, setUserId] = useState("");
  const [role, setRole] = useState<"owner" | "admin" | "member">("member");
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    const workspaceResponse = await apiRequest<Workspace[]>("/workspaces");
    const all = Array.isArray(workspaceResponse.data) ? workspaceResponse.data : [];
    const current = all.find((item) => item.slug === workspaceSlug) ?? null;

    setWorkspace(current);

    if (!current) {
      setMembers([]);
      setLoading(false);
      return;
    }

    const membersResponse = await apiRequest<WorkspaceMember[]>(
      `/workspaces/${current.id}/members`,
    );
    setMembers(Array.isArray(membersResponse.data) ? membersResponse.data : []);
    setLoading(false);
  }, [workspaceSlug]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void reload();
  }, [reload]);

  async function addMember() {
    if (!workspace || !userId) return;
    await apiRequest(`/workspaces/${workspace.id}/members`, {
      method: "POST",
      body: JSON.stringify({ userId, role }),
    });
    setUserId("");
    await reload();
  }

  return (
    <AppFrame title="Workspace Members" subtitle="Manage roles and team access.">
      {loading ? (
        <div className="card rounded-2xl p-6">Loading members...</div>
      ) : (
        <div className="grid gap-4">
          <div className="card rounded-2xl p-5">
            <h2 className="title-display text-2xl">Invite member</h2>
            <div className="mt-4 grid gap-2 sm:grid-cols-[1fr_auto_auto]">
              <input
                value={userId}
                onChange={(event) => setUserId(event.target.value)}
                placeholder="User id"
                className="rounded-xl border border-[var(--line)] bg-white/80 px-4 py-2.5"
              />
              <select
                value={role}
                onChange={(event) => setRole(event.target.value as "owner" | "admin" | "member")}
                className="rounded-xl border border-[var(--line)] bg-white/80 px-4 py-2.5"
              >
                <option value="owner">owner</option>
                <option value="admin">admin</option>
                <option value="member">member</option>
              </select>
              <button
                type="button"
                onClick={addMember}
                className="rounded-xl bg-[var(--accent-2)] px-4 py-2.5 text-white"
              >
                Add
              </button>
            </div>
          </div>

          <div className="card rounded-2xl p-5">
            <h2 className="title-display text-2xl">Current team</h2>
            <div className="mt-4 grid gap-2">
              {members.map((member) => (
                <div
                  key={member.user.id}
                  className="flex items-center justify-between rounded-xl border border-[var(--line)] bg-white/70 px-4 py-3"
                >
                  <div>
                    <p className="font-semibold">{member.user.name}</p>
                    <p className="text-xs text-[#574d45]">{member.user.email}</p>
                  </div>
                  <p className="rounded-full border border-[var(--line)] px-3 py-1 text-xs uppercase tracking-[0.14em]">
                    {member.role}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </AppFrame>
  );
}
