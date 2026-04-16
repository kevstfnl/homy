import { ToolRepository } from "./tool.repository";
import type { ToolTypes } from "./tool.types";

export namespace ToolService {
	export const getAll = () => ToolRepository.findAll();

	export const getById = async (id: string) => {
		const tool = await ToolRepository.findById(id);
		if (!tool) throw new Error(`Tool ${id} not found`);
		return tool;
	};

	export const create = (data: ToolTypes.Create) => ToolRepository.create(data);

	export const update = async (id: string, data: ToolTypes.Update) => {
		await getById(id);
		return ToolRepository.update(id, data);
	};

	export const remove = async (id: string) => {
		await getById(id);
		return ToolRepository.remove(id);
	};

	// Assign multiple tools to an agent
	export const assignToAgent = async (agentId: string, toolIds: string[]) => {
		// Validate all tools exist
		for (const toolId of toolIds) {
			await getById(toolId);
		}
		return ToolRepository.assignToAgent(agentId, toolIds);
	};

	// Get all tools for an agent
	export const getAgentTools = (agentId: string) => ToolRepository.getAgentTools(agentId);

	// Add a single tool to an agent
	export const addToAgent = async (agentId: string, toolId: string) => {
		await getById(toolId);
		const existing = await ToolRepository.getAgentTools(agentId);
		const toolIds = existing.map((t) => t.toolId);
		if (!toolIds.includes(toolId)) {
			toolIds.push(toolId);
		}
		return ToolRepository.assignToAgent(agentId, toolIds);
	};

	// Remove a tool from an agent
	export const removeFromAgent = async (agentId: string, toolId: string) => {
		await getById(toolId);
		return ToolRepository.removeFromAgent(agentId, toolId);
	};
}
