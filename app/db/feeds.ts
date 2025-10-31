import { db } from ".";
import { insertUnreadItem } from "./items";
import { tFeeds, tItems, tUnreadItems } from "./schema";
import RssParser from "rss-parser";

const rssp = new RssParser();

export async function getAllFeeds() {
  return db.select().from(tFeeds);
}

export async function insertFeed(url: string) {
  const feed = await rssp.parseURL(url);

  // insert feed with updatedAt to now
  const [insFeed] = await db
    .insert(tFeeds)
    .values({
      title: feed.title!,
      link: feed.link!,
      url: feed.feedUrl!,
      updatedAt: new Date(),
    })
    .returning();

  // insert all feed items
  const insItems = await Promise.all(
    feed.items.map((item) =>
      insertUnreadItem({
        title: item.title!,
        link: item.link!,
        publishedAt: new Date(item.pubDate!),
        feedId: insFeed.id,
      }),
    ),
  );

  // last 3 items are unread
  await Promise.all(
    insItems
      .slice(0, 3)
      .map((item) => db.insert(tUnreadItems).values({ id: item.id })),
  );
}

export async function touchFeed(date: Date) {
  return db.update(tFeeds).set({ updatedAt: date });
}
