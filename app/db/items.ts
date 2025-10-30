import { eq } from "drizzle-orm";
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
