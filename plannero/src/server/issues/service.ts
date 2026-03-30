import { and, asc, desc, eq, gt, inArray, isNull, like, or, sql } from "drizzle-orm";
import { randomUUID } from "node:crypto";
import {
  ensureWorkspaceWrite,
  requireIssueAccess,
  requireProjectAccess,
} from "@/server/access/workspaceAccess";
import { badRequest, notFound } from "@/server/api/errors";
import { db } from "@/server/db";
import {
  activityEventsTable,
  boardColumnsTable,
  boardsTable,
  issueAssigneesTable,
  issueLabelsTable,
  issuesTable,
  labelsTable,
  usersTable,
  workspaceMembersTable,
} from "@/server/db/schema";

type IssueQuery = {
  boardId?: string;
  columnId?: string;
  assigneeId?: string;
  labelId?: string;
  priority?: "low" | "medium" | "high" | "critical";
  type?: "task" | "bug" | "story" | "chore";
  q?: string;
  limit: number;
  cursor?: string;
};

function parseCursor(cursor?: string) {
  if (!cursor) {
    return null;
  }

  const decoded = Buffer.from(cursor, "base64").toString("utf8");
  const [position, id] = decoded.split("|");

  if (!position || !id) {
    throw badRequest("Invalid cursor");
  }

  return { position, id };
}

function encodeCursor(position: string, id: string) {
  return Buffer.from(`${position}|${id}`).toString("base64");
}

async function getIssueAssignees(issueIds: string[]) {
  if (issueIds.length === 0) {
    return new Map<string, Array<{ id: string; name: string; email: string; image: string | null }>>();
  }

  const rows = await db
    .select({
      issueId: issueAssigneesTable.issueId,
      id: usersTable.id,
      name: usersTable.name,
      email: usersTable.email,
      image: usersTable.image,
    })
    .from(issueAssigneesTable)
    .innerJoin(usersTable, eq(issueAssigneesTable.userId, usersTable.id))
    .where(inArray(issueAssigneesTable.issueId, issueIds));

  const map = new Map<string, Array<{ id: string; name: string; email: string; image: string | null }>>();

  for (const row of rows) {
    const list = map.get(row.issueId) ?? [];
    list.push({ id: row.id, name: row.name, email: row.email, image: row.image });
    map.set(row.issueId, list);
  }

  return map;
}

