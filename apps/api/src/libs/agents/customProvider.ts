import type { Model } from "@mariozechner/pi-ai";

export function getLemonadeModel(model: string): Model<"openai-completions"> {
	return {
		id: model,
		name: `${model} (Local)`,
		api: "openai-completions",
		provider: "openai",
		baseUrl: "http://localhost:13305/api/v1",
		reasoning: false,
		input: ["text"],
		cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
		contextWindow: 128000,
		maxTokens: 32000,
	};
}
