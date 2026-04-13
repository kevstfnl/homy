import { sqliteTable } from "drizzle-orm/sqlite-core";
import { agents } from "./agents";

export const learnings = sqliteTable("learnings", (t) => ({
	id: t.text().primaryKey(),
	agentId: t
		.text("agent_id")
		.notNull()
		.references(() => agents.id, { onDelete: "cascade" }),
	type: t.text().$type<"mistake" | "best_practice" | "fact">().notNull(),
	content: t.text().notNull(),
	reinforcements: t.integer().default(1),
	createdAt: t.integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
}));
