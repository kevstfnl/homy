import { Hono } from "hono";
import { cors } from "hono/cors";
import { secureHeaders } from "hono/secure-headers";
import { agentHandler } from "./handlers/agents/agent.handler";
import { cronHandler } from "./handlers/crons/cron.handler";
import { memoryHandler } from "./handlers/memories/memory.handler";
import { skillHandler } from "./handlers/skills/skill.handler";
import { toolHandler } from "./handlers/tools/tool.handler";

const app = new Hono()
	.use(secureHeaders())
	.use(cors())

	.route("/agents", agentHandler)
	.route("/crons", cronHandler)
	.route("/memories", memoryHandler)
	.route("/skills", skillHandler)
	.route("/tools", toolHandler)

	.notFound((c) => c.json({ message: "Not found" }, 404))
	.onError((err, c) => {
		console.error(err);
		return c.json(err);
	});

export type Api = typeof app;
export default {
	port: 3000,
	fetch: app.fetch,
};
