import { Hono } from "hono";

export const cronsHandler = new Hono()
    .get("/")
    .post("/")
    .get("/:id")
    .patch(":id")
    .delete("/:id")