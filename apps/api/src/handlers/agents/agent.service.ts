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
		try {
			const dbAgent = await getById(id);
			const piAgent = createAgent(dbAgent);

			await piAgent.prompt(message);

			const lastMessage = piAgent.state.messages.at(-1);
			if (!lastMessage || lastMessage.role !== "assistant") throw new Error("No response received from agent");

			const textContent = lastMessage.content.find((c) => "text" in c && c.type === "text");
			const responseText = textContent && "text" in textContent ? textContent.text : "";

			const usage = lastMessage.usage;
			const totalTokens = usage.totalTokens ?? (usage.input ?? 0) + (usage.output ?? 0);

			return {
				response: responseText,
				usage: {
					input: "input" in usage ? Number(usage.input) : 0,
					output: "output" in usage ? Number(usage.output) : 0,
					totalTokens: Number(totalTokens),
					cost: "cost" in usage ? Number((usage).cost) : undefined,
				},
				stopReason: lastMessage.stopReason ?? "unknown",
			};
		} catch (error) {
			const errorMsg = error instanceof Error ? error.message : String(error);
			console.error(`[Agent Prompt Error] ID: ${id}`, errorMsg);
			throw error;
		}
	};

	// Stream prompts to the agent (yields events)
	export async function* promptStream(id: string, message: string) {
		try {
			const dbAgent = await getById(id);
			const piAgent = createAgent(dbAgent);

			let unsubscribe: (() => void) | null = null;
			const eventsQueue: AgentTypes.PromptStreamEvent[] = [];
			let done = false;
			let error: Error | null = null;

			const subscription = piAgent.subscribe((event) => {
				if (event.type === "message_update" && event.assistantMessageEvent?.type === "text_delta") {
					eventsQueue.push({
						type: "delta",
						text: event.assistantMessageEvent.delta,
					});
				}

				if (event.type === "agent_end") {
					const lastMessage = piAgent.state.messages.at(-1);
					if (lastMessage && lastMessage.role === "assistant") {
						const usage = (lastMessage.usage ?? {});
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

				if (event.type === "message_update" && event.assistantMessageEvent?.type === "error") {
					const errMsg = event.assistantMessageEvent.error?.stopReason || "Unknown error";
					error = new Error(errMsg);
					done = true;
				}
			});

			unsubscribe = subscription;

			const promptPromise = piAgent.prompt(message);

			try {
				while (!done || eventsQueue.length > 0) {
					if (eventsQueue.length > 0) {
						yield eventsQueue.shift();
					} else if (!done) {
						await new Promise((resolve) => setTimeout(resolve, 10));
					}
				}

				await promptPromise;
				while (eventsQueue.length > 0) yield eventsQueue.shift();
				if (error) throw error;

			} finally {
				if (unsubscribe) unsubscribe();
			}
		} catch (error) {
			const errorMsg = error instanceof Error ? error.message : String(error);
			console.error(`[Agent Stream Prompt Error] ID: ${id}`, errorMsg);
			yield {
				type: "error",
				error: errorMsg,
			};
		}
	}
}
