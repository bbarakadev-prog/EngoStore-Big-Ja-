CREATE TABLE `components` (
	`id` text PRIMARY KEY NOT NULL,
	`part_number` text NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`category` text,
	`manufacturer` text,
	`type` text,
	`distributor` text,
	`availability` text,
	`unit_price` text,
	`created_at` integer,
	`updated_at` integer
);
