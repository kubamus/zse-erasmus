CREATE TABLE `account` (
	`id` varchar(36) NOT NULL,
	`account_id` text NOT NULL,
	`provider_id` text NOT NULL,
	`user_id` varchar(36) NOT NULL,
	`access_token` text,
	`refresh_token` text,
	`id_token` text,
	`access_token_expires_at` timestamp(3),
	`refresh_token_expires_at` timestamp(3),
	`scope` text,
	`password` text,
	`created_at` timestamp(3) NOT NULL DEFAULT (now()),
	`updated_at` timestamp(3) NOT NULL,
	CONSTRAINT `account_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `activity_event` (
	`id` varchar(36) NOT NULL,
	`issue_id` varchar(36) NOT NULL,
	`actor_id` varchar(36) NOT NULL,
	`event_type` text NOT NULL,
	`old_value` json,
	`new_value` json,
	`created_at` timestamp(3) NOT NULL DEFAULT (now()),
	CONSTRAINT `activity_event_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `board_column` (
	`id` varchar(36) NOT NULL,
	`board_id` varchar(36) NOT NULL,
	`name` varchar(60) NOT NULL,
	`position` decimal(20,6) NOT NULL,
	`wip_limit` int,
	`is_done_column` boolean NOT NULL DEFAULT false,
	`created_at` timestamp(3) NOT NULL DEFAULT (now()),
	`updated_at` timestamp(3) NOT NULL DEFAULT (now()),
	CONSTRAINT `board_column_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `board` (
	`id` varchar(36) NOT NULL,
	`project_id` varchar(36) NOT NULL,
	`name` varchar(120) NOT NULL,
	`type` enum('kanban','scrum') NOT NULL,
	`created_at` timestamp(3) NOT NULL DEFAULT (now()),
	`updated_at` timestamp(3) NOT NULL DEFAULT (now()),
	CONSTRAINT `board_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `comment` (
	`id` varchar(36) NOT NULL,
	`issue_id` varchar(36) NOT NULL,
	`author_id` varchar(36) NOT NULL,
	`body` text NOT NULL,
	`created_at` timestamp(3) NOT NULL DEFAULT (now()),
	`updated_at` timestamp(3) NOT NULL DEFAULT (now()),
	`deleted_at` timestamp(3),
	CONSTRAINT `comment_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `issue_assignee` (
	`issue_id` varchar(36) NOT NULL,
	`user_id` varchar(36) NOT NULL,
	`assigned_at` timestamp(3) NOT NULL DEFAULT (now()),
	CONSTRAINT `issue_assignee_issue_id_user_id_pk` PRIMARY KEY(`issue_id`,`user_id`)
);
--> statement-breakpoint
CREATE TABLE `issue_label` (
	`issue_id` varchar(36) NOT NULL,
	`label_id` varchar(36) NOT NULL,
	CONSTRAINT `issue_label_issue_id_label_id_pk` PRIMARY KEY(`issue_id`,`label_id`)
);
--> statement-breakpoint
CREATE TABLE `issue` (
	`id` varchar(36) NOT NULL,
	`project_id` varchar(36) NOT NULL,
	`board_id` varchar(36) NOT NULL,
	`column_id` varchar(36) NOT NULL,
	`issue_number` int NOT NULL,
	`title` varchar(200) NOT NULL,
	`description` text,
	`type` enum('task','bug','story','chore') NOT NULL,
	`priority` enum('low','medium','high','critical') NOT NULL,
	`reporter_id` varchar(36) NOT NULL,
	`due_date` timestamp(3),
	`estimate_points` decimal(10,2),
	`position` decimal(20,6) NOT NULL,
	`created_at` timestamp(3) NOT NULL DEFAULT (now()),
	`updated_at` timestamp(3) NOT NULL DEFAULT (now()),
	`deleted_at` timestamp(3),
	CONSTRAINT `issue_id` PRIMARY KEY(`id`),
	CONSTRAINT `issue_projectId_issueNumber_unique` UNIQUE(`project_id`,`issue_number`)
);
--> statement-breakpoint
CREATE TABLE `label` (
	`id` varchar(36) NOT NULL,
	`project_id` varchar(36) NOT NULL,
	`name` varchar(40) NOT NULL,
	`color` varchar(7) NOT NULL,
	`created_at` timestamp(3) NOT NULL DEFAULT (now()),
	`updated_at` timestamp(3) NOT NULL DEFAULT (now()),
	CONSTRAINT `label_id` PRIMARY KEY(`id`),
	CONSTRAINT `label_projectId_name_unique` UNIQUE(`project_id`,`name`)
);
--> statement-breakpoint
CREATE TABLE `project` (
	`id` varchar(36) NOT NULL,
	`workspace_id` varchar(36) NOT NULL,
	`key` varchar(10) NOT NULL,
	`name` varchar(120) NOT NULL,
	`description` text,
	`is_archived` boolean NOT NULL DEFAULT false,
	`created_at` timestamp(3) NOT NULL DEFAULT (now()),
	`updated_at` timestamp(3) NOT NULL DEFAULT (now()),
	CONSTRAINT `project_id` PRIMARY KEY(`id`),
	CONSTRAINT `project_workspaceId_key_unique` UNIQUE(`workspace_id`,`key`)
);
--> statement-breakpoint
CREATE TABLE `session` (
	`id` varchar(36) NOT NULL,
	`expires_at` timestamp(3) NOT NULL,
	`token` varchar(255) NOT NULL,
	`created_at` timestamp(3) NOT NULL DEFAULT (now()),
	`updated_at` timestamp(3) NOT NULL,
	`ip_address` text,
	`user_agent` text,
	`user_id` varchar(36) NOT NULL,
	CONSTRAINT `session_id` PRIMARY KEY(`id`),
	CONSTRAINT `session_token_unique` UNIQUE(`token`)
);
--> statement-breakpoint
CREATE TABLE `user` (
	`id` varchar(36) NOT NULL,
	`name` varchar(255) NOT NULL,
	`email` varchar(255) NOT NULL,
	`email_verified` boolean NOT NULL DEFAULT false,
	`image` text,
	`created_at` timestamp(3) NOT NULL DEFAULT (now()),
	`updated_at` timestamp(3) NOT NULL DEFAULT (now()),
	CONSTRAINT `user_id` PRIMARY KEY(`id`),
	CONSTRAINT `user_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `verification` (
	`id` varchar(36) NOT NULL,
	`identifier` varchar(255) NOT NULL,
	`value` text NOT NULL,
	`expires_at` timestamp(3) NOT NULL,
	`created_at` timestamp(3) NOT NULL DEFAULT (now()),
	`updated_at` timestamp(3) NOT NULL DEFAULT (now()),
	CONSTRAINT `verification_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `workspace_member` (
	`workspace_id` varchar(36) NOT NULL,
	`user_id` varchar(36) NOT NULL,
	`role` enum('owner','admin','member') NOT NULL,
	`joined_at` timestamp(3) NOT NULL DEFAULT (now()),
	CONSTRAINT `workspace_member_workspace_id_user_id_pk` PRIMARY KEY(`workspace_id`,`user_id`)
);
--> statement-breakpoint
CREATE TABLE `workspace` (
	`id` varchar(36) NOT NULL,
	`name` varchar(80) NOT NULL,
	`slug` varchar(120) NOT NULL,
	`created_at` timestamp(3) NOT NULL DEFAULT (now()),
	`updated_at` timestamp(3) NOT NULL DEFAULT (now()),
	CONSTRAINT `workspace_id` PRIMARY KEY(`id`),
	CONSTRAINT `workspace_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
ALTER TABLE `account` ADD CONSTRAINT `account_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `activity_event` ADD CONSTRAINT `activity_event_issue_id_issue_id_fk` FOREIGN KEY (`issue_id`) REFERENCES `issue`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `activity_event` ADD CONSTRAINT `activity_event_actor_id_user_id_fk` FOREIGN KEY (`actor_id`) REFERENCES `user`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `board_column` ADD CONSTRAINT `board_column_board_id_board_id_fk` FOREIGN KEY (`board_id`) REFERENCES `board`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `board` ADD CONSTRAINT `board_project_id_project_id_fk` FOREIGN KEY (`project_id`) REFERENCES `project`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `comment` ADD CONSTRAINT `comment_issue_id_issue_id_fk` FOREIGN KEY (`issue_id`) REFERENCES `issue`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `comment` ADD CONSTRAINT `comment_author_id_user_id_fk` FOREIGN KEY (`author_id`) REFERENCES `user`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `issue_assignee` ADD CONSTRAINT `issue_assignee_issue_id_issue_id_fk` FOREIGN KEY (`issue_id`) REFERENCES `issue`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `issue_assignee` ADD CONSTRAINT `issue_assignee_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `issue_label` ADD CONSTRAINT `issue_label_issue_id_issue_id_fk` FOREIGN KEY (`issue_id`) REFERENCES `issue`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `issue_label` ADD CONSTRAINT `issue_label_label_id_label_id_fk` FOREIGN KEY (`label_id`) REFERENCES `label`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `issue` ADD CONSTRAINT `issue_project_id_project_id_fk` FOREIGN KEY (`project_id`) REFERENCES `project`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `issue` ADD CONSTRAINT `issue_board_id_board_id_fk` FOREIGN KEY (`board_id`) REFERENCES `board`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `issue` ADD CONSTRAINT `issue_column_id_board_column_id_fk` FOREIGN KEY (`column_id`) REFERENCES `board_column`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `issue` ADD CONSTRAINT `issue_reporter_id_user_id_fk` FOREIGN KEY (`reporter_id`) REFERENCES `user`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `label` ADD CONSTRAINT `label_project_id_project_id_fk` FOREIGN KEY (`project_id`) REFERENCES `project`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `project` ADD CONSTRAINT `project_workspace_id_workspace_id_fk` FOREIGN KEY (`workspace_id`) REFERENCES `workspace`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `session` ADD CONSTRAINT `session_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `workspace_member` ADD CONSTRAINT `workspace_member_workspace_id_workspace_id_fk` FOREIGN KEY (`workspace_id`) REFERENCES `workspace`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `workspace_member` ADD CONSTRAINT `workspace_member_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `account_userId_idx` ON `account` (`user_id`);--> statement-breakpoint
CREATE INDEX `activity_event_issueId_createdAt_idx` ON `activity_event` (`issue_id`,`created_at`);--> statement-breakpoint
CREATE INDEX `activity_event_actorId_idx` ON `activity_event` (`actor_id`);--> statement-breakpoint
CREATE INDEX `board_column_boardId_position_idx` ON `board_column` (`board_id`,`position`);--> statement-breakpoint
CREATE INDEX `board_projectId_idx` ON `board` (`project_id`);--> statement-breakpoint
CREATE INDEX `comment_issueId_createdAt_idx` ON `comment` (`issue_id`,`created_at`);--> statement-breakpoint
CREATE INDEX `comment_authorId_idx` ON `comment` (`author_id`);--> statement-breakpoint
CREATE INDEX `issue_assignee_userId_issueId_idx` ON `issue_assignee` (`user_id`,`issue_id`);--> statement-breakpoint
CREATE INDEX `issue_label_labelId_idx` ON `issue_label` (`label_id`);--> statement-breakpoint
CREATE INDEX `issue_columnId_position_idx` ON `issue` (`column_id`,`position`);--> statement-breakpoint
CREATE INDEX `issue_reporterId_idx` ON `issue` (`reporter_id`);--> statement-breakpoint
CREATE INDEX `issue_dueDate_idx` ON `issue` (`due_date`);--> statement-breakpoint
CREATE INDEX `issue_projectId_idx` ON `issue` (`project_id`);--> statement-breakpoint
CREATE INDEX `label_projectId_idx` ON `label` (`project_id`);--> statement-breakpoint
CREATE INDEX `project_workspaceId_idx` ON `project` (`workspace_id`);--> statement-breakpoint
CREATE INDEX `session_userId_idx` ON `session` (`user_id`);--> statement-breakpoint
CREATE INDEX `verification_identifier_idx` ON `verification` (`identifier`);--> statement-breakpoint
CREATE INDEX `workspace_member_userId_idx` ON `workspace_member` (`user_id`);