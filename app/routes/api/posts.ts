import type { Route } from "./+types/posts";

export function loader({ request }: Route.LoaderArgs) {
  return Response.json({ message: "I handle GET" });
}

export function action({ request }: Route.ActionArgs) {
  return Response.json({
    message: "I handle everything else",
  });
}
