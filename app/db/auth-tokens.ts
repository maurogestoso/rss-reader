import { scryptSync, timingSafeEqual } from "crypto";
import { db } from ".";
import { tAuthTokens } from "./schema";

export async function getAllAuthTokens() {
  return db.select().from(tAuthTokens);
}

export async function validateToken(tokenCandidate: string) {
  const tokens = await getAllAuthTokens();
  return tokens.some((token) => {
    const salt = Buffer.from(token.tokenSalt, "hex");
    const expectedHash = Buffer.from(token.tokenHash, "hex");
    const hash = scryptSync(tokenCandidate, salt, 32);
    const tokensMatch = timingSafeEqual(hash, expectedHash);
    return tokensMatch;
  });
}
