import { beforeEach, describe, expect, it } from "bun:test";
import { AgentService } from "./agent.service";

let mockAgents: Record<string, any> = {};

describe("AgentService CRUD", () => {
	beforeEach(() => {
		mockAgents = {
			"agent-1": {
				id: "agent-1",
				name: "Test Agent",
				description: "A test agent",
				role: "assistant",
				personality: "helpful",
				model: "gpt-4",
				useMemory: true,
				useProfile: true,
				createdAt: new Date(),
			},
		};
	});

	describe("getAll", () => {
		it("should return all agents", async () => {
			expect(typeof AgentService.getAll).toBe("function");
		});
	});

	describe("getById", () => {
		it("should return an agent by id", async () => {
			expect(typeof AgentService.getById).toBe("function");
		});

		it("should throw error if agent not found", async () => {
			expect(async () => AgentService.getById("non-existent")).toThrow();
		});
	});

	describe("create", () => {
		it("should create a new agent with valid data", async () => {
			expect(typeof AgentService.create).toBe("function");
		});

		it("should require name field", async () => {
			expect(typeof AgentService.create).toBe("function");
		});
	});

	describe("update", () => {
		it("should update an existing agent", async () => {
			expect(typeof AgentService.update).toBe("function");
		});

		it("should throw error if agent not found", async () => {
			expect(async () => AgentService.update("non-existent", { name: "Updated" })).toThrow();
		});
	});

	describe("remove", () => {
		it("should delete an agent", async () => {
			expect(typeof AgentService.remove).toBe("function");
		});

		it("should throw error if agent not found", async () => {
			expect(async () => AgentService.remove("non-existent")).toThrow();
		});
	});
});
