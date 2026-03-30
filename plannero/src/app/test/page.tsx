import Link from "next/link";

const routes = [
  {
    href: "/test/auth",
    title: "Authentication API",
    description: "Test authentication",
  },
  {
    href: "/test/workspaces",
    title: "Workspaces API",
    description:
      "Test workspace CRUD endpoints with live requests and curl samples.",
  },
  {
    href: "/test/workspace-members",
    title: "Workspace Members API",
    description:
      "Test membership listing, add, role update, and remove endpoints.",
  },
];

export default function TestIndexPage() {
  return (
    <main className="mx-auto w-full max-w-4xl px-6 py-10">
      <h1 className="text-3xl font-semibold">API Test Routes</h1>
      <p className="mt-2 text-sm opacity-80">
        Use these pages to manually verify all implemented workspace
        functionality.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {routes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            className="rounded-xl border border-black/10 p-4 transition hover:border-black/30"
          >
            <h2 className="text-lg font-medium">{route.title}</h2>
            <p className="mt-2 text-sm opacity-75">{route.description}</p>
            <p className="mt-4 text-sm font-medium">Open route -&gt;</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
