import { randomBytes, scryptSync } from "crypto";
import { db } from "..";
import { tAuthTokens } from "../schema";

const token = randomBytes(32).toString("base64url");
const salt = randomBytes(32);
const hash = scryptSync(token, salt, 32);

await db.insert(tAuthTokens).values({
  tokenHash: hash.toString("hex"),
  tokenSalt: salt.toString("hex"),
});

console.info("token:", token);
