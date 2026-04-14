import { Hono } from "hono";

export const toolHandler = new Hono().get("/").post("/").get("/:id").patch(":id").delete("/:id");
