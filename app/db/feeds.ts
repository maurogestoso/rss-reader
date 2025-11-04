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

export async function getFeed(id: number) {
  const result = await db.select().from(tFeeds).where(eq(tFeeds.id, id));
  if (!result.length) return null;

  return result[0];
}

export async function removeFeed(id: number) {
  return db.delete(tFeeds).where(eq(tFeeds.id, id));
}
