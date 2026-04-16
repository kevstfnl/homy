import { sValidator } from "@hono/standard-validator";
import { Hono } from "hono";
import * as v from "valibot";
import { ToolService } from "./tool.service";
import { ToolTypes } from "./tool.types";

export const toolHandler = new Hono()
	.get("/", async (c) => c.json(await ToolService.getAll()))
	.post("/", sValidator("json", ToolTypes.createSchema), async (c) =>
		c.json(await ToolService.create(c.req.valid("json"))),
	)
	.get("/:id", sValidator("param", v.object({ id: v.string() })), async (c) => {
		const { id } = c.req.valid("param");
		return c.json(await ToolService.getById(id));
	})
	.patch(
		"/:id",
		sValidator("json", ToolTypes.updateSchema),
		sValidator("param", v.object({ id: v.string() })),
		async (c) => {
			const { id } = c.req.valid("param");
			return c.json(await ToolService.update(id, c.req.valid("json")));
		},
	)
	.delete("/:id", sValidator("param", v.object({ id: v.string() })), async (c) => {
		const { id } = c.req.valid("param");
		return c.json(await ToolService.remove(id));
	})
	// Agent tool management
	.get(
		"/:id/agents",
		sValidator("param", v.object({ id: v.string() })),
		async (c) => {
			const { id } = c.req.valid("param");
			const tool = await ToolService.getById(id);
			return c.json(tool.agents);
		},
	)
	.post(
		"/agents/:agentId/tools",
		sValidator("param", v.object({ agentId: v.string() })),
		sValidator("json", ToolTypes.assignSchema),
		async (c) => {
			const { agentId } = c.req.valid("param");
			const { toolIds } = c.req.valid("json");
			return c.json(await ToolService.assignToAgent(agentId, toolIds));
		},
	)
	.get(
		"/agents/:agentId/tools",
		sValidator("param", v.object({ agentId: v.string() })),
		async (c) => {
			const { agentId } = c.req.valid("param");
			return c.json(await ToolService.getAgentTools(agentId));
		},
	)
	.post(
		"/agents/:agentId/tools/:toolId",
		sValidator("param", v.object({ agentId: v.string(), toolId: v.string() })),
		async (c) => {
			const { agentId, toolId } = c.req.valid("param");
			return c.json(await ToolService.addToAgent(agentId, toolId));
		},
	)
	.delete(
		"/agents/:agentId/tools/:toolId",
		sValidator("param", v.object({ agentId: v.string(), toolId: v.string() })),
		async (c) => {
			const { agentId, toolId } = c.req.valid("param");
			return c.json(await ToolService.removeFromAgent(agentId, toolId));
		},
	);
