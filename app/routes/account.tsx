import { redirect } from "react-router";
import type { Route } from "./+types/account";

import { destroySession, ensureUser, getSession } from "~/sessions.server";
import Button from "~/ui/button";
import { DoorOpen } from "lucide-react";

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
      <form method="POST">
        <Button className="bg-red-600 text-white">
          <DoorOpen className="size-4" /> Log out
        </Button>
      </form>
      <hr className="mt-4 border-stone-500" />
    </>
  );
}
