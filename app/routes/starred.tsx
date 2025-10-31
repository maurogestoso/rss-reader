import { Link, redirect } from "react-router";
import type { Route } from "./+types/starred";
import { getSession } from "~/sessions.server";
import { getUser } from "~/db/user";
import { getAllStarredItems } from "~/db/items";
import { ArrowLeft, ChevronLeft, Star } from "lucide-react";
import Button from "~/ui/button";

export async function loader({ request }: Route.LoaderArgs) {
  const session = await getSession(request.headers.get("Cookie"));

  const userId = session.get("userId");
  if (!userId) {
    return redirect("/login");
  }

  const user = await getUser(userId);
  if (!user) return redirect("/login");

  const starredItems = await getAllStarredItems();
  return { items: starredItems };
}

export default function Starred({ loaderData }: Route.ComponentProps) {
  const { items } = loaderData;
  return (
    <>
      <Link to={"/"}>
        <Button className="underline text-stone-600 hover:text-stone-500">
          <ArrowLeft className="size-4" /> Back to unread items
        </Button>
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
              <div className="mt-1 flex gap-2"></div>
            </article>
          ))
        ) : (
          <p className="text-xl">You don't have any starred items yet.</p>
        )}
      </section>
    </>
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
