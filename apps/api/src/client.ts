import { hc } from "hono/client";
import type { Api } from ".";

export const createClient = (baseUrl: string) => hc<Api>(baseUrl);
export type Client = ReturnType<typeof createClient>;
