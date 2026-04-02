import Image from "next/image";
import Link from "next/link";

type PublicPageShellProps = {
  active: "about-us" | "contact" | "more-info";
  kicker: string;
  title: string;
  subtitle: string;
  children: React.ReactNode;
};

export function PublicPageShell({
  active,
  kicker,
  title,
  subtitle,
  children,
}: PublicPageShellProps) {
  return (
    <div className="grain min-h-screen px-4 py-4 sm:px-8 sm:py-8">
      <div className="relative w-full overflow-hidden rounded-[34px] border-2 border-[var(--line-strong)] bg-[rgba(255,255,255,0.58)] p-3 shadow-[12px_12px_0_rgba(17,17,15,0.18)] sm:p-6">
        <div className="pointer-events-none absolute left-0 top-0 h-full w-full bg-[linear-gradient(to_right,rgba(17,17,15,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(17,17,15,0.08)_1px,transparent_1px)] bg-[size:110px_110px]" />
        <div className="pointer-events-none absolute -bottom-12 left-[54%] h-64 w-64 -translate-x-1/2 rounded-[44%_56%_47%_53%/65%_37%_63%_35%] bg-[var(--accent-pink)] opacity-75" />

        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 border-2 border-[var(--line-strong)] bg-[rgba(255,255,255,0.84)] px-4 py-3 sm:px-6">
          <Link
            href="/"
            aria-label="Plannero"
            className="sticker inline-flex rounded-md border-2 border-[var(--line-strong)] bg-[#e0d0b7] px-2 py-1.5"
          >
            <Image
              src="/plannero.png"
              alt="Plannero"
              width={520}
              height={160}
              priority
              className="h-auto w-[120px] sm:w-[150px]"
            />
          </Link>

          <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm">
            <Link href="/login" className="nav-item rounded-md px-3 py-1.5">
              Product
            </Link>
            <Link
              href="/about-us"
              className={`nav-item rounded-md px-3 py-1.5 ${active === "about-us" ? "nav-item-active" : ""}`}
            >
              About Us
            </Link>
            <Link
              href="/contact"
              className={`nav-item rounded-md px-3 py-1.5 ${active === "contact" ? "nav-item-active" : ""}`}
            >
              Contact
            </Link>
            <Link
              href="/more-info"
              className={`nav-item rounded-md px-3 py-1.5 ${active === "more-info" ? "nav-item-active" : ""}`}
            >
              More Info
            </Link>
          </div>
        </div>

        <div className="relative z-10 mt-5 grid gap-4">
          <section className="surface rise-in rounded-[20px] p-5 sm:p-8">
            <p className="caption-kicker">{kicker}</p>
            <h1 className="title-display mt-2 text-4xl leading-[0.9] sm:text-6xl">{title}</h1>
            <p className="mt-3 max-w-3xl text-sm text-[var(--ink-2)] sm:text-base">{subtitle}</p>
          </section>

          <section className="rise-in stagger-1 grid gap-4">{children}</section>

          <section className="surface rise-in stagger-2 rounded-[20px] p-5 sm:p-6">
            <h2 className="title-display text-3xl leading-[0.92] sm:text-4xl">Ready to start planning?</h2>
            <p className="mt-2 max-w-2xl text-sm text-[var(--ink-2)] sm:text-base">
              Create a workspace, invite your team, and organize projects with boards, issues, labels, comments, and activity tracking in one place.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link href="/signup" className="brutal-button rounded-md px-4 py-2.5 text-sm">
                Create account
              </Link>
              <Link href="/login" className="brutal-button-secondary rounded-md px-4 py-2.5 text-sm">
                Sign in
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
