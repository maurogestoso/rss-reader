import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./drizzle",
  schema: "./app/db/schema.ts",
  dialect: process.env.NODE_ENV === "production" ? "turso" : "sqlite",
  dbCredentials:
    process.env.NODE_ENV === "production"
      ? {
          url: process.env.DB_CONNECTION_STRING!,
          authToken: process.env.DB_AUTH_TOKEN!,
        }
      : {
          url: process.env.DB_CONNECTION_STRING!,
        },
});
