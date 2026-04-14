import { Hono } from "hono";

export const skillHandler = new Hono().get("/").post("/").get("/:id").patch(":id").delete("/:id");
