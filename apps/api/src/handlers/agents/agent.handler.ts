import { sValidator } from "@hono/standard-validator";
import { Hono } from "hono";
import { streamSSE } from "hono/streaming";
import * as v from "valibot";
import { AgentService } from "./agent.service";
import { AgentTypes } from "./agent.types";

export const agentHandler = new Hono()
	.get("/", async (c) => c.json(await AgentService.getAll()))
	.post("/", sValidator("json", AgentTypes.createSchema), async (c) =>
		c.json(await AgentService.create(c.req.valid("json"))),
	)
	.get("/:id", sValidator("param", v.object({ id: v.string() })), async (c) => {
		const { id } = c.req.valid("param");
		return c.json(await AgentService.getById(id));
	})
	.patch("/:id", sValidator("json", AgentTypes.updateSchema), sValidator("param", v.object({ id: v.string() })), async (c) => {
		const { id } = c.req.valid("param");
		return c.json(await AgentService.update(id, c.req.valid("json")));
	})
	.delete("/:id", sValidator("param", v.object({ id: v.string() })), async (c) => {
		const { id } = c.req.valid("param");
		return c.json(await AgentService.remove(id));
	})
	.post("/:id/prompt", sValidator("param", v.object({ id: v.string() })), sValidator("json", AgentTypes.promptSchema), async (c) => {
		const { id } = c.req.valid("param");
		return c.json(await AgentService.prompt(id, c.req.valid("json").message));
	})
	.post("/:id/prompt/stream", sValidator("param", v.object({ id: v.string() })), sValidator("json", AgentTypes.promptSchema), (c) => {
		const { id } = c.req.valid("param");
		return streamSSE(c, async (stream) => {
			for await (const event of AgentService.promptStream(id, c.req.valid("json").message)) {
				await stream.writeSSE({ data: JSON.stringify(event) });
			}
		});
	});
