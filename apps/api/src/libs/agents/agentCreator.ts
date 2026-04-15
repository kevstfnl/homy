import { Agent, type AgentTool } from "@mariozechner/pi-agent-core";
import { type Api, getModel, type KnownProvider, type Model } from "@mariozechner/pi-ai";
import { getLemonadeModel } from "./customProvider";

export interface DBAgent {
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

export function createAgent(dbAgent: DBAgent | null | undefined, tools: AgentTool[] = []): Agent {
	if (!dbAgent) throw new Error("Agent not found");

	const [provider, modelId] = dbAgent.model.split(":");
	if (!provider || !modelId)
		throw new Error(`Invalid model format ${dbAgent.id}. Expected "provider:modelId", got "${dbAgent.model}"`);

	let model: Model<Api> | undefined;
	if (provider === "lemonade") {
		model = getLemonadeModel(modelId);
	} else {
		model = getModel(provider as KnownProvider, modelId as never);
	}

	const systemPromptParts = [
		dbAgent.description || `You are ${dbAgent.name}.`,
		`Role: ${dbAgent.role}`,
		`Personality: ${dbAgent.personality}`,
	];

	const systemPrompt = systemPromptParts.filter(Boolean).join("\n\n");

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
