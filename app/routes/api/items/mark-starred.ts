import { redirect } from "react-router";
import type { Route } from "./+types/mark-starred";

import { markItemAsStarred } from "~/db/items";
import { ensureUser } from "~/sessions.server";
import { ROUTES } from "~/routes";

export async function action({ request }: Route.ActionArgs) {
  const user = await ensureUser(request);
  if (!user) return redirect("/login");

  const form = await request.formData();
  const idField = form.get("itemId")?.toString();
  if (!idField)
    return new Response("`itemId` form field missing", { status: 400 });

  console.info(ROUTES.API.ITEMS.MARK_STARRED, idField);

  const id = parseInt(idField);
  await markItemAsStarred(id);

  return new Response(undefined, { status: 204 });
}
