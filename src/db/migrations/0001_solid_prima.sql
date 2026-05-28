ALTER TABLE `event_types` ADD `is_starred` integer DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `event_types` ADD `is_deleted` integer DEFAULT false NOT NULL;