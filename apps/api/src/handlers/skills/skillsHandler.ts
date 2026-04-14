import { Hono } from "hono";

export const skillsHandler = new Hono()
    .get("/")
    .post("/")
    .get("/:id")
    .patch(":id")
    .delete("/:id")