import { redirect } from "react-router";
import type { Route } from "./+types/home";
import { getSession } from "~/sessions.server";
import { getUser } from "~/db/user";
import { getAllNewItems } from "~/db/feed";

export async function loader({ request }: Route.LoaderArgs) {
  const session = await getSession(request.headers.get("Cookie"));

  const userId = session.get("userId");
  if (!userId) {
    return redirect("/login");
  }

  const user = await getUser(userId);
  if (!user) return redirect("/login");

  const newItems = await getAllNewItems();

  return { items: newItems };
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const { items } = loaderData;
  return (
    <>
      <h2 className="font-bold text-2xl">New Items:</h2>
      <ol className="list-decimal list-inside">
        {items.map(item => (
          <li key={item.id}><a href={item.link} className="text-blue-600 underline">{item.title}</a></li>))}
      </ol>
    </>
  );
}
