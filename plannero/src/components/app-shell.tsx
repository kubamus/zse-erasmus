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
  { href: "/logout", label: "Logout" },
];

function matchPath(current: string, href: string) {
  if (href === "/workspaces") {
    return current === "/workspaces" || current.startsWith("/workspaces/");
  }
  return current === href;
}

export function AppShell({
  title,
  subtitle,
  actions,
  children,
}: AppShellProps) {
  const pathname = usePathname();

  return (
    <div className="grain app-shell">
      <div className="relative w-full rounded-[34px] border-2 border-[var(--line-strong)] bg-[rgba(255,255,255,0.56)] p-3 shadow-[12px_12px_0_rgba(17,17,15,0.15)] sm:p-5">
        <div className="pointer-events-none absolute -bottom-14 left-[52%] h-44 w-44 -translate-x-1/2 rounded-[36%_64%_68%_32%/35%_26%_74%_65%] bg-[var(--accent-pink)] opacity-70" />
        <div className="pointer-events-none absolute right-6 top-20 h-3.5 w-3.5 border-2 border-[var(--line-strong)] bg-[var(--accent-yellow)]" />

        <header className="app-topbar rounded-[22px] px-4 py-4 sm:px-6">
          <div className="grid items-center gap-4 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-8 w-8 items-center justify-center border-2 border-[var(--line-strong)] bg-[var(--accent-yellow)] text-[10px] font-black">
                P
              </span>
              <div>
                <p className="caption-kicker">Plannero</p>
                <p className="text-sm font-semibold">
                  Best app for task management
                </p>
              </div>
            </div>

            <nav className="flex flex-wrap items-center justify-center gap-2 text-[11px] sm:text-xs lg:flex-nowrap lg:justify-self-center">
              {NAV_ITEMS.map((item) => {
                const active = matchPath(pathname, item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`nav-item rounded-md px-2.5 py-1.5 sm:px-4 sm:py-2 ${active ? "nav-item-active" : ""}`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="flex min-h-[40px] flex-wrap items-center justify-end gap-2 lg:justify-self-end">
              {actions}
            </div>
          </div>

          <div className="mt-5 grid items-end gap-3 border-t-2 border-[rgba(17,17,15,0.2)] pt-4 sm:grid-cols-[1fr_auto]">
            <div>
              <p className="caption-kicker">Workspace</p>
              <h1 className="title-display text-4xl leading-[0.9] sm:text-5xl">
                {title}
              </h1>
              {subtitle ? (
                <p className="mt-2 max-w-2xl text-sm text-[var(--ink-2)]">
                  {subtitle}
                </p>
              ) : null}
            </div>
            <p className="sticker inline-flex items-center rounded-md bg-[var(--accent-lime)] px-3 py-1.5 text-xs font-semibold text-[#090909]">
              Build -&gt; Review -&gt; Ship
            </p>
          </div>
        </header>

        <main className="mt-4">
          <section className="min-w-0 rounded-[20px] border-2 border-[var(--line-strong)] bg-[rgba(255,255,255,0.54)] p-3 sm:p-5">
            {children}
          </section>
        </main>
      </div>
    </div>
  );
}
