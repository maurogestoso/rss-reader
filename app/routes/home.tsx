import { Link, redirect } from "react-router";
import type { Route } from "./+types/home";
import { getSession } from "~/sessions.server";
import { getUser } from "~/db/user";
import { getAllUnreadItems } from "~/db/items";
import { BookOpenCheck, MailPlus, Star } from "lucide-react";

export async function loader({ request }: Route.LoaderArgs) {
  const session = await getSession(request.headers.get("Cookie"));

  const userId = session.get("userId");
  if (!userId) {
    return redirect("/login");
  }

  const user = await getUser(userId);
  if (!user) return redirect("/login");

  const unreadItems = await getAllUnreadItems();
  return { items: unreadItems };
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const { items } = loaderData;
  return (
    <>
      <Link to={"/add-feed"}>
        <button className="p-2 rounded-lg bg-green-600 text-white text-sm flex gap-1 items-center">
          <MailPlus className="size-4" /> Add feed
        </button>
      </Link>
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
                <MarkAsRead itemId={item.id} />
                <MarkAsStarred itemId={item.id} />
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

function MarkAsRead({ itemId }: { itemId: number }) {
  return (
    <form method="POST" action="/api/items/read">
      <input type="hidden" value={itemId} name="itemId" />
      <button
        type="submit"
        className="underline text-xs cursor-pointer flex items-center gap-0.5"
      >
        <BookOpenCheck className="size-4 stroke-green-500" />{" "}
        <span>Mark as read</span>
      </button>
    </form>
  );
}

function MarkAsStarred({ itemId }: { itemId: number }) {
  return (
    <form method="POST" action="/api/items/starred">
      <input type="hidden" value={itemId} name="itemId" />
      <button
        type="submit"
        className="underline text-xs cursor-pointer flex items-center gap-0.5"
      >
        <Star className="size-4 stroke-amber-400" /> <span>Star</span>
      </button>
    </form>
  );
}
