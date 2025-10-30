import "dotenv/config";
import { drizzle } from "drizzle-orm/libsql";

export const db = createDb({ env: process.env.NODE_ENV! });

function createDb({ env }: { env: string }) {
  if (env === "production") {
    return drizzle({
      connection: {
        url: process.env.TURSO_CONNECTION_URL!,
        authToken: process.env.TURSO_AUTH_TOKEN!,
      },
    });
  } else if (env === "test") {
    return drizzle(process.env.DB_TEST_FILE_NAME!);
  }

  return drizzle(process.env.DB_FILE_NAME!);
}
