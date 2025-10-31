import { redirect } from "react-router";
import type { Route } from "./+types/read";
import { markItemAsStarred } from "~/db/items";

export async function action({ request }: Route.ActionArgs) {
  const form = await request.formData();
  console.info("/api/items/starred", form.get("itemId"));
  const id = parseInt(form.get("itemId")?.toString()!);
  await markItemAsStarred(id);

  return redirect("/");
}
