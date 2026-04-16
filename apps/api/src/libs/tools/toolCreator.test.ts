import { expect, test } from "bun:test";
import { createAgentToolFromDB, createBuiltinTool, createAgentToolsFromDB } from "./toolCreator";

test("createAgentToolFromDB returns null for disabled tools", () => {
	const disabledTool = {
		id: "tool-1",
		name: "web_search",
		description: "Search",
		enabled: false,
		type: "builtin" as const,
		source: null,
		config: null,
		createdAt: null,
	};

	const result = createAgentToolFromDB(disabledTool);
	expect(result).toBeNull();
});

test("createAgentToolFromDB returns AgentTool for enabled builtin tools", () => {
	const enabledTool = {
		id: "tool-1",
		name: "web_search",
		description: "Search",
		enabled: true,
		type: "builtin" as const,
		source: null,
		config: null,
		createdAt: null,
	};

	const result = createAgentToolFromDB(enabledTool);
	expect(result).not.toBeNull();
	expect(result?.name).toBe("web_search");
});

test("createBuiltinTool returns web_search tool", () => {
	const tool = createBuiltinTool("web_search");
	expect(tool).not.toBeNull();
	expect(tool?.name).toBe("web_search");
	expect(tool?.label).toBe("Web Search");
});

test("createBuiltinTool returns null for unknown tools", () => {
	const tool = createBuiltinTool("unknown_tool");
	expect(tool).toBeNull();
});

test("createAgentToolsFromDB filters out null tools", () => {
	const tools = [
		{
			id: "tool-1",
			name: "web_search",
			description: "Search",
			enabled: true,
			type: "builtin" as const,
			source: null,
			config: null,
			createdAt: null,
		},
		{
			id: "tool-2",
			name: "disabled_tool",
			description: "Disabled",
			enabled: false,
			type: "builtin" as const,
			source: null,
			config: null,
			createdAt: null,
		},
	];

	const result = createAgentToolsFromDB(tools);
	expect(result.length).toBe(1);
	expect(result[0]?.name).toBe("web_search");
});
