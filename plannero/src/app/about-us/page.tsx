import { PublicPageShell } from "@/components/public-page-shell";

const HIGHLIGHTS = [
  {
    title: "Built for team workflows",
    description:
      "Plannero is designed for student teams and growing product squads that need one place for planning, execution, and delivery.",
  },
  {
    title: "Jira and Trello inspired",
    description:
      "The app combines Kanban clarity with issue detail so teams can break work down, track progress, and keep context attached to each task.",
  },
  {
    title: "Focused MVP scope",
    description:
      "Core features include secure sign in, workspaces, projects, boards, issue lifecycle, comments, assignees, labels, and activity history.",
  },
];

export default function AboutUsPage() {
  return (
    <PublicPageShell
      active="about-us"
      kicker="Plannero Story"
      title="About the platform"
      subtitle="Plannero is a task planning app built to help teams move from idea to shipped work with less friction and better visibility."
    >
      <div className="grid gap-4 lg:grid-cols-3">
        {HIGHLIGHTS.map((item) => (
          <article key={item.title} className="surface rounded-[20px] p-5 sm:p-6">
            <h2 className="title-display text-3xl leading-[0.92]">{item.title}</h2>
            <p className="mt-3 text-sm text-[var(--ink-2)] sm:text-base">{item.description}</p>
          </article>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <article className="surface rounded-[20px] p-5 sm:p-7">
          <p className="caption-kicker">How Plannero works</p>
          <h2 className="title-display mt-2 text-4xl leading-[0.9] sm:text-5xl">From workspace to done</h2>
          <div className="mt-4 grid gap-3 text-sm text-[var(--ink-2)] sm:text-base">
            <p>
              Teams begin by creating a workspace and inviting members with owner, admin, or member access.
              Inside each workspace, projects organize product areas or delivery streams.
            </p>
            <p>
              Each project can contain multiple boards with customizable columns. Issues move through those columns, can be assigned to users, tagged with labels, discussed in comments, and tracked in an immutable activity timeline.
            </p>
            <p>
              This structure keeps planning practical: everyone sees what is next, what is blocked, and what was completed, without bouncing between disconnected tools.
            </p>
          </div>
        </article>

        <article className="surface rounded-[20px] p-5 sm:p-7">
          <p className="caption-kicker">Technical direction</p>
          <h2 className="title-display mt-2 text-4xl leading-[0.9]">Built with modern web stack</h2>
          <ul className="mt-4 grid gap-2 text-sm text-[var(--ink-2)] sm:text-base">
            <li>Next.js app router frontend</li>
            <li>TypeScript across backend and UI</li>
            <li>MySQL persistence with Drizzle ORM</li>
            <li>Auth and session-based access control</li>
            <li>OpenAPI-first contract mindset</li>
          </ul>
        </article>
      </div>
    </PublicPageShell>
  );
}
