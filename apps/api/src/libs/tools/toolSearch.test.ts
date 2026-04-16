import { expect, test } from "bun:test";
import { createWebSearchTool } from "./toolSearch";

test("createWebSearchTool returns valid AgentTool", () => {
	const tool = createWebSearchTool();

	expect(tool).not.toBeNull();
	expect(tool.name).toBe("web_search");
	expect(tool.label).toBe("Web Search");
	expect(tool.description).toBeDefined();
	expect(tool.parameters).toBeDefined();
	expect(tool.execute).toBeDefined();
});

test("web_search tool execute with valid query", async () => {
	const tool = createWebSearchTool();

	const result = await tool.execute("call-1", {
		query: "claude ai",
		max_results: 3,
	});

	expect(result).toHaveProperty("content");
	expect(result).toHaveProperty("details");
	expect(Array.isArray(result.content)).toBe(true);
	expect(result.content[0]?.type).toBe("text");
});

test("web_search tool returns error on fetch failure", async () => {
	const tool = createWebSearchTool();

	// This will likely fail or return no results but should handle gracefully
	const result = await tool.execute("call-2", {
		query: "",
		max_results: 1,
	});

	expect(result).toHaveProperty("content");
	expect(result.content[0]?.type).toBe("text");
});
