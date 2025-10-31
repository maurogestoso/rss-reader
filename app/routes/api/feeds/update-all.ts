import { redirect } from "react-router";
import type { Route } from "./+types/update-all";

import { ensureUser } from "~/sessions.server";
import { getAllFeeds, touchFeed } from "~/db/feeds";
import RssParser from "rss-parser";
import { insertUnreadItem } from "~/db/items";

const rssp = new RssParser();

export async function action({ request }: Route.ActionArgs) {
  console.info("/api/feeds/update-all");

  const feeds = await getAllFeeds();
  feeds.forEach(async (feed) => {
    console.info("updating feed:", feed.title);

    const feedData = await rssp.parseURL(feed.url);
    const newItems = feedData.items.filter((item) =>
      feed.updatedAt ? new Date(item.pubDate!) > feed.updatedAt : true,
    );

    console.info("new items:", newItems.length);

    await Promise.all(
      newItems.map((item) =>
        insertUnreadItem({
          title: item.title!,
          feedId: feed.id,
          link: item.link!,
          publishedAt: new Date(item.pubDate!),
        }),
      ),
    );
    await touchFeed(new Date());
  });

  return new Response(undefined, { status: 204 });
}
