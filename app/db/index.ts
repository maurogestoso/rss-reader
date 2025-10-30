import { drizzle } from "drizzle-orm/libsql";

export const db = drizzle({
  connection: {
    url: process.env.DB_CONNECTION_STRING!,
    authToken: process.env.DB_AUTH_TOKEN!,
  },
});
