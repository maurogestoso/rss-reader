import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { db } from "..";
import { feedsTable, newItemsTable, usersTable } from "../schema";
import { eq } from "drizzle-orm";
import Parser from "rss-parser";
import * as entities from "entities";

const rssParser = new Parser();

const argv = await yargs(hideBin(process.argv))
  .option("userId", {
    demandOption: true,
    type: "number",
    describe: "User ID",
  })
  .parse();

const result = await db
  .select()
  .from(usersTable)
  .where(eq(usersTable.id, argv.userId));

if (result.length === 0 || !result[0]) {
  throw new Error(`User with id ${argv.userId} not found`);
}

const user = result[0];

type NewFeed = typeof feedsTable.$inferInsert;
type NewItem = typeof newItemsTable.$inferInsert;

// TODO: pull data from actual feed
const feedUrls = ["https://feeds.kottke.org/main"];
feedUrls.forEach(async (feedUrl) => {
  const feed = await rssParser.parseURL(feedUrl);

  const [insFeed] = await db
    .insert(feedsTable)
    .values({
      title: feed.title!,
      feedUrl: feed.feedUrl!,
      link: feed.link!,
      userId: user.id,
    })
    .returning();
  console.info("Inserted feed:", insFeed);

  feed.items.slice(0, 10).forEach(async (item) => {
    const [insItem] = await db
      .insert(newItemsTable)
      .values({
        title: entities.decodeXML(item.title!.trim()),
        link: item.link!,
        pubDate: new Date(item.pubDate!),
        feedId: insFeed.id,
        userId: user.id,
      })
      .returning();
    console.info("Inserted item:", insItem);
  });
});
