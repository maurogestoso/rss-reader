import { useRef, useState } from "react";
import { Form, Link, redirect, useFetcher, useSubmit } from "react-router";
import type { Route } from "./+types/home";

import { ensureUser } from "~/sessions.server";
import { getAllUnreadItems } from "~/db/items";
import { List, BookOpenCheck, MailPlus, Star } from "lucide-react";
import Button from "~/ui/button";

export async function loader({ request }: Route.LoaderArgs) {
  const user = await ensureUser(request);
  if (!user) return redirect("/login");

  const unreadItems = await getAllUnreadItems();
  return { items: unreadItems };
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const [items, setItems] = useState(loaderData.items);

  function optimisticallyRemoveItem(itemId: number) {
    setItems(items.filter((item) => item.id !== itemId));
  }

  return (
    <>
      <div className="flex gap-2">
        <Link to={"/add-feed"}>
          <Button className="bg-orange-600 text-white hover:bg-orange-500">
            <MailPlus className="size-4" /> Add feed
          </Button>
        </Link>
        <Link to={"/feeds"}>
          <Button className="underline text-stone-600 hover:text-stone-500">
            <List className="size-4 stroke-blue-600" /> Feeds
          </Button>
        </Link>
        <Link to={"/starred"}>
          <Button className="underline text-stone-600 hover:text-stone-500">
            <Star className="size-4 stroke-amber-400" /> Starred items
          </Button>
        </Link>
      </div>
      <section className="flex flex-col gap-2 mt-4">
        {items.length ? (
          items.map((item) => (
            <article
              key={item.id}
              className="p-2 border border-stone-200 rounded-lg"
            >
              <a href={item.link} className="text-blue-600 underline">
                {item.title}
              </a>
              <a
                href={item.feed.link}
                className="ml-2 text-gray-400 text-sm hover:underline"
              >
                ({item.feed.title})
              </a>
              <div className="mt-1 flex gap-2">
                <MarkAsRead
                  itemId={item.id}
                  onClick={() => optimisticallyRemoveItem(item.id)}
                />
                <MarkAsStarred
                  itemId={item.id}
                  onClick={() => optimisticallyRemoveItem(item.id)}
                />
              </div>
            </article>
          ))
        ) : (
          <p className="text-xl">You're all caught up! Go do something else.</p>
        )}
      </section>
    </>
  );
}

function MarkAsRead({
  itemId,
  onClick,
}: {
  itemId: number;
  onClick: () => void;
}) {
  const fetcher = useFetcher();
  return (
    <fetcher.Form
      method="POST"
      action="/api/items/read"
      onSubmit={(e) => {
        onClick();
        fetcher.submit(e.currentTarget);
      }}
    >
      <input type="hidden" value={itemId} name="itemId" />
      <button
        type="submit"
        className="underline text-xs cursor-pointer flex items-center gap-0.5"
      >
        <BookOpenCheck className="size-4 stroke-green-600" />{" "}
        <span>Mark as read</span>
      </button>
    </fetcher.Form>
  );
}

function MarkAsStarred({
  itemId,
  onClick,
}: {
  itemId: number;
  onClick: () => void;
}) {
  const fetcher = useFetcher();
  return (
    <fetcher.Form
      method="POST"
      action="/api/items/starred"
      onSubmit={(e) => {
        onClick();
        fetcher.submit(e.currentTarget);
      }}
    >
      <input type="hidden" value={itemId} name="itemId" />
      <button
        type="submit"
        className="underline text-xs cursor-pointer flex items-center gap-0.5"
      >
        <Star className="size-4 stroke-amber-400" /> <span>Star</span>
      </button>
    </fetcher.Form>
  );
}
