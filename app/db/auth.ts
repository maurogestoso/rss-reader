import { randomBytes, scryptSync, timingSafeEqual } from "crypto";
import { eq } from "drizzle-orm";
import { usersTable } from "./schema";
import { db } from ".";

type NewUser = {password:string}&Omit<Omit<typeof usersTable.$inferInsert, "passwordHash">, "passwordSalt">;

export async function createUser({
  name,
  email,
  password,
}: NewUser) {
  const passwordSalt = randomBytes(16);
  const passwordHash = scryptSync(password, passwordSalt, 16);
  const user: typeof usersTable.$inferInsert = {
    name,
    email,
    passwordHash: passwordHash.toString("hex"),
    passwordSalt: passwordSalt.toString("hex"),
  };

  const result = await db
    .insert(usersTable)
    .values(user)
    .returning({ insertedId: usersTable.id });

  return result[0];
}

export async function validateCredentials({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email));
  const salt = Buffer.from(user.passwordSalt, "hex");
  const expectedHash = Buffer.from(user.passwordHash, "hex");
  const hash = scryptSync(password, salt, 16);
  const passwordsMatch = timingSafeEqual(hash, expectedHash);
  return passwordsMatch ? user.id : null;
}
