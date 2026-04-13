import { sqliteTable } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", (t) => ({
	id: t.text().primaryKey(),
	externalId: t.text("external_id"),
	source: t.text().$type<"discord" | "web">().notNull(),
	preferences: t.text({ mode: "json" }).$type<Record<string, unknown>>().default({}),
	createdAt: t.integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
	updatedAt: t.integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
}));
