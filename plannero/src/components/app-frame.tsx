import Link from "next/link";

type AppFrameProps = {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
};

export function AppFrame({ title, subtitle, actions, children }: AppFrameProps) {
  return (
    <div className="grain min-h-screen px-4 py-6 sm:px-8 sm:py-10">
      <div className="mx-auto w-full max-w-6xl">
        <header className="card rounded-2xl p-4 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[#574d45]">Plannero</p>
              <h1 className="title-display mt-1 text-3xl sm:text-4xl">{title}</h1>
              {subtitle ? <p className="mt-2 text-sm text-[#574d45]">{subtitle}</p> : null}
            </div>
            <div className="flex items-center gap-2">{actions}</div>
          </div>
          <nav className="mt-5 flex flex-wrap gap-2 text-sm">
            <Link href="/workspaces" className="rounded-full border border-[var(--line)] px-3 py-1.5">
              Workspaces
            </Link>
            <Link href="/workspaces/new" className="rounded-full border border-[var(--line)] px-3 py-1.5">
              New Workspace
            </Link>
            <Link href="/test" className="rounded-full border border-[var(--line)] px-3 py-1.5">
              API Test Routes
            </Link>
            <Link href="/logout" className="rounded-full border border-[var(--line)] px-3 py-1.5">
              Logout
            </Link>
          </nav>
        </header>
        <main className="mt-6">{children}</main>
      </div>
    </div>
  );
}
