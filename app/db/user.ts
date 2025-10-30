import { eq } from "drizzle-orm";
import { db } from ".";
import { usersTable } from "./schema";

export async function getUser(userId: number) {
  const result = await db
    .select({
      name: usersTable.name,
      email: usersTable.email,
    })
    .from(usersTable)
    .where(eq(usersTable.id, userId));

  if (!result.length) return null;

  return result[0];
}
