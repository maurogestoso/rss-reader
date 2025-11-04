import { redirect } from "react-router";
import type { Route } from "./+types/starred";

import { getSession } from "~/sessions.server";
import { getUser } from "~/db/user";
import { getAllStarredItems } from "~/db/items";
import MarkAsUnstarred from "~/items/components/MarkAsUnstarred";
import Navbar from "~/ui/navbar";
import ItemsList from "~/items/components/ItemsList";

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
  return (
    <>
      <Navbar />
      <section className="flex flex-col gap-2 mt-4">
        {loaderData.items.length ? (
          <ItemsList
            items={loaderData.items}
            renderItemActions={({ optimisticallyRemoveItem, id }) => (
              <MarkAsUnstarred
                itemId={id}
                onClick={() => optimisticallyRemoveItem(id)}
              />
            )}
          />
        ) : (
          <p className="text-xl">You don't have any starred items yet.</p>
        )}
      </section>
    </>
  );
}
