import { redirect, Form, useSubmit, Link } from "react-router";
import type { Route } from "./+types/account";

import { destroySession, ensureUser, getSession } from "~/sessions.server";
import Button from "~/ui/button";
import { DoorOpen, Download } from "lucide-react";
import { ROUTES } from "~/routes";

export async function loader({ request }: Route.LoaderArgs) {
  const user = await ensureUser(request);
  if (!user) return redirect("/login");

  return { user };
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
  return (
    <>
      <div className="flex gap-2">
        <ExportFeedsAction />
        <LogoutAction />
      </div>
      <hr className="mt-4 border-stone-500" />
    </>
  );
}

function ExportFeedsAction() {
  return (
    <Link reloadDocument to={ROUTES.API.FEEDS.EXPORT_OPML}>
      <Button
        type="submit"
        className="bg-blue-600 text-white hover:bg-blue-500"
      >
        <Download className="size-4" /> Export Feeds
      </Button>
    </Link>
  );
}

function LogoutAction() {
  return (
    <form method="POST">
      <Button className="bg-red-600 text-white">
        <DoorOpen className="size-4" /> Log out
      </Button>
    </form>
  );
}
