import { redirect } from "react-router";
import type { Route } from "./+types/read";

import { markItemAsRead } from "~/db/items";
import { ensureUser } from "~/sessions.server";

export async function action({ request }: Route.ActionArgs) {
  const user = await ensureUser(request);
  if (!user) return redirect("/login");

  const form = await request.formData();
  console.info("/api/items/read", form.get("itemId"));
  const id = parseInt(form.get("itemId")?.toString()!);
  await markItemAsRead(id);

  return redirect("/");
}
