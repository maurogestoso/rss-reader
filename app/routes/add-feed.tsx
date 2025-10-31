import {
  destroySession,
  getSession,
  getUserFromSession,
} from "~/sessions.server";
import type { Route } from "./+types/add-feed";
import { redirect } from "react-router";
import { insertFeed } from "~/db/feed";

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
  const feedUrl = form.get("feedUrl")?.toString();
  if (!feedUrl) throw new Error("feedUrl field is empty");

  const feed = await insertFeed({ feedUrl, userId: user.id });
  redirect("/");
}
export default function AddFeed() {
  return (
    <>
      <h2 className="font-bold text-2xl">Add feed</h2>
      <form method="POST">
        <fieldset>
          <label htmlFor="feedUrl">
            <p>Feed URL</p>
          </label>
          <input type="text" id="feedUrl" name="feedUrl" autoFocus required />
        </fieldset>
        <input type="submit" value={"Add"} />
      </form>
    </>
  );
}
