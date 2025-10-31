import { Link, redirect } from "react-router";
import type { Route } from "./+types/home";
import { getSession } from "~/sessions.server";
import { getUser } from "~/db/user";
import { getAllNewItems } from "~/db/items";
import { BookOpenCheck, Star } from "lucide-react";

export async function loader({ request }: Route.LoaderArgs) {
  const session = await getSession(request.headers.get("Cookie"));

  const userId = session.get("userId");
  if (!userId) {
    return redirect("/login");
  }

  const user = await getUser(userId);
  if (!user) return redirect("/login");

  const newItems = await getAllNewItems(user.id);
  return { items: newItems };
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const { items } = loaderData;
  return (
    <>
      <Link to={"/add-feed"}>Add feed</Link>
      <h2 className="font-bold text-2xl">New Items:</h2>
      <section className="flex flex-col gap-2">
        {items.map((item) => (
          <article
            key={item.id}
            className="p-2 border border-stone-200 rounded-lg"
          >
            <a href={item.link} className="text-blue-600 underline">
              {item.title}
            </a>
            <a
              href={item.feedLink}
              className="ml-2 text-gray-400 text-sm hover:underline"
            >
              ({item.feedTitle})
            </a>
            <div className="mt-1 flex gap-2">
              <MarkAsRead itemId={item.id} />

              <button className="underline text-xs cursor-pointer flex items-center gap-0.5">
                <Star className="size-4 stroke-amber-400" /> <span>Star</span>
              </button>
            </div>
          </article>
        ))}
      </section>
    </>
  );
}

function MarkAsRead({ itemId }: { itemId: number }) {
  return (
    <form method="POST" action="/api/item">
      <input type="hidden" value={itemId} name="itemId" />
      <input type="hidden" value="read" name="action" />
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
