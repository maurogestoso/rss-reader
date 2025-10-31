import { randomBytes, scryptSync, timingSafeEqual } from "crypto";
import { eq } from "drizzle-orm";
import { tUsers } from "./schema";
import { db } from ".";

type NewUser = { password: string } & Omit<
  Omit<typeof tUsers.$inferInsert, "passwordHash">,
  "passwordSalt"
>;

export async function createUser({ name, email, password }: NewUser) {
  const passwordSalt = randomBytes(16);
  const passwordHash = scryptSync(password, passwordSalt, 16);
  const user: typeof tUsers.$inferInsert = {
    name,
    email,
    passwordHash: passwordHash.toString("hex"),
    passwordSalt: passwordSalt.toString("hex"),
  };

  const result = await db
    .insert(tUsers)
    .values(user)
    .returning({ insertedId: tUsers.id });

  return result[0];
}

export async function validateCredentials({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const [user] = await db.select().from(tUsers).where(eq(tUsers.email, email));
  const salt = Buffer.from(user.passwordSalt, "hex");
  const expectedHash = Buffer.from(user.passwordHash, "hex");
  const hash = scryptSync(password, salt, 16);
  const passwordsMatch = timingSafeEqual(hash, expectedHash);
  return passwordsMatch ? user.id : null;
}
