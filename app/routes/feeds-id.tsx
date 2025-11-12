import type { Route } from "./+types/feeds-id";
import { Form, redirect, useSubmit } from "react-router";

import { ensureUser } from "~/sessions.server";
import { ROUTES } from "~/routes";
import { getFeed, removeFeed, type Feed } from "~/db/feeds";
import MarkAsStarred from "~/items/components/MarkAsStarred";
import MarkAsUnstarred from "~/items/components/MarkAsUnstarred";
import Button from "~/ui/button";
import { MailX } from "lucide-react";
import Navbar from "~/ui/navbar";
import { getFeedItems } from "~/db/items";
import ItemsList from "~/items/components/ItemsList";

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
  const { feed } = loaderData;

  return (
    <>
      <Navbar />
      <h2 className="mt-4 font-bold text-2xl">{feed.title}</h2>
      <div className="mt-4 flex gap-2 items-center">
        <UnsubscribeAction feed={feed} />
      </div>
      <section className="flex flex-col gap-2 mt-4">
        <ItemsList
          items={loaderData.items}
          renderItemActions={({ optimisticallyToggleStar, item }) =>
            item.starred ? (
              <MarkAsUnstarred
                itemId={item.id}
                onClick={() => optimisticallyToggleStar(item.id)}
              />
            ) : (
              <MarkAsStarred
                itemId={item.id}
                onClick={() => optimisticallyToggleStar(item.id)}
              />
            )
          }
        />
      </section>
    </>
  );
}

function UnsubscribeAction({ feed }: { feed: Feed }) {
  const submit = useSubmit();

  function handleUnsuscribe(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const ok = confirm(`Unsubscribe from ${feed.title}?`);
    if (ok) {
      submit(e.currentTarget, {
        action: ROUTES.FEEDS_ID,
        method: "DELETE",
      });
    }
  }

  return (
    <Form method="DELETE" onSubmit={handleUnsuscribe}>
      <Button type="submit" className="bg-red-600 hover:bg-red-500 text-white">
        <MailX className="size-4" /> Unsubscribe
      </Button>
    </Form>
  );
}
