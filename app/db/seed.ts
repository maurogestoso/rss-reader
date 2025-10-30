import { eq } from "drizzle-orm";
import { db } from ".";
import { usersTable } from "./schema";
import { createUser } from "./auth";

async function main() {
  const { insertedId } = await createUser({
    name: "Mauro",
    email: "mauro@example.com",
    password: "password",
  });

  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.id, insertedId));
}

main();
