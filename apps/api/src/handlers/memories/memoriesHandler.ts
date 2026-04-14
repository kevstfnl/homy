import { Hono } from "hono";

export const memoriesHandler = new Hono()
    .get("/")
    .post("/")
    .get("/:id")
    .patch(":id")
    .delete("/:id")