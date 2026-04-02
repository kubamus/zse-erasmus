import { PublicPageShell } from "@/components/public-page-shell";

const FEATURE_ROWS = [
  {
    name: "Workspaces and roles",
    details:
      "Create team spaces and manage owner, admin, and member permissions to keep delivery organized and secure.",
  },
  {
    name: "Projects and boards",
    details:
      "Split work by product area, then track progress with Kanban style boards and ordered columns.",
  },
  {
    name: "Issue lifecycle",
    details:
      "Use issue types, priorities, assignees, due dates, comments, labels, and activity events to run daily execution.",
  },
  {
    name: "Filtering and search",
    details:
      "Find issues fast by assignee, label, status, and priority so standups and reviews stay focused.",
  },
];

const TECH_STACK = [
  "Frontend: Next.js app router + React + TypeScript",
  "Backend: server routes with typed domain model",
  "Database: MySQL with Drizzle ORM migrations",
  "Authentication: secure email and password flow with session handling",
  "API: OpenAPI contract for predictable integrations",
];

export default function MoreInfoPage() {
  return (
    <PublicPageShell
      active="more-info"
      kicker="More Info"
      title="Product and technical details"
      subtitle="Everything here reflects how Plannero is being built: practical team planning, clear issue flow, and architecture that can scale beyond MVP."
    >
      <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <article className="surface rounded-[20px] p-5 sm:p-7">
          <p className="caption-kicker">Product capabilities</p>
          <h2 className="title-display mt-2 text-4xl leading-[0.9] sm:text-5xl">What teams can do in Plannero</h2>

          <div className="mt-5 grid gap-3">
            {FEATURE_ROWS.map((row) => (
              <div key={row.name} className="sticker rounded-md bg-white px-4 py-3">
                <p className="font-semibold text-[var(--ink-1)]">{row.name}</p>
                <p className="mt-1 text-sm text-[var(--ink-2)] sm:text-base">{row.details}</p>
              </div>
            ))}
          </div>
        </article>

        <article className="surface rounded-[20px] p-5 sm:p-7">
          <p className="caption-kicker">Engineering notes</p>
          <h2 className="title-display mt-2 text-4xl leading-[0.9]">Architecture at a glance</h2>
          <ul className="mt-4 grid gap-2 text-sm text-[var(--ink-2)] sm:text-base">
            {TECH_STACK.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>

          <div className="mt-6 rounded-md border-2 border-[var(--line-strong)] bg-[var(--accent-lime)] px-4 py-3 text-sm text-[#090909] sm:text-base">
            Plannero follows a workspace -&gt; project -&gt; board -&gt; issue model so teams can keep ownership, planning, and execution connected.
          </div>
        </article>
      </div>
    </PublicPageShell>
  );
}
