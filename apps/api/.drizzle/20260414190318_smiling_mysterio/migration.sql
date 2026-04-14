CREATE TABLE `agent_agents` (
	`agent_id` text NOT NULL,
	`target_agent_id` text NOT NULL,
	CONSTRAINT `fk_agent_agents_agent_id_agents_id_fk` FOREIGN KEY (`agent_id`) REFERENCES `agents`(`id`) ON DELETE CASCADE,
	CONSTRAINT `fk_agent_agents_target_agent_id_agents_id_fk` FOREIGN KEY (`target_agent_id`) REFERENCES `agents`(`id`) ON DELETE CASCADE
);
--> statement-breakpoint
CREATE TABLE `agent_tools` (
	`agent_id` text NOT NULL,
	`tool_id` text NOT NULL,
	CONSTRAINT `fk_agent_tools_agent_id_agents_id_fk` FOREIGN KEY (`agent_id`) REFERENCES `agents`(`id`) ON DELETE CASCADE,
	CONSTRAINT `fk_agent_tools_tool_id_tools_id_fk` FOREIGN KEY (`tool_id`) REFERENCES `tools`(`id`) ON DELETE CASCADE
);
--> statement-breakpoint
CREATE TABLE `agents` (
	`id` text PRIMARY KEY,
	`name` text NOT NULL,
	`description` text,
	`role` text NOT NULL,
	`personality` text NOT NULL,
	`model` text NOT NULL,
	`use_memory` integer DEFAULT true,
	`use_profile` integer DEFAULT true,
	`created_at` integer
);
--> statement-breakpoint
CREATE TABLE `conversations` (
	`id` text PRIMARY KEY,
	`agent_id` text NOT NULL,
	`user_id` text NOT NULL,
	`session_id` text NOT NULL,
	`role` text NOT NULL,
	`content` text NOT NULL,
	`stop_reason` text,
	`input_tokens` integer,
	`output_tokens` integer,
	`created_at` integer,
	CONSTRAINT `fk_conversations_agent_id_agents_id_fk` FOREIGN KEY (`agent_id`) REFERENCES `agents`(`id`) ON DELETE CASCADE,
	CONSTRAINT `fk_conversations_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
);
--> statement-breakpoint
CREATE TABLE `crons` (
	`id` text PRIMARY KEY,
	`agent_id` text NOT NULL,
	`schedule` text NOT NULL,
	`prompt` text NOT NULL,
	`enabled` integer DEFAULT true,
	`last_run` integer,
	`created_at` integer,
	CONSTRAINT `fk_crons_agent_id_agents_id_fk` FOREIGN KEY (`agent_id`) REFERENCES `agents`(`id`) ON DELETE CASCADE
);
--> statement-breakpoint
CREATE TABLE `learnings` (
	`id` text PRIMARY KEY,
	`agent_id` text NOT NULL,
	`type` text NOT NULL,
	`content` text NOT NULL,
	`reinforcements` integer DEFAULT 1,
	`created_at` integer,
	CONSTRAINT `fk_learnings_agent_id_agents_id_fk` FOREIGN KEY (`agent_id`) REFERENCES `agents`(`id`) ON DELETE CASCADE
);
--> statement-breakpoint
CREATE TABLE `tools` (
	`id` text PRIMARY KEY,
	`name` text NOT NULL,
	`description` text,
	`enabled` integer DEFAULT false,
	`type` text NOT NULL,
	`source` text,
	`config` text DEFAULT '{}',
	`created_at` integer
);
--> statement-breakpoint
CREATE TABLE `user_facts` (
	`id` text PRIMARY KEY,
	`user_id` text NOT NULL,
	`content` text NOT NULL,
	`created_at` integer,
	CONSTRAINT `fk_user_facts_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY,
	`external_id` text,
	`source` text NOT NULL,
	`preferences` text DEFAULT '{}',
	`created_at` integer,
	`updated_at` integer
);
