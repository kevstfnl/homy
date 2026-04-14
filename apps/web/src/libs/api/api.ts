import { createClient } from "@homy/api/client";

/**
 * TODO API route -> .env
 */
export const api = createClient("localhost:3000", {
    init: {
        credentials: "include"
    }
});
