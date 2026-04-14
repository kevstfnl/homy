import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './.drizzle',

  schema: './src/libs/database/schema.ts',
  dialect: 'sqlite',
  dbCredentials: {
    url: process.env.DB_FILE_NAME ?? "homy.sqlite",
  },
});
