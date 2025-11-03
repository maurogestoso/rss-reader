import { eq } from "drizzle-orm";
import { db } from ".";
import { tFeeds, tItems, tStarredItems, tUnreadItems } from "./schema";
import * as entities from "entities";

export type ItemWithFeed = Omit<typeof tItems.$inferSelect, "feedId"> & {
  feed: {
    id: number;
    title: string;
    link: string;
  };
};

export type ItemInsert = typeof tItems.$inferInsert;

export async function insertUnreadItem(insertValues: ItemInsert) {
  const [insItem] = await db
    .insert(tItems)
    .values({ ...insertValues, title: entities.decodeXML(insertValues.title) })
    .returning();
  await db.insert(tUnreadItems).values({ id: insItem.id });
  return insItem;
}

const selectItemWithFeed = {
  id: tItems.id,
  title: tItems.title,
  link: tItems.link,
  publishedAt: tItems.publishedAt,
  feed: {
    id: tFeeds.id,
    title: tFeeds.title,
    link: tFeeds.link,
  },
};

export async function getAllUnreadItems(): Promise<ItemWithFeed[]> {
  return db
    .select(selectItemWithFeed)
    .from(tUnreadItems)
    .innerJoin(tItems, eq(tItems.id, tUnreadItems.id))
    .innerJoin(tFeeds, eq(tItems.feedId, tFeeds.id));
}

export async function getAllStarredItems(): Promise<ItemWithFeed[]> {
  return db
    .select(selectItemWithFeed)
    .from(tStarredItems)
    .innerJoin(tItems, eq(tItems.id, tStarredItems.id))
    .innerJoin(tFeeds, eq(tItems.feedId, tFeeds.id));
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
