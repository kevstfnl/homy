import { Hono } from "hono";
import { cors } from "hono/cors";
import { secureHeaders } from "hono/secure-headers";
import { agentsHandler } from "./handlers/agents/agentsHandler";
import { cronsHandler } from "./handlers/crons/cronsHandler";
import { memoriesHandler } from "./handlers/memories/memoriesHandler";
import { skillsHandler } from "./handlers/skills/skillsHandler";
import { toolsHandler } from "./handlers/tools/toolsHandler";

const app = new Hono()
	.use(secureHeaders())
	.use(cors())
	
	.route("/agents", agentsHandler)
	.route("/crons", cronsHandler)
	.route("/memories", memoriesHandler)
	.route("/skills", skillsHandler)
	.route("/tools", toolsHandler)

	.notFound((c) => c.json({ message: "Not found" }, 404))
	.onError((err, c) => {
		console.error(err);
		return c.json(err);
	})

export type Api = typeof app;
export default {
	port: 3000,
	fetch: app.fetch,
};
