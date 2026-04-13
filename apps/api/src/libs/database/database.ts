import { drizzle } from "drizzle-orm/bun-sqlite";

const DB_FILE = process.env.DB_FILE_NAME ?? "homy.sqlite";
export const database = drizzle(DB_FILE);
