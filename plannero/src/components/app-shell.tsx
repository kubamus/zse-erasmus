"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type AppShellProps = {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
};

const NAV_ITEMS = [
  { href: "/workspaces", label: "Workspaces" },
  { href: "/workspaces/new", label: "Create Workspace" },
  { href: "/test", label: "API Playground" },
  { href: "/logout", label: "Logout" },
];

function matchPath(current: string, href: string) {
  if (href === "/workspaces") {
    return current === "/workspaces" || current.startsWith("/workspaces/");
  }
  return current === href;
}

export function AppShell({ title, subtitle, actions, children }: AppShellProps) {
  const pathname = usePathname();

  return (
    <div className="grain app-shell">
      <aside className="app-sidebar hidden p-4 lg:flex lg:flex-col">
        <div className="surface rounded-2xl p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--ink-2)]">Plannero</p>
          <h2 className="title-display mt-2 text-2xl">Team OS</h2>
          <p className="mt-1 text-xs text-[var(--ink-2)]">Boards, issues, velocity.</p>
        </div>
        <nav className="mt-4 grid gap-1 text-sm">
          {NAV_ITEMS.map((item) => {
            const active = matchPath(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-item rounded-xl px-3 py-2 ${active ? "nav-item-active" : ""}`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="min-w-0">
        <header className="app-topbar px-4 py-3 sm:px-6">
          <div className="mx-auto flex max-w-[1320px] flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--ink-2)]">Workspace</p>
              <h1 className="title-display text-3xl leading-none sm:text-4xl">{title}</h1>
              {subtitle ? <p className="mt-1 text-sm text-[var(--ink-2)]">{subtitle}</p> : null}
            </div>
            <div className="flex items-center gap-2">{actions}</div>
          </div>
        </header>

        <main className="px-4 py-5 sm:px-6 sm:py-6">
          <div className="mx-auto max-w-[1320px]">{children}</div>
        </main>
      </div>
    </div>
  );
}
