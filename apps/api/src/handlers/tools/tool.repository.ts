import { and, eq } from "drizzle-orm";
import { database } from "../../libs/database/database";
import { agentTools, tools } from "../../libs/database/schema";
import type { ToolTypes } from "./tool.types";

export namespace ToolRepository {
	export const findAll = () =>
		database.query.tools.findMany({
			with: { agents: true },
		});

	export const findById = (id: string) =>
		database.query.tools.findFirst({
			where: { id },
			with: { agents: true },
		});

	export const create = (data: ToolTypes.Create) =>
		database
			.insert(tools)
			.values({ id: crypto.randomUUID(), ...data })
			.returning();

	export const update = (id: string, data: ToolTypes.Update) =>
		database.update(tools).set(data).where(eq(tools.id, id)).returning();

	export const remove = (id: string) => database.delete(tools).where(eq(tools.id, id)).returning();

	// Assign tools to an agent
	export const assignToAgent = async (agentId: string, toolIds: string[]) => {
		// Remove all existing tool associations
		await database.delete(agentTools).where(eq(agentTools.agentId, agentId));

		// Add new associations if toolIds is not empty
		if (toolIds.length > 0) {
			await database.insert(agentTools).values(
				toolIds.map((toolId) => ({
					agentId,
					toolId,
				})),
			);
		}

		return database.query.agentTools.findMany({
			where: { agentId },
			with: { tool: true },
		});
	};

	// Get tools for an agent
	export const getAgentTools = (agentId: string) =>
		database.query.agentTools.findMany({
			where: { agentId },
			with: { tool: true },
		});

	// Remove a specific tool from an agent
	export const removeFromAgent = (agentId: string, toolId: string) =>
		database
			.delete(agentTools)
			.where(and(eq(agentTools.agentId, agentId), eq(agentTools.toolId, toolId)))
			.returning();
}
