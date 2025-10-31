import { redirect } from "react-router";
import type { Route } from "./+types/add-feed";

import { ensureUser } from "~/sessions.server";
import { insertFeed } from "~/db/feeds";

export async function loader({ request }: Route.LoaderArgs) {
  const user = await ensureUser(request);
  if (!user) return redirect("/login");
}

export async function action({ request }: Route.ActionArgs) {
  const form = await request.formData();
  const feedUrl = form.get("feedUrl")?.toString()!;
  await insertFeed(feedUrl);
  return redirect("/");
}

export default function AddFeed() {
  return (
    <>
      <h2 className="font-bold text-2xl">Add feed</h2>
      <form method="POST">
        <input
          type="text"
          id="feedUrl"
          name="feedUrl"
          autoFocus
          required
          placeholder="Feed URL..."
        />
        <button
          type="submit"
          className="ml-2 px-3 py-1 rounded-lg bg-green-600 text-white"
        >
          Add
        </button>
      </form>
    </>
  );
}
