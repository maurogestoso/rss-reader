import type { ReactNode } from "react";
import type { ItemWithFeed } from "~/db/items";
import { ROUTES } from "~/routes";

type Props = {
  item: ItemWithFeed;
  feedLink?: "internal" | "external";
  highlighted?: boolean;
  onClick?: () => void;
  children?: ReactNode;
};

export default function ItemCard({
  item,
  feedLink = "internal",
  children,
  onClick,
  highlighted,
}: Props) {
  const feedLinkHref =
    feedLink === "internal"
      ? ROUTES.FEEDS_ID.replace(":id", item.feed.id.toString())
      : item.feed.link;

  return (
    <article
      className={[
        "p-2 border rounded-lg relative",
        highlighted ? "border-red-400" : "border-stone-200",
      ].join(" ")}
      onClick={() => onClick && onClick()}
    >
      {highlighted && (
        <p className="absolute top-2 right-2 text-xs bg-red-400 text-white p-1 rounded-lg">
          Last clicked
        </p>
      )}
      <header>
        <a
          href={item.link}
          target="_blank"
          className="text-blue-600 text-xl underline"
        >
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
