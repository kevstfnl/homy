import { sqliteTable } from "drizzle-orm/sqlite-core";
import { agents } from "./agents";

export const agentAgents = sqliteTable("agent_agents", (t) => ({
	agentId: t
		.text("agent_id")
		.notNull()
		.references(() => agents.id, { onDelete: "cascade" }),
	targetAgentId: t
		.text("target_agent_id")
		.notNull()
		.references(() => agents.id, { onDelete: "cascade" }),
}));
