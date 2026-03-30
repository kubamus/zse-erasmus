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
    <div className="grain min-h-screen px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-md">
        <div className="card rounded-3xl p-6 sm:p-8">
          <p className="text-xs uppercase tracking-[0.2em] text-[#574d45]">Plannero</p>
          <h1 className="title-display mt-2 text-4xl">
            {mode === "signup" ? "Create your workspace" : "Welcome back"}
          </h1>
          <p className="mt-2 text-sm text-[#574d45]">
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
                className="rounded-xl border border-[var(--line)] bg-white/80 px-4 py-3"
              />
            ) : null}
            <input
              required
              type="email"
              name="email"
              placeholder="Email"
              className="rounded-xl border border-[var(--line)] bg-white/80 px-4 py-3"
            />
            <input
              required
              type="password"
              name="password"
              placeholder="Password"
              className="rounded-xl border border-[var(--line)] bg-white/80 px-4 py-3"
            />
            <button
              type="submit"
              disabled={loading}
              className="mt-2 rounded-xl bg-[var(--accent-1)] px-4 py-3 text-white transition hover:brightness-95 disabled:opacity-50"
            >
              {loading
                ? "Please wait..."
                : mode === "signup"
                  ? "Create Account"
                  : "Sign In"}
            </button>
            {error ? <p className="text-sm text-red-700">{error}</p> : null}
          </form>

          <p className="mt-6 text-sm text-[#574d45]">
            {mode === "signup" ? "Already have an account?" : "Need an account?"}{" "}
            <Link
              href={mode === "signup" ? "/login" : "/signup"}
              className="font-semibold text-[var(--accent-2)]"
            >
              {mode === "signup" ? "Sign in" : "Create one"}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
