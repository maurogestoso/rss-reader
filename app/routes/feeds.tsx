import { Link, redirect, useFetcher } from "react-router";
import type { Route } from "./+types/feeds";
import { ensureUser } from "~/sessions.server";
import { ArrowLeft, MailPlus, RefreshCw, Star } from "lucide-react";
import Button from "~/ui/button";
import { getAllFeeds } from "~/db/feeds";
import FeedCard from "~/ui/feed-card";

export async function loader({ request }: Route.LoaderArgs) {
  const user = await ensureUser(request);
  if (!user) return redirect("/login");

  const feeds = await getAllFeeds();

  const lastUpdate = feeds[0].updatedAt;
  const today = new Date();
  const isUpdateDisabled = lastUpdate
    ? today.getDate() - lastUpdate.getDate() <= 1
    : false;
  return { feeds, isUpdateDisabled };
}

export default function Feeds({ loaderData }: Route.ComponentProps) {
  const { feeds, isUpdateDisabled } = loaderData;
  return (
    <>
      <section className="flex gap-2 items-center">
        <Link to={"/"}>
          <Button className="underline text-stone-600 hover:text-stone-500">
            <ArrowLeft className="size-4" /> Back to unread items
          </Button>
        </Link>
        <UpdateFeeds disabled={isUpdateDisabled} />
        {isUpdateDisabled && <span>Already up to date</span>}
      </section>
      <section className="flex flex-col gap-2">
        <h2 className="font-bold text-xl">Feeds:</h2>
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

function UpdateFeeds({ disabled }: { disabled?: boolean }) {
  const fetcher = useFetcher();
  const loading = fetcher.state != "idle";
  return (
    <fetcher.Form method="POST" action="/api/feeds/update-all">
      <Button
        className="bg-blue-600 text-white hover:bg-blue-500"
        disabled={loading || disabled}
      >
        <RefreshCw className={`size-4 ${loading && "animate-spin"}`} /> Update
        feeds
      </Button>
    </fetcher.Form>
  );
}
