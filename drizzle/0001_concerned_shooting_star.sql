CREATE TABLE `tenant_features` (
	`id` text PRIMARY KEY DEFAULT uuid() NOT NULL,
	`tenant_id` text NOT NULL,
	`feature_name` text NOT NULL,
	`is_enabled` integer DEFAULT false,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`tenant_id`) REFERENCES `tenants`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `user_roles` (
	`id` text PRIMARY KEY DEFAULT uuid() NOT NULL,
	`user_id` text NOT NULL,
	`tenant_id` text NOT NULL,
	`role` text NOT NULL,
	`permissions` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`tenant_id`) REFERENCES `tenants`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_tenants` (
	`id` text PRIMARY KEY DEFAULT uuid() NOT NULL,
	`name` text NOT NULL,
	`subdomain` text NOT NULL,
	`domain` text,
	`description` text,
	`logo` text,
	`primary_color` text,
	`secondary_color` text,
	`font_family` text,
	`currency` text DEFAULT 'USD',
	`language` text DEFAULT 'en',
	`timezone` text DEFAULT 'UTC',
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_tenants`("id", "name", "subdomain", "domain", "description", "logo", "primary_color", "secondary_color", "font_family", "currency", "language", "timezone", "created_at", "updated_at") SELECT "id", "name", "subdomain", "domain", "description", "logo", "primary_color", "secondary_color", "font_family", "currency", "language", "timezone", "created_at", "updated_at" FROM `tenants`;--> statement-breakpoint
DROP TABLE `tenants`;--> statement-breakpoint
ALTER TABLE `__new_tenants` RENAME TO `tenants`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `tenants_subdomain_unique` ON `tenants` (`subdomain`);