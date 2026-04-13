import { sqliteTable } from "drizzle-orm/sqlite-core";
import { users } from "./users";

export const userFacts = sqliteTable("user_facts", (t) => ({
	id: t.text().primaryKey(),
	userId: t
		.text("user_id")
		.notNull()
		.references(() => users.id, { onDelete: "cascade" }),
	content: t.text().notNull(),
	createdAt: t.integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
}));
