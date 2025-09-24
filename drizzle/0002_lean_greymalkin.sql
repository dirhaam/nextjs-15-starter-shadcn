PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_tenant_features` (
	`id` text PRIMARY KEY NOT NULL,
	`tenant_id` text NOT NULL,
	`feature_name` text NOT NULL,
	`is_enabled` integer DEFAULT false,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`tenant_id`) REFERENCES `tenants`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_tenant_features`("id", "tenant_id", "feature_name", "is_enabled", "created_at", "updated_at") SELECT "id", "tenant_id", "feature_name", "is_enabled", "created_at", "updated_at" FROM `tenant_features`;--> statement-breakpoint
DROP TABLE `tenant_features`;--> statement-breakpoint
ALTER TABLE `__new_tenant_features` RENAME TO `tenant_features`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_user_roles` (
	`id` text PRIMARY KEY NOT NULL,
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
INSERT INTO `__new_user_roles`("id", "user_id", "tenant_id", "role", "permissions", "created_at", "updated_at") SELECT "id", "user_id", "tenant_id", "role", "permissions", "created_at", "updated_at" FROM `user_roles`;--> statement-breakpoint
DROP TABLE `user_roles`;--> statement-breakpoint
ALTER TABLE `__new_user_roles` RENAME TO `user_roles`;