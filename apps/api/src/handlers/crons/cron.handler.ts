import { Hono } from "hono";

export const cronHandler = new Hono().get("/").post("/").get("/:id").patch(":id").delete("/:id");
