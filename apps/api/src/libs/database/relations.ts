import { defineRelations } from "drizzle-orm";
import * as schema from "./schema";

export const relations = defineRelations(schema, (r) => ({
	users: {
		facts: r.many.userFacts({ from: r.users.id, to: r.userFacts.userId }),
		conversations: r.many.conversations({ from: r.users.id, to: r.conversations.userId }),
	},
	userFacts: {
		user: r.one.users({ from: r.userFacts.userId, to: r.users.id }),
	},
	agents: {
		tools: r.many.agentTools({ from: r.agents.id, to: r.agentTools.agentId }),
		targets: r.many.agentAgents({ from: r.agents.id, to: r.agentAgents.agentId }),
		learnings: r.many.learnings({ from: r.agents.id, to: r.learnings.agentId }),
		conversations: r.many.conversations({ from: r.agents.id, to: r.conversations.agentId }),
		crons: r.many.crons({ from: r.agents.id, to: r.crons.agentId }),
	},
	agentTools: {
		agent: r.one.agents({ from: r.agentTools.agentId, to: r.agents.id }),
		tool: r.one.tools({ from: r.agentTools.toolId, to: r.tools.id }),
	},
	agentAgents: {
		agent: r.one.agents({ from: r.agentAgents.agentId, to: r.agents.id }),
		target: r.one.agents({ from: r.agentAgents.targetAgentId, to: r.agents.id }),
	},
	tools: {
		agents: r.many.agentTools({ from: r.tools.id, to: r.agentTools.toolId }),
	},
	learnings: {
		agent: r.one.agents({ from: r.learnings.agentId, to: r.agents.id }),
	},
	conversations: {
		agent: r.one.agents({ from: r.conversations.agentId, to: r.agents.id }),
		user: r.one.users({ from: r.conversations.userId, to: r.users.id }),
	},
	crons: {
		agent: r.one.agents({ from: r.crons.agentId, to: r.agents.id }),
	},
}));
