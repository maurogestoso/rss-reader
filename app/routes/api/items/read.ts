import { redirect } from "react-router";
import type { Route } from "./+types/read";
import { markItemRead } from "~/db/items";

export async function action({ request }: Route.ActionArgs) {
  const form = await request.formData();
  console.info("/api/items/read", form.get("itemId"));
  const id = parseInt(form.get("itemId")?.toString()!);
  await markItemRead(id);

  return redirect("/");
}
