import { eq } from "drizzle-orm";
import { db } from ".";
import { tFeeds, tItems, tUnreadItems } from "./schema";

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
