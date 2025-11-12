import type { Route } from "./+types/export-opml";
import { getAllFeeds } from "~/db/feeds";
import { ensureUser } from "~/sessions.server";
import { redirect } from "react-router";

export async function loader({ request }: Route.LoaderArgs) {
  const user = await ensureUser(request);
  if (!user) return redirect("/login");

  const feeds = await getAllFeeds();

  const opml = generateOPML(feeds);

  return new Response(opml, {
    status: 200,
    headers: {
      "Content-Type": "application/xml",
      "Content-Disposition": 'attachment; filename="subscriptions.opml"',
    },
  });
}

function generateOPML(feeds: any[]): string {
  const now = new Date().toUTCString();

  const feedsXML = feeds
    .map(
      (feed) =>
        `    <outline type="rss" text="${escapeXml(feed.title)}" title="${escapeXml(feed.title)}" xmlUrl="${escapeXml(feed.url)}" />`,
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<opml version="2.0">
  <head>
    <title>RSS Subscriptions</title>
    <dateCreated>${now}</dateCreated>
  </head>
  <body>
${feedsXML}
  </body>
</opml>`;
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
