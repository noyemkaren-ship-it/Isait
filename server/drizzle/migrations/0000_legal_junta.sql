CREATE TABLE `bids` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`comment` text NOT NULL,
	`email` text NOT NULL,
	`number` text NOT NULL,
	`email_or_number` integer
);
--> statement-breakpoint
CREATE TABLE `examples` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`img_link` text NOT NULL,
	`description` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `services` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`description` text NOT NULL,
	`img_link` text NOT NULL
);
