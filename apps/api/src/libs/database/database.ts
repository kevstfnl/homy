import { drizzle } from "drizzle-orm/bun-sqlite";
import { relations } from "./relations";
import * as schema from "./schema";

const DB_FILE = process.env.DB_FILE_NAME ?? "homy.sqlite";
export const database = drizzle({
	connection: {
		source: DB_FILE,
	},
	...schema,
	relations,
});
