"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { authClient } from "@/lib/authClient";

type AuthCardProps = {
  mode: "login" | "signup";
};

export function AuthCard({ mode }: AuthCardProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "");
    const password = String(form.get("password") ?? "");
    const name = String(form.get("name") ?? "");

    const result =
      mode === "signup"
        ? await authClient.signUp.email({ email, password, name })
        : await authClient.signIn.email({ email, password });

    if (result.error) {
      setError(result.error.message ?? "Authentication failed");
      setLoading(false);
      return;
    }

    router.push("/workspaces");
    router.refresh();
  }

  return (
    <div className="grain min-h-screen px-4 py-8 sm:px-8 lg:px-10">
      <div className="mx-auto grid max-w-[1200px] gap-6 lg:grid-cols-[1.1fr_1fr]">
        <div className="surface rise-in rounded-[32px] p-8 sm:p-10">
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--ink-2)]">
            Plannero
          </p>
          <h1 className="title-display mt-3 text-5xl leading-[0.95] sm:text-6xl">
            Coordinate
            <br />
            delivery.
          </h1>
          <p className="mt-4 max-w-md text-base text-[var(--ink-2)]">
            Built for teams who move fast, review cleanly, and ship with
            confidence.
          </p>
          <div className="mt-8 grid gap-2 text-sm text-[var(--ink-2)] sm:grid-cols-2">
            <div className="surface rounded-2xl p-3">
              <p className="text-xs uppercase tracking-[0.14em]">
                Board-native
              </p>
              <p className="mt-1">Drag, prioritize, and deliver.</p>
            </div>
            <div className="surface rounded-2xl p-3">
              <p className="text-xs uppercase tracking-[0.14em]">
                Issue-centric
              </p>
              <p className="mt-1">Review with context and history.</p>
            </div>
          </div>
        </div>

        <div className="surface rise-in stagger-1 rounded-[32px] p-6 sm:p-8">
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--ink-2)]">
            Plannero Team OS
          </p>
          <h2 className="title-display mt-2 text-4xl sm:text-5xl">
            {mode === "signup" ? "Create your workspace" : "Welcome back"}
          </h2>
          <p className="mt-2 text-sm text-[var(--ink-2)] sm:text-base">
            {mode === "signup"
              ? "Start planning with focused boards and issue flow."
              : "Sign in to continue where your team left off."}
          </p>

          <form onSubmit={onSubmit} className="mt-6 grid gap-3">
            {mode === "signup" ? (
              <input
                required
                name="name"
                placeholder="Your name"
                className="rounded-2xl border border-[var(--line)] bg-white/90 px-4 py-3"
              />
            ) : null}
            <input
              required
              type="email"
              name="email"
              placeholder="Email"
              className="rounded-2xl border border-[var(--line)] bg-white/90 px-4 py-3"
            />
            <input
              required
              type="password"
              name="password"
              placeholder="Password"
              className="rounded-2xl border border-[var(--line)] bg-white/90 px-4 py-3"
            />
            <button
              type="submit"
              disabled={loading}
              className="mt-2 rounded-2xl bg-[var(--accent-1)] px-4 py-3 text-white transition hover:brightness-95 disabled:opacity-50"
            >
              {loading
                ? "Please wait..."
                : mode === "signup"
                  ? "Create Account"
                  : "Sign In"}
            </button>
            {error ? <p className="text-sm text-[#a5291f]">{error}</p> : null}
          </form>

          <p className="mt-6 text-sm text-[var(--ink-2)]">
            {mode === "signup"
              ? "Already have an account?"
              : "Need an account?"}{" "}
            <Link
              href={mode === "signup" ? "/login" : "/signup"}
              className="font-semibold text-[var(--accent-3)]"
            >
              {mode === "signup" ? "Sign in" : "Create one"}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
