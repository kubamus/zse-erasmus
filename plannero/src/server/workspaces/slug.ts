import { like } from "drizzle-orm";
import { randomUUID } from "node:crypto";
import { db } from "@/server/db";
import { workspacesTable } from "@/server/db/schema";

function slugify(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function createUniqueWorkspaceSlug(name: string) {
  const baseSlug = slugify(name) || `workspace-${randomUUID().slice(0, 8)}`;

  const existing = await db
    .select({ slug: workspacesTable.slug })
    .from(workspacesTable)
    .where(like(workspacesTable.slug, `${baseSlug}%`));

  const slugSet = new Set(existing.map((item) => item.slug));

  if (!slugSet.has(baseSlug)) {
    return baseSlug;
  }

  let attempt = 2;

  while (slugSet.has(`${baseSlug}-${attempt}`)) {
    attempt += 1;
  }

  return `${baseSlug}-${attempt}`;
}
