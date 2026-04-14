import { sqliteTable } from "drizzle-orm/sqlite-core";

export const agents = sqliteTable("agents", (t) => ({
	id: t.text().primaryKey(),
	name: t.text().notNull(),
	description: t.text(),
	role: t.text("role").notNull(),
	personality: t.text("personality").notNull(),
	model: t.text().notNull(),
	useMemory: t.integer("use_memory", { mode: "boolean" }).default(true),
	useProfile: t.integer("use_profile", { mode: "boolean" }).default(true),
	createdAt: t.integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
}));
