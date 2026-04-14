import { createAgent } from "../../libs/agents/agentCreator";
import { AgentRepository } from "./agent.repository";
import type { AgentTypes } from "./agent.types";

export namespace AgentService {
	export const getAll = () => AgentRepository.findAll();

	export const getById = async (id: string) => {
		const agent = await AgentRepository.findById(id);
		if (!agent) throw new Error(`Agent ${id} not found`);
		return agent;
	};

	export const create = (data: AgentTypes.Create) => AgentRepository.create(data);

	export const update = async (id: string, data: AgentTypes.Update) => {
		await getById(id);
		return AgentRepository.update(id, data);
	};

	export const remove = async (id: string) => {
		await getById(id);
		return AgentRepository.remove(id);
	};

	// Prompt the agent and get complete response
	export const prompt = async (id: string, message: string): Promise<AgentTypes.PromptResponse> => {
		const dbAgent = await getById(id);
		const piAgent = createAgent(dbAgent);

		// Send the prompt and wait for completion
		await piAgent.prompt(message);

		// Extract the last assistant message
		const lastMessage = piAgent.state.messages.at(-1);
		if (!lastMessage || lastMessage.role !== "assistant") {
			throw new Error("No response received from agent");
		}

		// Extract text content and usage
		const textContent = lastMessage.content.find((c) => "text" in c && c.type === "text");
		const responseText = textContent && "text" in textContent ? textContent.text : "";

		// Extract usage from the message
		const usage = (lastMessage.usage ?? {}) as any;
		const totalTokens = usage.totalTokens ?? (usage.input ?? 0) + (usage.output ?? 0);

		return {
			response: responseText,
			usage: {
				input: "input" in usage ? Number(usage.input) : 0,
				output: "output" in usage ? Number(usage.output) : 0,
				totalTokens: Number(totalTokens),
				cost: "cost" in usage ? Number((usage as any).cost) : undefined,
			},
			stopReason: lastMessage.stopReason ?? "unknown",
		};
	};

	// Stream prompts to the agent (yields events)
	export async function* promptStream(id: string, message: string) {
		const dbAgent = await getById(id);
		const piAgent = createAgent(dbAgent);

		// Subscribe to agent events for streaming
		let unsubscribe: (() => void) | null = null;
		const eventsQueue: AgentTypes.PromptStreamEvent[] = [];
		let done = false;
		let error: Error | null = null;

		const subscription = piAgent.subscribe((event: any) => {
			// Yield text deltas
			if (event.type === "message_update" && event.assistantMessageEvent?.type === "text_delta") {
				eventsQueue.push({
					type: "delta",
					text: event.assistantMessageEvent.delta,
				});
			}

			// Yield final message with usage
			if (event.type === "agent_end") {
				const lastMessage = piAgent.state.messages.at(-1);
				if (lastMessage && lastMessage.role === "assistant") {
					const usage = (lastMessage.usage ?? {}) as any;
					eventsQueue.push({
						type: "done",
						usage: {
							input: usage.input ?? 0,
							output: usage.output ?? 0,
							totalTokens: usage.totalTokens ?? (usage.input ?? 0) + (usage.output ?? 0),
						},
						stopReason: lastMessage.stopReason ?? "unknown",
					});
				}
				done = true;
			}

			// Handle errors
			if (event.type === "message_update" && event.assistantMessageEvent?.type === "error") {
				const errMsg = event.assistantMessageEvent.error?.message || "Unknown error";
				error = new Error(errMsg);
				done = true;
			}
		});

		unsubscribe = subscription;

		// Send the prompt (non-awaiting to allow streaming)
		const promptPromise = piAgent.prompt(message);

		try {
			// Yield events as they arrive
			while (!done || eventsQueue.length > 0) {
				if (eventsQueue.length > 0) {
					yield eventsQueue.shift()!;
				} else if (!done) {
					// Small delay to avoid busy waiting
					await new Promise((resolve) => setTimeout(resolve, 10));
				}
			}

			// Wait for prompt to finish
			await promptPromise;

			// Yield any remaining events
			while (eventsQueue.length > 0) {
				yield eventsQueue.shift()!;
			}

			if (error) {
				throw error;
			}
		} finally {
			if (unsubscribe) {
				unsubscribe();
			}
		}
	}
}
