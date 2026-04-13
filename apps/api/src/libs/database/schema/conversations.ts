import { sqliteTable } from "drizzle-orm/sqlite-core";
import { agents } from "./agents";
import { users } from "./users";

export const conversations = sqliteTable("conversations", (t) => ({
	id: t.text().primaryKey(),
	agentId: t
		.text("agent_id")
		.notNull()
		.references(() => agents.id, { onDelete: "cascade" }),
	userId: t
		.text("user_id")
		.notNull()
		.references(() => users.id, { onDelete: "cascade" }),
	sessionId: t.text("session_id").notNull(),
	role: t.text().$type<"user" | "assistant" | "tool_result">().notNull(),
	content: t.text().notNull(),
	stopReason: t.text("stop_reason").$type<"stop" | "toolUse" | "length" | "error" | "aborted">(),
	inputTokens: t.integer("input_tokens"),
	outputTokens: t.integer("output_tokens"),
	createdAt: t.integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
}));
