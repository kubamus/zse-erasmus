ALTER TABLE `board` ADD `is_archived` boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `board` ADD `archived_at` timestamp(3);