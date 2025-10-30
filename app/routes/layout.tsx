import { Link, Outlet } from "react-router";
import { getUser } from "~/db/user";
import { getSession } from "~/sessions.server";
import type { Route } from "./+types/layout";
import { Rss } from "lucide-react"

export function meta({ }: Route.MetaArgs) {
  return [{ title: "RSS Reader" }, { name: "description", content: "My home-cooked RSS Reader" }];
}

export async function loader({ request }: Route.LoaderArgs) {
  const session = await getSession(request.headers.get("Cookie"));

  const userId = session.get("userId");
  if (!userId) {
    return { user: null };
  }

  const user = await getUser(userId);
  return { user };
}

export default function AppLayout({ loaderData }: Route.ComponentProps) {
  const { user } = loaderData;
  return (
    <>
      <div className="max-w-5xl mx-auto h-screen">
        <header className="p-2 flex justify-between items-center pr-2 border-2 border-black">
          <h1 className="font-bold text-xl flex items-center gap-1">
            <Rss className="stroke-orange-600"/>
            <Link to="/">
              RSS Reader
            </Link>
          </h1>
          <div>
            {user ? (
              <Link to="/account">my account</Link>
            ) : (
              <Link to="/login">login</Link>
            )}
          </div>
        </header>
        <main className="p-2 h-full border-2 border-black border-t-0">
          <Outlet />
        </main>
      </div>
    </>
  );
}
