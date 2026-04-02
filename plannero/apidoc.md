# Plannero API Data Model

This document explains the data structure for a simple Trello/Jira-like app.

## Scope

This model covers:

- workspace/team hierarchy
- project and board setup
- issues (cards/tickets)
- comments, labels, and issue history

This version does not include file attachments.

## Existing auth tables

Already present in the project:

- `user`
- `account`
- `session`
- `verification`

The domain tables below reference `user.id` where needed.

## Domain tables

### 1) workspace

Purpose: top-level tenant/team container.

Columns:

- `id` (PK, uuid)
- `name` (varchar)
- `slug` (varchar, unique)
- `created_at` (timestamp)
- `updated_at` (timestamp)

Indexes:

- unique(`slug`)

### 2) workspace_member

Purpose: users participating in a workspace.

Columns:

- `workspace_id` (FK -> workspace.id)
- `user_id` (FK -> user.id)
- `role` (enum: owner/admin/member)
- `joined_at` (timestamp)

Indexes:

- unique(`workspace_id`, `user_id`)
- index(`user_id`)

### 3) project

Purpose: logical product/project grouping inside workspace.

Columns:

- `id` (PK, uuid)
- `workspace_id` (FK -> workspace.id)
- `key` (varchar, e.g. APP)
- `name` (varchar)
- `description` (text, nullable)
- `is_archived` (boolean)
- `created_at` (timestamp)
- `updated_at` (timestamp)

Indexes:

- unique(`workspace_id`, `key`)
- index(`workspace_id`)

### 4) board

Purpose: kanban/scrum board under a project.

Columns:

- `id` (PK, uuid)
- `project_id` (FK -> project.id)
- `name` (varchar)
- `type` (enum: kanban/scrum)
- `created_at` (timestamp)
- `updated_at` (timestamp)

Indexes:

- index(`project_id`)

### 5) board_column

Purpose: statuses/columns on a board.

Columns:

- `id` (PK, uuid)
- `board_id` (FK -> board.id)
- `name` (varchar)
- `position` (numeric)
- `wip_limit` (int, nullable)
- `is_done_column` (boolean)
- `created_at` (timestamp)
- `updated_at` (timestamp)

Indexes:

- index(`board_id`, `position`)

Notes:

- `position` should use spaced values (e.g. 1000, 2000, 3000) for easy drag-drop reordering.

### 6) issue

Purpose: primary work item (card/ticket).

Columns:

- `id` (PK, uuid)
- `project_id` (FK -> project.id)
- `board_id` (FK -> board.id)
- `column_id` (FK -> board_column.id)
- `issue_number` (int, per-project sequence)
- `title` (varchar)
- `description` (text, markdown, nullable)
- `type` (enum: task/bug/story/chore)
- `priority` (enum: low/medium/high/critical)
- `reporter_id` (FK -> user.id)
- `due_date` (timestamp, nullable)
- `estimate_points` (numeric, nullable)
- `position` (numeric)
- `created_at` (timestamp)
- `updated_at` (timestamp)
- `deleted_at` (timestamp, nullable)

Indexes:

- unique(`project_id`, `issue_number`)
- index(`column_id`, `position`)
- index(`reporter_id`)
- index(`due_date`)
- index(`project_id`)

Notes:

- use `deleted_at` for soft delete.

### 7) issue_assignee

Purpose: many-to-many assignment between issue and users.

Columns:

- `issue_id` (FK -> issue.id)
- `user_id` (FK -> user.id)
- `assigned_at` (timestamp)

Indexes:

- unique(`issue_id`, `user_id`)
- index(`user_id`, `issue_id`)

### 8) label

Purpose: reusable labels per project.

Columns:

- `id` (PK, uuid)
- `project_id` (FK -> project.id)
- `name` (varchar)
- `color` (char(7), hex)
- `created_at` (timestamp)
- `updated_at` (timestamp)

Indexes:

- unique(`project_id`, `name`)
- index(`project_id`)

### 9) issue_label

Purpose: many-to-many relation between issues and labels.

Columns:

- `issue_id` (FK -> issue.id)
- `label_id` (FK -> label.id)

Indexes:

- unique(`issue_id`, `label_id`)
- index(`label_id`)

### 10) comment

Purpose: discussion under an issue.

Columns:

- `id` (PK, uuid)
- `issue_id` (FK -> issue.id)
- `author_id` (FK -> user.id)
- `body` (text, markdown)
- `created_at` (timestamp)
- `updated_at` (timestamp)
- `deleted_at` (timestamp, nullable)

Indexes:

- index(`issue_id`, `created_at`)
- index(`author_id`)

Notes:

- use `deleted_at` for soft delete.

### 11) activity_event

Purpose: immutable issue history/audit timeline.

Columns:

- `id` (PK, uuid)
- `issue_id` (FK -> issue.id)
- `actor_id` (FK -> user.id)
- `event_type` (varchar, e.g. issue.moved, issue.priority_changed)
- `old_value` (json, nullable)
- `new_value` (json, nullable)
- `created_at` (timestamp)

Indexes:

- index(`issue_id`, `created_at`)
- index(`actor_id`)

## Relation map

- One workspace has many projects.
- One workspace has many members.
- One project has many boards.
- One board has many columns.
- One column has many issues.
- One issue has many comments.
- One issue has many assignees (through issue_assignee).
- One issue has many labels (through issue_label).
- One issue has many activity events.

## Storage decisions

- IDs: UUID strings for globally unique identifiers.
- Human references: (`project.key` + `issue.issue_number`) for UI references like APP-42.
- Ordering: numeric `position` for board columns and issues.
- Text fields: markdown in `issue.description` and `comment.body`.
- Soft delete: `deleted_at` in `issue` and `comment`.
- Multi-tenancy boundaries: workspace -> project -> board -> issue.

## API contract file

The API contract implementing this model is in `openapi.yaml`.
