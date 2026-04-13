import { Hono } from "hono";
import { cors } from "hono/cors";
import { secureHeaders } from "hono/secure-headers";

const app = new Hono()
	.use(secureHeaders())
	.use(cors())
	.get("/", (c) => {
		return c.text("Hello Hono!");
	});

export type Api = typeof app;
export default {
	port: 3000,
	fetch: app.fetch,
};
