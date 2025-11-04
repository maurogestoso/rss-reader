import { useState } from "react";
import { Link, NavLink, redirect } from "react-router";
import type { Route } from "./+types/home";

import { ensureUser } from "~/sessions.server";
import { getAllUnreadItems } from "~/db/items";
import { List, MailPlus, Star } from "lucide-react";
import Button from "~/ui/button";
import ItemCard from "~/items/components/ItemCard";
import MarkAsStarred from "~/items/components/MarkAsStarred";
import MarkAsRead from "~/items/components/MarkAsRead";
import { ROUTES } from "~/routes";
import Navbar from "~/ui/navbar";

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
      <Navbar />
      <section className="flex flex-col gap-2 mt-4">
        {items.length ? (
          items.map((item) => (
            <ItemCard key={item.id} item={item}>
              <ItemCard.Actions>
                <MarkAsRead
                  itemId={item.id}
                  onClick={() => optimisticallyRemoveItem(item.id)}
                />
                <MarkAsStarred
                  itemId={item.id}
                  onClick={() => optimisticallyRemoveItem(item.id)}
                />
              </ItemCard.Actions>
            </ItemCard>
          ))
        ) : (
          <p className="text-xl">You're all caught up! Go do something else.</p>
        )}
      </section>
    </>
  );
}
