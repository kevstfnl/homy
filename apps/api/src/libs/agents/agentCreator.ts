import { Agent, type AgentTool } from "@mariozechner/pi-agent-core";
import { getModel } from "@mariozechner/pi-ai";

interface DBAgent {
	id: string;
	name: string;
	description: string | null;
	role: string;
	personality: string;
	model: string;
	useMemory?: boolean | null;
	useProfile?: boolean | null;
	createdAt?: Date | null;
	tools?: unknown[];
	learnings?: unknown[];
}

/**
 * Factory function that creates a pi-agent-core Agent from database agent data
 * Parses model string format: "provider:modelId" (e.g., "anthropic:claude-sonnet-4-20250514")
 */
export function createAgent(dbAgent: DBAgent | null | undefined, tools: AgentTool[] = []): Agent {
	if (!dbAgent) {
		throw new Error("Agent not found");
	}

	// Parse model string format: "provider:modelId"
	const [provider, modelId] = dbAgent.model.split(":");
	if (!provider || !modelId) {
		throw new Error(`Invalid model format for agent ${dbAgent.id}. Expected "provider:modelId", got "${dbAgent.model}"`);
	}

	// Get the model from pi-ai
	const model = getModel(provider as any, modelId);

	// Compose system prompt from agent attributes
	const systemPromptParts = [
		dbAgent.description || `I am ${dbAgent.name}.`,
		`Role: ${dbAgent.role}`,
		`Personality: ${dbAgent.personality}`,
	];

	const systemPrompt = systemPromptParts.filter(Boolean).join("\n\n");

	// Create and return the Agent instance
	return new Agent({
		initialState: {
			systemPrompt,
			model,
			thinkingLevel: "off",
			tools,
			messages: [],
		},
	});
}
