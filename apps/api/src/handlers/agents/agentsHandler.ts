import { Hono } from "hono";

export const agentsHandler = new Hono()
    .get("/")
    .post("/")
    .get("/:id")
    .patch(":id")
    .delete("/:id")