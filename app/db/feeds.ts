import { eq, desc } from "drizzle-orm";
import { db } from ".";
import { insertUnreadItem } from "./items";
import { tFeeds, tItems, tStarredItems, tUnreadItems } from "./schema";
import RssParser from "rss-parser";

const rssp = new RssParser();

export type Feed = typeof tFeeds.$inferSelect;

export async function getAllFeeds() {
  return db.select().from(tFeeds);
}

export async function insertFeed(url: string) {
  const feed = await rssp.parseURL(url);

  const [insFeed] = await db
    .insert(tFeeds)
    .values({
      title: feed.title!,
      link: feed.link!,
      url: feed.feedUrl!,
      updatedAt: new Date(),
    })
    .returning();

  return await Promise.all(
    feed.items.map((item) =>
      insertUnreadItem({
        title: item.title!,
        link: item.link!,
        publishedAt: new Date(item.pubDate!),
        feedId: insFeed.id,
      }),
    ),
  );
}

export async function touchFeed(date: Date) {
  return db.update(tFeeds).set({ updatedAt: date });
}

export type FeedWithItems = typeof tFeeds.$inferSelect & {
  items: (typeof tItems.$inferSelect & { starred: boolean })[];
};

export async function getFeedWithItems(id: number): Promise<FeedWithItems> {
  const result = await db
    .select({ feed: tFeeds, item: tItems, starred: tStarredItems })
    .from(tFeeds)
    .where(eq(tFeeds.id, id))
    .innerJoin(tItems, eq(tItems.feedId, tFeeds.id))
    .leftJoin(tStarredItems, eq(tItems.id, tStarredItems.id))
    .orderBy(desc(tItems.publishedAt))
    .all();

  return {
    ...result[0].feed,
    items: result.map((row) => {
      return { ...row.item, starred: row.starred != null };
    }),
  };
}

export async function removeFeed(id: number) {
  return db.delete(tFeeds).where(eq(tFeeds.id, id));
}
