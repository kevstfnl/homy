import { Hono } from "hono";

export const toolsHandler = new Hono()
    .get("/")
    .post("/")
    .get("/:id")
    .patch(":id")
    .delete("/:id")