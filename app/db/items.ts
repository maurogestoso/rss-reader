import { eq } from "drizzle-orm";
import { db } from ".";
import { tFeeds, tItems, tStarredItems, tUnreadItems } from "./schema";
import * as entities from "entities";

export async function insertUnreadItem(
  insertValues: typeof tItems.$inferInsert,
) {
  const [insItem] = await db
    .insert(tItems)
    .values({ ...insertValues, title: entities.decodeXML(insertValues.title) })
    .returning();
  await db.insert(tUnreadItems).values({ id: insItem.id });
  return insItem;
}

export async function getAllUnreadItems() {
  return db
    .select({
      id: tItems.id,
      title: tItems.title,
      link: tItems.link,
      publishedAt: tItems.publishedAt,
      feed: {
        id: tFeeds.id,
        title: tFeeds.title,
        link: tFeeds.link,
      },
    })
    .from(tUnreadItems)
    .innerJoin(tItems, eq(tItems.id, tUnreadItems.id))
    .innerJoin(tFeeds, eq(tItems.feedId, tFeeds.id));
}

export async function getAllStarredItems() {
  return db
    .select({
      id: tItems.id,
      title: tItems.title,
      link: tItems.link,
      publishedAt: tItems.publishedAt,
      feed: {
        id: tFeeds.id,
        title: tFeeds.title,
        link: tFeeds.link,
      },
    })
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
