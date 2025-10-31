import { db } from ".";
import { feedsTable, newItemsTable } from "./schema";
import Parser from "rss-parser";
import * as entities from "entities";
import { eq } from "drizzle-orm";

const rssParser = new Parser();

export async function insertFeed({
  feedUrl,
  userId,
}: {
  feedUrl: string;
  userId: number;
}) {
  const feed = await rssParser.parseURL(feedUrl);
  const [insertedFeed] = await db
    .insert(feedsTable)
    .values({
      title: entities.decodeXML(feed.title!.trim()),
      link: feed.link!,
      feedUrl: feed.feedUrl!,
      userId: userId,
    })
    .returning();

  return insertedFeed;
}

export async function updateFeed({ feedId }: { feedId: number }) {
  const results = await db
    .select()
    .from(feedsTable)
    .where(eq(feedsTable.id, feedId));
  if (results.length === 0 || !results[0])
    throw new Error(`Could not find feed with id ${feedId}`);

  const [feed] = results;
  const feedData = await rssParser.parseURL(results[0].feedUrl);

  Promise.all(
    feedData.items.map(async (item) => {
      if (!item.pubDate) return;
      const itemPubDate = new Date(item.pubDate);

      if (!feed.lastUpdate || itemPubDate > feed.lastUpdate) {
        return db.insert(newItemsTable).values({
          title: entities.decodeXML(item.title!.trim()),
          link: item.link!,
          pubDate: itemPubDate,
          feedId: feed.id,
          userId: feed.userId,
        });
      }
    }),
  ).then(() => {
    return db.update(feedsTable).set({ lastUpdate: new Date() });
  });
}
