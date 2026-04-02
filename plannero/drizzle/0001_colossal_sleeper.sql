ALTER TABLE `issue_assignee` DROP PRIMARY KEY;--> statement-breakpoint
ALTER TABLE `issue_label` DROP PRIMARY KEY;--> statement-breakpoint
ALTER TABLE `workspace_member` DROP PRIMARY KEY;--> statement-breakpoint
ALTER TABLE `issue_assignee` ADD PRIMARY KEY(`issue_id`,`user_id`);--> statement-breakpoint
ALTER TABLE `issue_label` ADD PRIMARY KEY(`issue_id`,`label_id`);--> statement-breakpoint
ALTER TABLE `workspace_member` ADD PRIMARY KEY(`workspace_id`,`user_id`);--> statement-breakpoint
ALTER TABLE `workspace` ADD `is_archived` boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `workspace` ADD `archived_at` timestamp(3);--> statement-breakpoint
CREATE INDEX `workspace_member_workspaceId_role_idx` ON `workspace_member` (`workspace_id`,`role`);