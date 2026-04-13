import { sqliteTable } from "drizzle-orm/sqlite-core";
import { agents } from "./agents";

export const crons = sqliteTable("crons", (t) => ({
	id: t.text().primaryKey(),
	agentId: t
		.text("agent_id")
		.notNull()
		.references(() => agents.id, { onDelete: "cascade" }),
	schedule: t.text().notNull(),
	prompt: t.text().notNull(),
	enabled: t.integer({ mode: "boolean" }).default(true),
	lastRun: t.integer("last_run", { mode: "timestamp" }),
	createdAt: t.integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
}));
