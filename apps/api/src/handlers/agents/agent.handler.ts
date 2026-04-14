import { Hono } from "hono";

export const agentHandler = new Hono().get("/").post("/").get("/:id").patch(":id").delete("/:id");
