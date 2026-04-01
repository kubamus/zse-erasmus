"use client";

import Image from "next/image";
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
    <div className="grain min-h-screen px-4 py-4 sm:px-8 sm:py-8">
      <div className="relative w-full overflow-hidden rounded-[34px] border-2 border-[var(--line-strong)] bg-[rgba(255,255,255,0.58)] p-3 shadow-[12px_12px_0_rgba(17,17,15,0.18)] sm:p-6">
        <div className="pointer-events-none absolute left-0 top-0 h-full w-full bg-[linear-gradient(to_right,rgba(17,17,15,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(17,17,15,0.08)_1px,transparent_1px)] bg-[size:110px_110px]" />
        <div className="pointer-events-none absolute -bottom-12 left-[54%] h-64 w-64 -translate-x-1/2 rounded-[44%_56%_47%_53%/65%_37%_63%_35%] bg-[var(--accent-pink)] opacity-75" />

        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 border-2 border-[var(--line-strong)] bg-[rgba(255,255,255,0.84)] px-4 py-3 sm:px-6">
          <p className="text-sm font-black tracking-tight sm:text-xl">YOUR LOGO</p>
          <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm">
            <span className="nav-item nav-item-active rounded-md px-3 py-1.5">Product</span>
            <span className="nav-item rounded-md px-3 py-1.5">About Us</span>
            <span className="nav-item rounded-md px-3 py-1.5">Contact</span>
            <span className="nav-item rounded-md px-3 py-1.5">More Info</span>
          </div>
        </div>

        <div className="relative z-10 mt-5 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <section className="surface rise-in relative overflow-hidden rounded-[20px] p-5 sm:p-8">
            <span className="sticker absolute left-5 top-5 inline-flex rounded-md bg-[var(--accent-yellow)] px-3 py-1 text-xs font-bold uppercase tracking-[0.14em]">
              Promotion
            </span>
            <h1 className="title-display mt-14 text-5xl leading-[0.86] sm:text-7xl">
              Elevate your
              <br />
              <span className="headline-mark">street style.</span>
            </h1>
            <p className="mt-4 max-w-lg text-sm text-[var(--ink-2)] sm:text-base">
              Plan campaigns, coordinate tasks, and ship with clarity in one brutalist control room.
            </p>

            <div className="mt-5 flex max-w-md items-center gap-2 rounded-full border-2 border-[var(--line-strong)] bg-[rgba(255,255,255,0.88)] px-4 py-2.5">
              <span className="text-[var(--ink-2)]">Search</span>
              <span className="ml-auto text-xl">Q</span>
            </div>

            <div className="mt-8 grid gap-2 text-sm sm:grid-cols-2">
              <div className="sticker rounded-md bg-white px-3 py-2">
                <p className="caption-kicker">Board-native</p>
                <p className="mt-1 font-medium">Drag, prioritize, and deliver.</p>
              </div>
              <div className="sticker rounded-md bg-white px-3 py-2">
                <p className="caption-kicker">Issue-centric</p>
                <p className="mt-1 font-medium">Review with context and history.</p>
              </div>
            </div>
          </section>

          <section className="relative rise-in stagger-1 grid gap-4"> 

            <div className="surface rounded-[20px] p-5">
              <p className="caption-kicker">Plannero Team OS</p>
              <h2 className="title-display mt-2 text-4xl leading-[0.9]">
                {mode === "signup" ? "Create your workspace" : "Welcome back"}
              </h2>
              <p className="mt-2 text-sm text-[var(--ink-2)] sm:text-base">
                {mode === "signup"
                  ? "Start planning with focused boards and issue flow."
                  : "Sign in to continue where your team left off."}
              </p>

              <form onSubmit={onSubmit} className="mt-5 grid gap-2.5">
                {mode === "signup" ? (
                  <input
                    required
                    name="name"
                    placeholder="Your name"
                    className="brutal-input rounded-md px-4 py-2.5"
                  />
                ) : null}
                <input
                  required
                  type="email"
                  name="email"
                  placeholder="Email"
                  className="brutal-input rounded-md px-4 py-2.5"
                />
                <input
                  required
                  type="password"
                  name="password"
                  placeholder="Password"
                  className="brutal-input rounded-md px-4 py-2.5"
                />
                <button type="submit" disabled={loading} className="brutal-button mt-2 rounded-md px-4 py-2.5 text-sm">
                  {loading
                    ? "Please wait..."
                    : mode === "signup"
                      ? "Create Account"
                      : "Sign In"}
                </button>
                {error ? <p className="text-sm text-[#a5291f]">{error}</p> : null}
              </form>

              <p className="mt-5 text-sm text-[var(--ink-2)]">
                {mode === "signup"
                  ? "Already have an account?"
                  : "Need an account?"}{" "}
                <Link
                  href={mode === "signup" ? "/login" : "/signup"}
                  className="font-semibold text-[var(--accent-3)] underline decoration-2"
                >
                  {mode === "signup" ? "Sign in" : "Create one"}
                </Link>
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
