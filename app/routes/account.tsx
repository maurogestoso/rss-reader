import { destroySession, getSession } from "~/sessions.server";
import { getUser } from "~/db/user";
import { Link, redirect } from "react-router";
import type { Route } from "./+types/account";
import { getAllFeeds } from "~/db/feeds";
import Button from "~/ui/button";
import { DoorOpen, MailPlus } from "lucide-react";

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
  const { feeds } = loaderData;

  return (
    <>
      <form method="POST">
        <Button className="bg-red-600 text-white">
          <DoorOpen className="size-4" /> Log out
        </Button>
      </form>
      <hr className="mt-4 border-stone-500" />
      <section className="mt-4">
        <h2 className="font-bold text-xl">Feeds:</h2>
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
            <div className="mt-2">
              <Link to={"/add-feed"}>
                <Button className="bg-orange-600 text-white hover:bg-orange-500">
                  <MailPlus className="size-4" /> Add feed
                </Button>
              </Link>
            </div>
          </>
        )}
      </section>
    </>
  );
}
