import type { Route } from "./+types/update-all";
import RssParser from "rss-parser";

import { getAllFeeds, touchFeed } from "~/db/feeds";
import { insertUnreadItem } from "~/db/items";
import { ensureUser } from "~/sessions.server";
import { redirect } from "react-router";

const rssp = new RssParser();

export async function action({ request }: Route.ActionArgs) {
  const user = await ensureUser(request);
  if (!user) return redirect("/login");

  console.log("/api/feeds/update-all");

  const feeds = await getAllFeeds();
  await Promise.all(
    feeds.map(async (feed) => {
      const newItems = await fetchNewItems(feed.url, feed.updatedAt);

      console.log(`${feed.title} - new items: ${newItems.length}`);

      await touchFeed(new Date());
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
    }),
  );

  return redirect("/");
}

async function fetchNewItems(url: string, newerThan: Date | null) {
  const feedData = await rssp.parseURL(url);
  return feedData.items.filter((item) =>
    newerThan ? new Date(item.pubDate!) > newerThan : true,
  );
}
