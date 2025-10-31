import { eq } from "drizzle-orm";
import { db } from ".";
import { tUsers } from "./schema";

export async function getUser(userId: number) {
  const result = await db
    .select({
      id: tUsers.id,
      name: tUsers.name,
      email: tUsers.email,
    })
    .from(tUsers)
    .where(eq(tUsers.id, userId));

  if (!result.length) return null;

  return result[0];
}
