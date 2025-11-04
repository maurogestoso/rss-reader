import { useState } from "react";
import type { Route } from "./+types/feeds-id";
import { Form, redirect, useSubmit } from "react-router";

import { ensureUser } from "~/sessions.server";
import { ROUTES } from "~/routes";
import { getFeed, removeFeed } from "~/db/feeds";
import ItemCard from "~/items/components/ItemCard";
import MarkAsStarred from "~/items/components/MarkAsStarred";
import MarkAsUnstarred from "~/items/components/MarkAsUnstarred";
import Button from "~/ui/button";
import { MailX } from "lucide-react";
import Navbar from "~/ui/navbar";
import { getFeedItems } from "~/db/items";

export async function loader({ request, params }: Route.LoaderArgs) {
  const user = await ensureUser(request);
  if (!user) return redirect(ROUTES.LOGIN);

  const { id } = params;

  const feed = await getFeed(parseInt(id));
  if (!feed)
    return new Response(`Feed with id ${id} not found`, { status: 404 });

  const items = await getFeedItems(parseInt(id));

  return { feed, items };
}

export async function action({ request, params }: Route.ActionArgs) {
  if (request.method === "DELETE") {
    const id = parseInt(params.id);
    await removeFeed(id);
    return redirect("/");
  }
}

export default function FeedsId({ loaderData }: Route.ComponentProps) {
  const { feed, items: feedItems } = loaderData;
  const [items, setItems] = useState(feedItems);
  const submit = useSubmit();

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

  function handleUnsuscribe(e: React.FormEvent<HTMLFormElement>) {
    const ok = confirm(`Unsubscribe from ${feed.title}?`);
    if (ok) {
      submit(e.currentTarget, {
        action: ROUTES.FEEDS_ID,
        method: "DELETE",
      });
    }
  }

  return (
    <>
      <Navbar />
      <div className="mt-4 flex justify-between items-center">
        <h2 className="font-bold text-2xl">{feed.title}</h2>
        <Form method="DELETE" onSubmit={handleUnsuscribe}>
          <Button
            type="submit"
            className="bg-red-600 hover:bg-red-500 text-white"
          >
            <MailX className="size-4" /> Unsubscribe
          </Button>
        </Form>
      </div>
      <section className="flex flex-col gap-2 mt-4">
        {items.map((item) => (
          <ItemCard key={item.id} item={{ ...item, feed }} feedLink="external">
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
      </section>
    </>
  );
}
