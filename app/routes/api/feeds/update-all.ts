import type { Route } from "./+types/update-all";
import RssParser from "rss-parser";

import { getAllFeeds, touchFeed } from "~/db/feeds";
import { insertUnreadItem } from "~/db/items";
import { validateToken } from "~/db/auth-tokens";

const rssp = new RssParser();

export async function action({ request }: Route.ActionArgs) {
  console.info("/api/feeds/update-all");
  const authToken = request.headers.get("Authorization")?.split(" ")[1];
  if (!authToken) return new Response(null, { status: 401 });
  const isTokenValid = await validateToken(authToken);
  if (!isTokenValid) return new Response(null, { status: 401 });

  const feeds = await getAllFeeds();
  feeds.forEach(async (feed) => {
    const feedData = await rssp.parseURL(feed.url);
    const newItems = feedData.items.filter((item) =>
      feed.updatedAt ? new Date(item.pubDate!) > feed.updatedAt : true,
    );

    console.info(`${feed.title} - new items: ${newItems.length}`);

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
