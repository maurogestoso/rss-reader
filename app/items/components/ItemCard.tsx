import type { ReactNode } from "react";
import type { ItemWithFeed } from "~/db/items";
import { ROUTES } from "~/routes";

type Props = {
  item: ItemWithFeed;
  feedLink?: "internal" | "external";
  children?: ReactNode;
};

export default function ItemCard({
  item,
  feedLink = "internal",
  children,
}: Props) {
  const feedLinkHref =
    feedLink === "internal"
      ? ROUTES.FEEDS_ID.replace(":id", item.feed.id.toString())
      : item.feed.link;
  return (
    <article className="p-2 border border-stone-200 rounded-lg">
      <header>
        <a href={item.link} className="text-blue-600 text-xl underline">
          {item.title}
        </a>
        <a
          href={feedLinkHref}
          className="ml-2 text-gray-400 text-sm hover:underline"
        >
          ({item.feed.title})
        </a>
        <p className="text-xs text-stone-500">
          published on {item.publishedAt.toDateString()}
        </p>
      </header>

      <main className="mt-3">{children}</main>
    </article>
  );
}

ItemCard.Actions = function ({ children }: { children: ReactNode }) {
  return <div className="flex gap-2">{children}</div>;
};
