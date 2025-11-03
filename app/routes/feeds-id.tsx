import { useState } from "react";
import type { Route } from "./+types/feeds-id";
import { redirect } from "react-router";

import { ensureUser } from "~/sessions.server";
import { ROUTES } from "~/routes";
import { getFeedWithItems } from "~/db/feeds";
import ItemCard from "~/items/components/ItemCard";
import MarkAsStarred from "~/items/components/MarkAsStarred";
import MarkAsUnstarred from "~/items/components/MarkAsUnstarred";

export async function loader({ request, params }: Route.LoaderArgs) {
  const user = await ensureUser(request);
  if (!user) return redirect(ROUTES.LOGIN);

  const { id } = params;

  const feed = await getFeedWithItems(parseInt(id));

  return {
    feed,
  };
}

export default function FeedsId({ loaderData }: Route.ComponentProps) {
  const { feed } = loaderData;
  const [items, setItems] = useState(feed.items);

  function optimisticallyToggleStar(itemId: number) {
    setItems(
      items.map((item) => {
        if (item.id === itemId) {
          return { ...item, starred: !item.starred };
        }
        return item;
      }),
    );
  }

  return (
    <>
      <h2 className="font-bold text-xl">Feed: {feed.title}</h2>
      <div className="flex flex-col gap-2">
        {items.map((item) => (
          <ItemCard key={item.id} item={{ ...item, feed }}>
            <ItemCard.Actions>
              {item.starred ? (
                <MarkAsUnstarred
                  itemId={item.id}
                  onClick={() => optimisticallyToggleStar(item.id)}
                />
              ) : (
                <MarkAsStarred
                  itemId={item.id}
                  onClick={() => optimisticallyToggleStar(item.id)}
                />
              )}
            </ItemCard.Actions>
          </ItemCard>
        ))}
      </div>
    </>
  );
}
