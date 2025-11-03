import { useState } from "react";
import { Link, redirect, useFetcher } from "react-router";
import type { Route } from "./+types/starred";

import { getSession } from "~/sessions.server";
import { getUser } from "~/db/user";
import { getAllStarredItems } from "~/db/items";
import { ArrowLeft, StarOff } from "lucide-react";
import Button from "~/ui/button";
import ItemCard from "~/ui/item-card";
import { ROUTES } from "~/routes";

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
  const [items, setItems] = useState(loaderData.items);

  function optimisticallyRemoveItem(itemId: number) {
    setItems(items.filter((item) => item.id !== itemId));
  }

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
            <ItemCard key={item.id} item={item}>
              <ItemCard.Actions>
                <MarkAsUnstarred
                  itemId={item.id}
                  onClick={() => optimisticallyRemoveItem(item.id)}
                />
              </ItemCard.Actions>
            </ItemCard>
          ))
        ) : (
          <p className="text-xl">You don't have any starred items yet.</p>
        )}
      </section>
    </>
  );
}

function MarkAsUnstarred({
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
      action={ROUTES.API.ITEMS.MARK_UNSTARRED}
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
        <StarOff className="size-4 stroke-amber-400" /> <span>Unstar</span>
      </button>
    </fetcher.Form>
  );
}
