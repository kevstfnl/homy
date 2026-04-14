import { type ClientRequestOptions, hc } from "hono/client";
import type { Api } from ".";

export const createClient = (baseUrl: string, options?: ClientRequestOptions) => hc<Api>(baseUrl, options);
export type Client = ReturnType<typeof createClient>;
