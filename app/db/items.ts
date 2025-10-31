import { eq, and } from "drizzle-orm";
import { db } from ".";
import { feedsTable, newItemsTable } from "./schema";

export async function getAllNewItems(userId: number) {
  return db
    .select({
      id: newItemsTable.id,
      title: newItemsTable.title,
      link: newItemsTable.link,
      pubDate: newItemsTable.pubDate,
      feedTitle: feedsTable.title,
      feedLink: feedsTable.link,
    })
    .from(newItemsTable)
    .where(eq(newItemsTable.userId, userId))
    .innerJoin(feedsTable, eq(newItemsTable.feedId, feedsTable.id));
}

export async function markItemAsRead({
  userId,
  itemId,
}: {
  userId: number;
  itemId: number;
}) {
  return db
    .delete(newItemsTable)
    .where(and(eq(newItemsTable.id, itemId), eq(newItemsTable.userId, userId)));
}
