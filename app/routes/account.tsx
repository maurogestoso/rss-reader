import { destroySession, getSession } from "~/sessions.server";
import { getUser } from "~/db/user";
import { Link, redirect } from "react-router";
import type { Route } from "./+types/account";
import { getAllFeeds } from "~/db/feeds";

export async function loader({ request }: Route.LoaderArgs) {
  const session = await getSession(request.headers.get("Cookie"));

  const userId = session.get("userId");
  if (!userId) {
    return redirect("/login");
  }

  const user = await getUser(userId);
  if (!user) return redirect("/login");

  const feeds = await getAllFeeds();

  return { user, feeds };
}

export async function action({ request }: Route.ActionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  return redirect("/login", {
    headers: {
      "Set-Cookie": await destroySession(session),
    },
  });
}

export default function Account({ loaderData }: Route.ComponentProps) {
  const { user, feeds } = loaderData;

  return (
    <>
      <h2 className="font-bold text-2xl">{user.name}'s Account</h2>
      <form method="POST">
        <button className="bg-red-600 text-white p-2 rounded-xl">
          Log out
        </button>
      </form>
      <section>
        <h2>Feeds:</h2>
        {feeds.length ? (
          feeds.map((feed) => (
            <article>
              <a href={feed.link} className="text-blue-600 underline">
                {feed.title}
              </a>
            </article>
          ))
        ) : (
          <>
            <p>Not subscribed to any feeds yet.</p>
            <Link to="/add-feed">Add feed</Link>
          </>
        )}
      </section>
    </>
  );
}
