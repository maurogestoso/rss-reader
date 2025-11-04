import { redirect } from "react-router";
import type { Route } from "./+types/home";

import { ensureUser } from "~/sessions.server";
import { getAllUnreadItems } from "~/db/items";
import MarkAsStarred from "~/items/components/MarkAsStarred";
import MarkAsRead from "~/items/components/MarkAsRead";
import Navbar from "~/ui/navbar";
import ItemsList from "~/items/components/ItemsList";

export async function loader({ request }: Route.LoaderArgs) {
  const user = await ensureUser(request);
  if (!user) return redirect("/login");

  const unreadItems = await getAllUnreadItems();
  return { items: unreadItems };
}

export default function Home({ loaderData }: Route.ComponentProps) {
  return (
    <>
      <Navbar />
      <section className="flex flex-col gap-2 mt-4">
        {loaderData.items.length ? (
          <ItemsList
            items={loaderData.items}
            renderItemActions={({ optimisticallyRemoveItem, id }) => (
              <>
                <MarkAsRead
                  itemId={id}
                  onClick={() => optimisticallyRemoveItem(id)}
                />
                <MarkAsStarred
                  itemId={id}
                  onClick={() => optimisticallyRemoveItem(id)}
                />
              </>
            )}
          />
        ) : (
          <p className="text-xl">You're all caught up! Go do something else.</p>
        )}
      </section>
    </>
  );
}
