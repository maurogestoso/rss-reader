import { desc, eq } from "drizzle-orm";
import { db } from ".";
import { tFeeds, tItems, tStarredItems, tUnreadItems } from "./schema";
import * as entities from "entities";

export type Item = typeof tItems.$inferSelect & {
  feed: {
    id: number;
    title: string;
    link: string;
  };
} & { starred: boolean };
export type ItemInsert = typeof tItems.$inferInsert;

export async function insertUnreadItem(insertValues: ItemInsert) {
  const [insItem] = await db
    .insert(tItems)
    .values({ ...insertValues, title: entities.decodeXML(insertValues.title) })
    .returning();
  await db.insert(tUnreadItems).values({ id: insItem.id });
  return insItem;
}

export async function getAllUnreadItems() {
  const result = await db
    .select({
      item: tItems,
      feed: tFeeds,
      starred: tStarredItems,
    })
    .from(tUnreadItems)
    .innerJoin(tItems, eq(tItems.id, tUnreadItems.id))
    .innerJoin(tFeeds, eq(tItems.feedId, tFeeds.id))
    .leftJoin(tStarredItems, eq(tItems.id, tStarredItems.id))
    .orderBy(desc(tItems.publishedAt));

  return result.map((row) => ({
    ...row.item,
    feed: row.feed,
    starred: row.starred != null,
  }));
}

export async function getAllStarredItems() {
  const result = await db
    .select({ item: tItems, feed: tFeeds })
    .from(tStarredItems)
    .innerJoin(tItems, eq(tItems.id, tStarredItems.id))
    .innerJoin(tFeeds, eq(tItems.feedId, tFeeds.id))
    .orderBy(desc(tItems.publishedAt));

  return result.map((row) => ({
    ...row.item,
    feed: row.feed,
    starred: true,
  }));
}
export async function getFeedItems(id: number) {
  const [feed] = await db.select().from(tFeeds).where(eq(tFeeds.id, id));
  const result = await db
    .select({ item: tItems, starred: tStarredItems })
    .from(tItems)
    .where(eq(tItems.feedId, id))
    .leftJoin(tStarredItems, eq(tItems.id, tStarredItems.id))
    .orderBy(desc(tItems.publishedAt));

  return result.map((row) => ({
    ...row.item,
    feed,
    starred: row.starred !== null,
  }));
}

export async function markItemAsRead(id: number) {
  return db.delete(tUnreadItems).where(eq(tUnreadItems.id, id));
}

export async function markItemAsStarred(id: number) {
  return db.transaction(async (tx) => {
    await tx.delete(tUnreadItems).where(eq(tUnreadItems.id, id));
    await tx.insert(tStarredItems).values({ id });
  });
}

export async function markItemAsUnstarred(id: number) {
  return db.delete(tStarredItems).where(eq(tStarredItems.id, id));
}
