import Link from "next/link";
import { PublicPageShell } from "@/components/public-page-shell";

const CONTACT_POINTS = [
  {
    label: "General inbox",
    value: "hello@plannero.app",
    note: "Questions about onboarding, product basics, or account setup.",
  },
  {
    label: "Technical support",
    value: "support@plannero.app",
    note: "Help with login, workspace access, board behavior, or API related issues.",
  },
  {
    label: "Partnership and academic collaboration",
    value: "partners@plannero.app",
    note: "University projects, student team pilots, and product collaboration inquiries.",
  },
];

const RESPONSE_TIMES = [
  "General inquiries: within 24 hours on business days",
  "Support requests: same day for critical access issues",
  "Feature requests: reviewed weekly by the product team",
];

export default function ContactPage() {
  return (
    <PublicPageShell
      active="contact"
      kicker="Contact Plannero"
      title="Let us help your team"
      subtitle="We answer product and support questions quickly, and we actively collect feedback from teams using Plannero in real project workflows."
    >
      <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <article className="surface rounded-[20px] p-5 sm:p-7">
          <p className="caption-kicker">How to reach us</p>
          <h2 className="title-display mt-2 text-4xl leading-[0.9] sm:text-5xl">Contact channels</h2>

          <div className="mt-5 grid gap-3">
            {CONTACT_POINTS.map((point) => (
              <div key={point.label} className="sticker rounded-md bg-white px-4 py-3">
                <p className="caption-kicker">{point.label}</p>
                <p className="mt-1 text-lg font-semibold text-[var(--ink-1)]">{point.value}</p>
                <p className="mt-1 text-sm text-[var(--ink-2)]">{point.note}</p>
              </div>
            ))}
          </div>
        </article>

        <article className="surface rounded-[20px] p-5 sm:p-7">
          <p className="caption-kicker">Availability</p>
          <h2 className="title-display mt-2 text-4xl leading-[0.9]">Response time</h2>
          <ul className="mt-4 grid gap-2 text-sm text-[var(--ink-2)] sm:text-base">
            {RESPONSE_TIMES.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>

          <p className="mt-6 text-sm text-[var(--ink-2)] sm:text-base">
            Prefer to explore first? Visit the
            {" "}
            <Link href="/more-info" className="font-semibold text-[var(--accent-3)] underline decoration-2">
              More Info page
            </Link>
            {" "}
            for product and technical details.
          </p>
        </article>
      </div>
    </PublicPageShell>
  );
}
