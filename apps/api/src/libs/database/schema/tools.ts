import { sqliteTable } from "drizzle-orm/sqlite-core";

export const tools = sqliteTable("tools", (t) => ({
	id: t.text().primaryKey(),
	name: t.text().notNull(),
	description: t.text(),
	type: t.text().$type<"builtin" | "npm" | "custom">().notNull(),
	source: t.text(),
	config: t.text({ mode: "json" }).$type<Record<string, unknown>>().default({}),
	createdAt: t.integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
}));
