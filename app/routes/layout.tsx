import { Link, Outlet } from "react-router";
import { getUser } from "~/db/user";
import { getSession } from "~/sessions.server";
import type { Route } from "./+types/layout";
import { Coffee, Settings } from "lucide-react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Morning Coffee Reader" },
    { name: "description", content: "My home-cooked RSS Reader" },
  ];
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
      <header className="bg-amber-100">
        <div className="flex justify-between items-center px-2 py-4 mx-auto max-w-5xl">
          <h1 className="font-bold text-xl flex items-center gap-1">
            <Coffee className="stroke-orange-600" />
            <Link to="/">Morning Coffee Reader</Link>
          </h1>
          <div>
            {user ? (
              <Link to="/account">
                <Settings className="stroke-amber-900 hover:stroke-amber-600" />
              </Link>
            ) : (
              <Link to="/login">login</Link>
            )}
          </div>
        </div>
      </header>
      <main className="mt-4 mx-auto max-w-5xl px-2 pb-20">
        <Outlet />
      </main>
      <footer className="bg-stone-200 py-4  mt-6 absolute bottom-0 w-full">
        <div className="mx-auto max-w-5xl flex justify-center gap-4">
          <p>Built with ☕ by Mauro</p>
          <a
            href="https://github.com/maurogestoso/rss-reader"
            className="underline"
          >
            {"<SourceCode />"}
          </a>
        </div>
      </footer>
    </>
  );
}
