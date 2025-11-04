import { useState } from "react";
import { Link, redirect } from "react-router";
import type { Route } from "./+types/starred";

import { getSession } from "~/sessions.server";
import { getUser } from "~/db/user";
import { getAllStarredItems } from "~/db/items";
import { ArrowLeft } from "lucide-react";
import Button from "~/ui/button";
import ItemCard from "~/items/components/ItemCard";
import MarkAsUnstarred from "~/items/components/MarkAsUnstarred";
import Navbar from "~/ui/navbar";

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
      <Navbar />
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