async function getIssueLabels(issueIds: string[]) {
  if (issueIds.length === 0) {
    return new Map<string, Array<{ id: string; projectId: string; name: string; color: string; createdAt: Date; updatedAt: Date }>>();
  }

  const rows = await db
    .select({
      issueId: issueLabelsTable.issueId,
      id: labelsTable.id,
      projectId: labelsTable.projectId,
      name: labelsTable.name,
      color: labelsTable.color,
      createdAt: labelsTable.createdAt,
      updatedAt: labelsTable.updatedAt,
    })
    .from(issueLabelsTable)
    .innerJoin(labelsTable, eq(issueLabelsTable.labelId, labelsTable.id))
    .where(inArray(issueLabelsTable.issueId, issueIds));

  const map = new Map<
    string,
    Array<{ id: string; projectId: string; name: string; color: string; createdAt: Date; updatedAt: Date }>
  >();

  for (const row of rows) {
    const list = map.get(row.issueId) ?? [];
    list.push({
      id: row.id,
      projectId: row.projectId,
      name: row.name,
      color: row.color,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
    map.set(row.issueId, list);
  }

  return map;
}

async function loadIssueResponse(issueId: string) {
  const [issue] = await db
    .select({
      id: issuesTable.id,
      projectId: issuesTable.projectId,
      boardId: issuesTable.boardId,
      columnId: issuesTable.columnId,
      issueNumber: issuesTable.issueNumber,
      title: issuesTable.title,
      description: issuesTable.description,
      type: issuesTable.type,
      priority: issuesTable.priority,
      dueDate: issuesTable.dueDate,
      estimatePoints: issuesTable.estimatePoints,
      position: issuesTable.position,
      createdAt: issuesTable.createdAt,
      updatedAt: issuesTable.updatedAt,
      deletedAt: issuesTable.deletedAt,
      reporterId: usersTable.id,
      reporterName: usersTable.name,
      reporterEmail: usersTable.email,
      reporterImage: usersTable.image,
    })
    .from(issuesTable)
    .innerJoin(usersTable, eq(issuesTable.reporterId, usersTable.id))
    .where(and(eq(issuesTable.id, issueId), isNull(issuesTable.deletedAt)))
    .limit(1);

  if (!issue) {
    throw notFound();
  }

  const assigneesMap = await getIssueAssignees([issue.id]);
  const labelsMap = await getIssueLabels([issue.id]);

  return {
    id: issue.id,
    projectId: issue.projectId,
    boardId: issue.boardId,
    columnId: issue.columnId,
    issueNumber: issue.issueNumber,
    title: issue.title,
    description: issue.description,
    type: issue.type,
    priority: issue.priority,
    reporter: {
      id: issue.reporterId,
      name: issue.reporterName,
      email: issue.reporterEmail,
      image: issue.reporterImage,
    },
    dueDate: issue.dueDate,
    estimatePoints: issue.estimatePoints !== null ? Number(issue.estimatePoints) : null,
    position: Number(issue.position),
    assignees: assigneesMap.get(issue.id) ?? [],
    labels: labelsMap.get(issue.id) ?? [],
    createdAt: issue.createdAt,
    updatedAt: issue.updatedAt,
    deletedAt: issue.deletedAt,
  };
}

async function appendActivity(
  issueId: string,
  actorId: string,
  eventType: string,
  oldValue: Record<string, unknown> | null,
  newValue: Record<string, unknown> | null,
) {
  await db.insert(activityEventsTable).values({
    id: randomUUID(),
    issueId,
    actorId,
    eventType,
    oldValue,
    newValue,
    createdAt: new Date(),
  });
}

export async function listIssues(projectId: string, userId: string, query: IssueQuery) {
  await requireProjectAccess(projectId, userId);
  const cursor = parseCursor(query.cursor);

  const filters = [eq(issuesTable.projectId, projectId), isNull(issuesTable.deletedAt)];

  if (query.boardId) filters.push(eq(issuesTable.boardId, query.boardId));
  if (query.columnId) filters.push(eq(issuesTable.columnId, query.columnId));
  if (query.priority) filters.push(eq(issuesTable.priority, query.priority));
  if (query.type) filters.push(eq(issuesTable.type, query.type));
  if (query.q) {
    filters.push(
      or(like(issuesTable.title, `%${query.q}%`), like(issuesTable.description, `%${query.q}%`))!,
    );
  }

  let rows = await db
    .select({
      id: issuesTable.id,
      projectId: issuesTable.projectId,
      boardId: issuesTable.boardId,
      columnId: issuesTable.columnId,
      issueNumber: issuesTable.issueNumber,
      title: issuesTable.title,
      description: issuesTable.description,
      type: issuesTable.type,
      priority: issuesTable.priority,
      dueDate: issuesTable.dueDate,
      estimatePoints: issuesTable.estimatePoints,
      position: issuesTable.position,
      createdAt: issuesTable.createdAt,
      updatedAt: issuesTable.updatedAt,
      deletedAt: issuesTable.deletedAt,
      reporterId: usersTable.id,
      reporterName: usersTable.name,
      reporterEmail: usersTable.email,
      reporterImage: usersTable.image,
    })
    .from(issuesTable)
    .innerJoin(usersTable, eq(issuesTable.reporterId, usersTable.id))
    .where(and(...filters))
    .orderBy(desc(issuesTable.position), desc(issuesTable.id))
    .limit(query.limit + 1);

  if (cursor) {
    rows = await db
      .select({
        id: issuesTable.id,
        projectId: issuesTable.projectId,
        boardId: issuesTable.boardId,
        columnId: issuesTable.columnId,
        issueNumber: issuesTable.issueNumber,
        title: issuesTable.title,
        description: issuesTable.description,
        type: issuesTable.type,
        priority: issuesTable.priority,
        dueDate: issuesTable.dueDate,
        estimatePoints: issuesTable.estimatePoints,
        position: issuesTable.position,
        createdAt: issuesTable.createdAt,
        updatedAt: issuesTable.updatedAt,
        deletedAt: issuesTable.deletedAt,
        reporterId: usersTable.id,
        reporterName: usersTable.name,
        reporterEmail: usersTable.email,
        reporterImage: usersTable.image,
      })
      .from(issuesTable)
      .innerJoin(usersTable, eq(issuesTable.reporterId, usersTable.id))
      .where(
        and(
          ...filters,
          or(
            gt(issuesTable.position, cursor.position),
            and(eq(issuesTable.position, cursor.position), gt(issuesTable.id, cursor.id)),
          )!,
        ),
      )
      .orderBy(asc(issuesTable.position), asc(issuesTable.id))
      .limit(query.limit + 1);
  }

  if (query.assigneeId) {
    const issueIds = rows.map((row) => row.id);
    const assigneeRows = issueIds.length
      ? await db
          .select({ issueId: issueAssigneesTable.issueId })
          .from(issueAssigneesTable)
          .where(
            and(
              inArray(issueAssigneesTable.issueId, issueIds),
              eq(issueAssigneesTable.userId, query.assigneeId),
            ),
          )
      : [];
    const allowed = new Set(assigneeRows.map((row) => row.issueId));
    rows = rows.filter((row) => allowed.has(row.id));
  }

  if (query.labelId) {
    const issueIds = rows.map((row) => row.id);
    const labelRows = issueIds.length
      ? await db
          .select({ issueId: issueLabelsTable.issueId })
          .from(issueLabelsTable)
          .where(
            and(
              inArray(issueLabelsTable.issueId, issueIds),
              eq(issueLabelsTable.labelId, query.labelId),
            ),
          )
      : [];
    const allowed = new Set(labelRows.map((row) => row.issueId));
    rows = rows.filter((row) => allowed.has(row.id));
  }

  const page = rows.slice(0, query.limit);
  const issueIds = page.map((row) => row.id);
  const assigneesMap = await getIssueAssignees(issueIds);
  const labelsMap = await getIssueLabels(issueIds);

  const data = page.map((row) => ({
    id: row.id,
    projectId: row.projectId,
    boardId: row.boardId,
    columnId: row.columnId,
    issueNumber: row.issueNumber,
    title: row.title,
    description: row.description,
    type: row.type,
    priority: row.priority,
    reporter: {
      id: row.reporterId,
      name: row.reporterName,
      email: row.reporterEmail,
      image: row.reporterImage,
    },
    dueDate: row.dueDate,
    estimatePoints: row.estimatePoints !== null ? Number(row.estimatePoints) : null,
    position: Number(row.position),
    assignees: assigneesMap.get(row.id) ?? [],
    labels: labelsMap.get(row.id) ?? [],
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    deletedAt: row.deletedAt,
  }));

  const hasMore = rows.length > query.limit;
  const next = hasMore ? page.at(-1) : null;

  return {
    data,
    meta: {
      nextCursor: next ? encodeCursor(String(next.position), next.id) : null,
    },
  };
}

export async function createIssue(
  projectId: string,
  userId: string,
  input: {
    boardId: string;
    columnId: string;
    title: string;
    description?: string;
    type: "task" | "bug" | "story" | "chore";
    priority: "low" | "medium" | "high" | "critical";
    dueDate?: string | null;
    estimatePoints?: number | null;
    assigneeIds?: string[];
    labelIds?: string[];
  },
) {
  const access = await requireProjectAccess(projectId, userId);
  ensureWorkspaceWrite(access.role);

  const [board] = await db
    .select({ id: boardsTable.id, projectId: boardsTable.projectId, isArchived: boardsTable.isArchived })
    .from(boardsTable)
    .where(eq(boardsTable.id, input.boardId))
    .limit(1);

  if (!board || board.projectId !== projectId || board.isArchived) {
    throw badRequest("Invalid request data");
  }

  const [column] = await db
    .select({ id: boardColumnsTable.id, boardId: boardColumnsTable.boardId })
    .from(boardColumnsTable)
    .where(eq(boardColumnsTable.id, input.columnId))
    .limit(1);

  if (!column || column.boardId !== input.boardId) {
    throw badRequest("Invalid request data");
  }

  const [lastIssue] = await db
    .select({ value: sql<number>`coalesce(max(${issuesTable.issueNumber}), 0)` })
    .from(issuesTable)
    .where(eq(issuesTable.projectId, projectId));

  const issueNumber = Number(lastIssue?.value ?? 0) + 1;
  const id = randomUUID();
  const now = new Date();

  await db.insert(issuesTable).values({
    id,
    projectId,
    boardId: input.boardId,
    columnId: input.columnId,
    issueNumber,
    title: input.title,
    description: input.description ?? null,
    type: input.type,
    priority: input.priority,
    reporterId: userId,
    dueDate: input.dueDate ? new Date(input.dueDate) : null,
    estimatePoints:
      input.estimatePoints !== undefined && input.estimatePoints !== null
        ? String(input.estimatePoints)
        : null,
    position: String(Date.now()),
    createdAt: now,
    updatedAt: now,
    deletedAt: null,
  });

  if (input.assigneeIds?.length) {
    const memberships = await db
      .select({ userId: workspaceMembersTable.userId })
      .from(workspaceMembersTable)
      .where(
        and(
          eq(workspaceMembersTable.workspaceId, access.workspaceId),
          inArray(workspaceMembersTable.userId, input.assigneeIds),
        ),
      );
    const allowed = new Set(memberships.map((row) => row.userId));

    for (const assigneeId of input.assigneeIds) {
      if (!allowed.has(assigneeId)) {
        throw badRequest("Invalid request data");
      }

      await db.insert(issueAssigneesTable).values({
        issueId: id,
        userId: assigneeId,
        assignedAt: now,
      });
    }
  }

  if (input.labelIds?.length) {
    const labels = await db
      .select({ id: labelsTable.id, projectId: labelsTable.projectId })
      .from(labelsTable)
      .where(inArray(labelsTable.id, input.labelIds));
    const labelMap = new Map(labels.map((row) => [row.id, row]));

    for (const labelId of input.labelIds) {
      const label = labelMap.get(labelId);
      if (!label || label.projectId !== projectId) {
        throw badRequest("Invalid request data");
      }
      await db.insert(issueLabelsTable).values({ issueId: id, labelId });
    }
  }

  await appendActivity(id, userId, "issue.created", null, { title: input.title });

  return loadIssueResponse(id);
}

export async function getIssue(issueId: string, userId: string) {
  await requireIssueAccess(issueId, userId);

  return loadIssueResponse(issueId);
}

export async function updateIssue(
  issueId: string,
  userId: string,
  input: {
    columnId?: string;
    title?: string;
    description?: string;
    type?: "task" | "bug" | "story" | "chore";
    priority?: "low" | "medium" | "high" | "critical";
    dueDate?: string | null;
    estimatePoints?: number | null;
    position?: number;
  },
) {
  const access = await requireIssueAccess(issueId, userId);
  ensureWorkspaceWrite(access.role);

  const [oldIssue] = await db.select().from(issuesTable).where(eq(issuesTable.id, issueId)).limit(1);

  if (!oldIssue) {
    throw notFound();
  }

  if (input.columnId) {
    const [column] = await db
      .select({ id: boardColumnsTable.id, boardId: boardColumnsTable.boardId })
      .from(boardColumnsTable)
      .where(eq(boardColumnsTable.id, input.columnId))
      .limit(1);

    if (!column || column.boardId !== oldIssue.boardId) {
      throw badRequest("Invalid request data");
    }
  }

  await db
    .update(issuesTable)
    .set({
      ...(input.columnId !== undefined ? { columnId: input.columnId } : {}),
      ...(input.title !== undefined ? { title: input.title } : {}),
      ...(input.description !== undefined ? { description: input.description } : {}),
      ...(input.type !== undefined ? { type: input.type } : {}),
      ...(input.priority !== undefined ? { priority: input.priority } : {}),
      ...(input.dueDate !== undefined
        ? { dueDate: input.dueDate ? new Date(input.dueDate) : null }
        : {}),
      ...(input.estimatePoints !== undefined
        ? {
            estimatePoints:
              input.estimatePoints === null ? null : String(input.estimatePoints),
          }
        : {}),
      ...(input.position !== undefined ? { position: String(input.position) } : {}),
    })
    .where(eq(issuesTable.id, issueId));

  await appendActivity(issueId, userId, "issue.updated", null, input as Record<string, unknown>);

  return loadIssueResponse(issueId);
}

export async function deleteIssue(issueId: string, userId: string) {
  const access = await requireIssueAccess(issueId, userId);
  ensureWorkspaceWrite(access.role);

  await db
    .update(issuesTable)
    .set({ deletedAt: new Date() })
    .where(eq(issuesTable.id, issueId));

  await appendActivity(issueId, userId, "issue.deleted", null, null);
}

export async function moveIssue(
  issueId: string,
  userId: string,
  input: { toColumnId: string; position: number },
) {
  const access = await requireIssueAccess(issueId, userId);
  ensureWorkspaceWrite(access.role);

  const [issue] = await db.select().from(issuesTable).where(eq(issuesTable.id, issueId)).limit(1);

  if (!issue) {
    throw notFound();
  }

  const [column] = await db
    .select({ id: boardColumnsTable.id, boardId: boardColumnsTable.boardId })
    .from(boardColumnsTable)
    .where(eq(boardColumnsTable.id, input.toColumnId))
    .limit(1);

  if (!column || column.boardId !== issue.boardId) {
    throw badRequest("Invalid request data");
  }

  await db
    .update(issuesTable)
    .set({
      columnId: input.toColumnId,
      position: String(input.position),
    })
    .where(eq(issuesTable.id, issueId));

  await appendActivity(
    issueId,
    userId,
    "issue.moved",
    { columnId: issue.columnId, position: Number(issue.position) },
    { columnId: input.toColumnId, position: input.position },
  );

  return loadIssueResponse(issueId);
}

export async function listIssueAssignees(issueId: string, userId: string) {
  await requireIssueAccess(issueId, userId);

  return db
    .select({
      id: usersTable.id,
      name: usersTable.name,
      email: usersTable.email,
      image: usersTable.image,
    })
    .from(issueAssigneesTable)
    .innerJoin(usersTable, eq(issueAssigneesTable.userId, usersTable.id))
    .where(eq(issueAssigneesTable.issueId, issueId));
}

export async function assignIssue(issueId: string, userId: string, input: { userId: string }) {
  const access = await requireIssueAccess(issueId, userId);
  ensureWorkspaceWrite(access.role);

  const [membership] = await db
    .select({ userId: workspaceMembersTable.userId })
    .from(workspaceMembersTable)
    .where(
      and(
        eq(workspaceMembersTable.workspaceId, access.workspaceId),
        eq(workspaceMembersTable.userId, input.userId),
      ),
    )
    .limit(1);

  if (!membership) {
    throw badRequest("Invalid request data");
  }

  const [exists] = await db
    .select({ issueId: issueAssigneesTable.issueId })
    .from(issueAssigneesTable)
    .where(
      and(
        eq(issueAssigneesTable.issueId, issueId),
        eq(issueAssigneesTable.userId, input.userId),
      ),
    )
    .limit(1);

  if (exists) {
    throw badRequest("User already assigned");
  }

  await db.insert(issueAssigneesTable).values({
    issueId,
    userId: input.userId,
    assignedAt: new Date(),
  });

  await appendActivity(issueId, userId, "issue.assignee.added", null, { userId: input.userId });

  const [assignee] = await db
    .select({
      id: usersTable.id,
      name: usersTable.name,
      email: usersTable.email,
      image: usersTable.image,
    })
    .from(usersTable)
    .where(eq(usersTable.id, input.userId))
    .limit(1);

  if (!assignee) {
    throw notFound();
  }

  return assignee;
}

export async function unassignIssue(issueId: string, userId: string, targetUserId: string) {
  const access = await requireIssueAccess(issueId, userId);
  ensureWorkspaceWrite(access.role);

  const [existing] = await db
    .select({ issueId: issueAssigneesTable.issueId })
    .from(issueAssigneesTable)
    .where(
      and(
        eq(issueAssigneesTable.issueId, issueId),
        eq(issueAssigneesTable.userId, targetUserId),
      ),
    )
    .limit(1);

  if (!existing) {
    throw notFound();
  }

  await db
    .delete(issueAssigneesTable)
    .where(
      and(
        eq(issueAssigneesTable.issueId, issueId),
        eq(issueAssigneesTable.userId, targetUserId),
      ),
    );

  await appendActivity(issueId, userId, "issue.assignee.removed", { userId: targetUserId }, null);
}

export async function listIssueLabels(issueId: string, userId: string) {
  await requireIssueAccess(issueId, userId);

  return db
    .select({
      id: labelsTable.id,
      projectId: labelsTable.projectId,
      name: labelsTable.name,
      color: labelsTable.color,
      createdAt: labelsTable.createdAt,
      updatedAt: labelsTable.updatedAt,
    })
    .from(issueLabelsTable)
    .innerJoin(labelsTable, eq(issueLabelsTable.labelId, labelsTable.id))
    .where(eq(issueLabelsTable.issueId, issueId));
}

export async function addIssueLabel(issueId: string, userId: string, input: { labelId: string }) {
  const access = await requireIssueAccess(issueId, userId);
  ensureWorkspaceWrite(access.role);

  const [issue] = await db
    .select({ id: issuesTable.id, projectId: issuesTable.projectId })
    .from(issuesTable)
    .where(eq(issuesTable.id, issueId))
    .limit(1);

  if (!issue) {
    throw notFound();
  }

  const [label] = await db
    .select({
      id: labelsTable.id,
      projectId: labelsTable.projectId,
      name: labelsTable.name,
      color: labelsTable.color,
      createdAt: labelsTable.createdAt,
      updatedAt: labelsTable.updatedAt,
    })
    .from(labelsTable)
    .where(eq(labelsTable.id, input.labelId))
    .limit(1);

  if (!label || label.projectId !== issue.projectId) {
    throw badRequest("Invalid request data");
  }

  const [exists] = await db
    .select({ issueId: issueLabelsTable.issueId })
    .from(issueLabelsTable)
    .where(
      and(
        eq(issueLabelsTable.issueId, issueId),
        eq(issueLabelsTable.labelId, input.labelId),
      ),
    )
    .limit(1);

  if (exists) {
    throw badRequest("Label already attached");
  }

  await db.insert(issueLabelsTable).values({ issueId, labelId: input.labelId });
  await appendActivity(issueId, userId, "issue.label.added", null, { labelId: input.labelId });

  return label;
}

export async function removeIssueLabel(
  issueId: string,
  userId: string,
  labelId: string,
) {
  const access = await requireIssueAccess(issueId, userId);
  ensureWorkspaceWrite(access.role);

  const [existing] = await db
    .select({ issueId: issueLabelsTable.issueId })
    .from(issueLabelsTable)
    .where(and(eq(issueLabelsTable.issueId, issueId), eq(issueLabelsTable.labelId, labelId)))
    .limit(1);

  if (!existing) {
    throw notFound();
  }

  await db
    .delete(issueLabelsTable)
    .where(and(eq(issueLabelsTable.issueId, issueId), eq(issueLabelsTable.labelId, labelId)));

  await appendActivity(issueId, userId, "issue.label.removed", { labelId }, null);
}

export async function listIssueActivity(
  issueId: string,
  userId: string,
  input: { limit: number; cursor?: string },
) {
  await requireIssueAccess(issueId, userId);

  const cursor = input.cursor ? parseCursor(input.cursor) : null;
  const filters = [eq(activityEventsTable.issueId, issueId)];

  const rows = await db
    .select({
      id: activityEventsTable.id,
      issueId: activityEventsTable.issueId,
      eventType: activityEventsTable.eventType,
      oldValue: activityEventsTable.oldValue,
      newValue: activityEventsTable.newValue,
      createdAt: activityEventsTable.createdAt,
      actorId: usersTable.id,
      actorName: usersTable.name,
      actorEmail: usersTable.email,
      actorImage: usersTable.image,
    })
    .from(activityEventsTable)
    .innerJoin(usersTable, eq(activityEventsTable.actorId, usersTable.id))
    .where(
      cursor
        ? and(
            ...filters,
            or(
              gt(activityEventsTable.createdAt, new Date(cursor.position)),
              and(
                eq(activityEventsTable.createdAt, new Date(cursor.position)),
                gt(activityEventsTable.id, cursor.id),
              ),
            )!,
          )
        : and(...filters),
    )
    .orderBy(asc(activityEventsTable.createdAt), asc(activityEventsTable.id))
    .limit(input.limit + 1);

  const page = rows.slice(0, input.limit);
  const next = rows.length > input.limit ? page.at(-1) : null;

  return {
    data: page.map((row) => ({
      id: row.id,
      issueId: row.issueId,
      actor: {
        id: row.actorId,
        name: row.actorName,
        email: row.actorEmail,
        image: row.actorImage,
      },
      eventType: row.eventType,
      oldValue: row.oldValue,
      newValue: row.newValue,
      createdAt: row.createdAt,
    })),
    meta: {
      nextCursor: next ? encodeCursor(next.createdAt.toISOString(), next.id) : null,
    },
  };
}
