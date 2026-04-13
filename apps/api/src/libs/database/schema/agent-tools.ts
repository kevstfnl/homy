import { sqliteTable } from "drizzle-orm/sqlite-core";
import { agents } from "./agents";
import { tools } from "./tools";

export const agentTools = sqliteTable("agent_tools", (t) => ({
	agentId: t
		.text("agent_id")
		.notNull()
		.references(() => agents.id, { onDelete: "cascade" }),
	toolId: t
		.text("tool_id")
		.notNull()
		.references(() => tools.id, { onDelete: "cascade" }),
}));
