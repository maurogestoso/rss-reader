import { Link, redirect, useFetcher } from "react-router";
import type { Route } from "./+types/feeds";
import { ensureUser } from "~/sessions.server";
import { ArrowLeft, MailPlus, RefreshCw, Star } from "lucide-react";
import Button from "~/ui/button";
import { getAllFeeds } from "~/db/feeds";
import FeedCard from "~/ui/feed-card";
import Navbar from "~/ui/navbar";

export async function loader({ request }: Route.LoaderArgs) {
  const user = await ensureUser(request);
  if (!user) return redirect("/login");

  const feeds = await getAllFeeds();

  const lastUpdate = feeds[0]?.updatedAt;
  return { feeds, lastUpdate };
}

export default function Feeds({ loaderData }: Route.ComponentProps) {
  const { feeds, lastUpdate } = loaderData;
  return (
    <>
      <Navbar />
      <div className="mt-4 flex gap-2 items-center">
        <Link to="/add-feed">
          <Button className="bg-orange-600 text-white hover:bg-orange-500">
            <MailPlus className="size-4" /> Add Feed
          </Button>
        </Link>
        <UpdateFeeds />
        {lastUpdate && (
          <span className="text-sm text-gray-600">
            Last updated: {new Date(lastUpdate).toLocaleString()}
          </span>
        )}
      </div>
      <section className="flex flex-col gap-2 mt-4">
        {feeds.length ? (
          feeds.map((feed) => <FeedCard key={feed.id} feed={feed} />)
        ) : (
          <>
            <p>Not subscribed to any feeds yet.</p>
            <div className="mt-2">
              <Link to={"/add-feed"}>
                <Button className="bg-orange-600 text-white hover:bg-orange-500">
                  <MailPlus className="size-4" /> Add feed
                </Button>
              </Link>
            </div>
          </>
        )}
      </section>
    </>
  );
}

function UpdateFeeds() {
  const fetcher = useFetcher();
  const loading = fetcher.state != "idle";
  return (
    <fetcher.Form method="POST" action="/api/feeds/update-all">
      <Button
        className="bg-blue-600 text-white hover:bg-blue-500"
        disabled={loading}
      >
        <RefreshCw className={`size-4 ${loading && "animate-spin"}`} /> Update
        feeds
      </Button>
    </fetcher.Form>
  );
}
