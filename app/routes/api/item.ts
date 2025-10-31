import { redirect } from "react-router";
import type { Route } from "./+types/item";
import {
  destroySession,
  getSession,
  getUserFromSession,
} from "~/sessions.server";
import { markItemAsRead } from "~/db/items";

export async function action({ request }: Route.ActionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const user = await getUserFromSession(session);
  if (!user) {
    return redirect("/login", {
      headers: {
        "Set-Cookie": await destroySession(session),
      },
    });
  }

  const form = await request.formData();
  console.info("/api/item", form.get("action"), form.get("itemId"));

  const action = form.get("action")?.toString()!;

  if (action === "read") {
    await markItemAsRead({
      userId: user.id,
      itemId: parseInt(form.get("itemId")?.toString()!),
    });
  }

  return redirect("/");
}
