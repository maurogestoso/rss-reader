import { redirect } from "react-router";
import type { Route } from "./+types/read";

import { markItemAsStarred } from "~/db/items";
import { ensureUser } from "~/sessions.server";

export async function action({ request }: Route.ActionArgs) {
  const user = await ensureUser(request);
  if (!user) return redirect("/login");

  const form = await request.formData();
  console.info("/api/items/starred", form.get("itemId"));
  const id = parseInt(form.get("itemId")?.toString()!);
  await markItemAsStarred(id);

  return new Response(undefined, { status: 204 });
}
