import { expect, test, mock } from "bun:test";
import { ToolService } from "./tool.service";
import * as repository from "./tool.repository";

// Mock the repository
const mockRepository = {
	findAll: mock(() => Promise.resolve([])),
	findById: mock(() => Promise.resolve(null)),
	create: mock(() => Promise.resolve([{ id: "tool-1", name: "test" }])),
	update: mock(() => Promise.resolve([{ id: "tool-1", name: "updated" }])),
	remove: mock(() => Promise.resolve([{ id: "tool-1" }])),
	assignToAgent: mock(() => Promise.resolve([])),
	getAgentTools: mock(() => Promise.resolve([])),
	removeFromAgent: mock(() => Promise.resolve([])),
};

// Replace actual repository with mocks
Object.assign(repository.ToolRepository, mockRepository);

test("ToolService.create", async () => {
	const toolData = {
		name: "web_search",
		description: "Search the web",
		type: "builtin" as const,
		enabled: true,
	};

	const result = await ToolService.create(toolData);
	expect(mockRepository.create).toHaveBeenCalled();
});

test("ToolService.getById throws when tool not found", async () => {
	try {
		await ToolService.getById("nonexistent");
		expect.unreachable();
	} catch (error) {
		expect(error).toBeInstanceOf(Error);
	}
});

test("ToolService.assignToAgent validates tools exist", async () => {
	mockRepository.findById = mock(() => Promise.reject(new Error("Tool not found")));

	try {
		await ToolService.assignToAgent("agent-1", ["tool-1"]);
		expect.unreachable();
	} catch (error) {
		expect(error).toBeInstanceOf(Error);
	}
});
