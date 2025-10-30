import type { Route } from "./+types/home";

export default function Home({}: Route.ComponentProps) {
  return (
    <>
      <h2 className="font-bold text-2xl">Home route</h2>
    </>
  );
}
