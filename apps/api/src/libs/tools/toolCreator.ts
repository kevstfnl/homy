import type { AgentTool } from "@mariozechner/pi-agent-core";
import { createWebSearchTool } from "./toolSearch";

type DBTool = {
	id: string;
	name: string;
	description: string | null;
	enabled: boolean | null;
	type: "builtin" | "npm" | "custom";
	source: string | null;
	config: Record<string, unknown> | null;
	createdAt: Date | null;
};

/**
 * Factory function to convert a DB tool to an AgentTool
 * Currently supports "builtin" type tools (web_search, etc.)
 */
export function createAgentToolFromDB(tool: DBTool): AgentTool | null {
	if (!tool.enabled) return null; // null or false

	switch (tool.type) {
		case "builtin":
			return createBuiltinTool(tool.name);
		case "npm":
		case "custom":
			// TODO: Implement npm/custom tool loading
			console.warn(`Tool type "${tool.type}" not yet implemented for tool "${tool.name}"`);
			return null;
		default:
			return null;
	}
}

/**
 * Create built-in tools by name
 */
export function createBuiltinTool(name: string): AgentTool | null {
	switch (name) {
		case "web_search":
			return createWebSearchTool();
		default:
			return null;
	}
}

/**
 * Convert multiple DB tools to AgentTools
 */
export function createAgentToolsFromDB(tools: DBTool[]): AgentTool[] {
	return tools
		.map((tool) => createAgentToolFromDB(tool))
		.filter((tool): tool is AgentTool => tool !== null);
}
