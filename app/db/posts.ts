import { eq } from "drizzle-orm";
import { db } from ".";
import { postsTable, usersTable } from "./schema";

export function getPostsByUserId(userId: number) {
  return db
    .select({
      id: postsTable.id,
      title: postsTable.title,
      userName: usersTable.name,
      createdAt: postsTable.createdAt,
      url: postsTable.url,
    })
    .from(postsTable)
    .where(eq(postsTable.userId, userId))
    .innerJoin(usersTable, eq(postsTable.userId, usersTable.id))
    .orderBy(postsTable.createdAt);
}

export function getAllPosts() {
  return db
    .select({
      id: postsTable.id,
      title: postsTable.title,
      userName: usersTable.name,
      createdAt: postsTable.createdAt,
    })
    .from(postsTable)
    .innerJoin(usersTable, eq(postsTable.userId, usersTable.id))
    .orderBy(postsTable.createdAt);
}

export async function getPost(postId: number) {
  const result = await db
    .select({
      id: postsTable.id,
      title: postsTable.title,
      userName: usersTable.name,
      createdAt: postsTable.createdAt,
    })
    .from(postsTable)
    .innerJoin(usersTable, eq(postsTable.userId, usersTable.id))
    .where(eq(postsTable.id, postId))
    .limit(1);

  if (!result.length) return null;

  return result[0];
}
