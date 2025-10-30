import { commitSession, getSession } from "~/sessions.server";
import type { Route } from "./+types/login";
import { data, redirect } from "react-router";
import { validateCredentials } from "~/db/auth";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Login - Mate News" },
    { name: "description", content: "An old school forum for my mates." },
  ];
}

export async function loader({ request }: Route.LoaderArgs) {
  const session = await getSession(request.headers.get("Cookie"));

  if (session.has("userId")) {
    return redirect("/");
  }

  return data(
    { error: session.get("error") },
    {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    },
  );
}

export async function action({ request }: Route.ActionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const form = await request.formData();
  const email = form.get("email") as string;
  const password = form.get("password") as string;

  const userId = await validateCredentials({ email, password });

  if (userId === null) {
    session.flash("error", "Invalid email/password");
    return redirect("/login", {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  }

  session.set("userId", userId);
  return redirect("/", {
    headers: { "Set-Cookie": await commitSession(session) },
  });
}

export default function Login({ loaderData }: Route.ComponentProps) {
  const { error } = loaderData;
  return (
    <>
      {error ? <p className="text-red-600 font-bold">{error}</p> : null}
      <form method="POST">
        <h2 className="font-bold text-2xl">Sign in</h2>

        <label htmlFor="email">
          <p>Email</p>
        </label>
        <input id="email" type="email" name="email" autoFocus />
        <label htmlFor="password">
          <p>Password</p>
        </label>
        <input id="password" type="password" name="password" />
        <br />
        <br />
        <button className="bg-black p-2 rounded-lg text-white" type="submit">
          Sign in
        </button>
      </form>
    </>
  );
}
