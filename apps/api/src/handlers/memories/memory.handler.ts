import { Hono } from "hono";

export const memoryHandler = new Hono().get("/").post("/").get("/:id").patch(":id").delete("/:id");
