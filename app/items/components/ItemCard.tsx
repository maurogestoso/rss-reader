import type { ReactNode } from "react";
import type { ItemWithFeed } from "~/db/items";

type Props = {
  item: ItemWithFeed;
  children?: ReactNode;
};

export default function ItemCard({ item, children }: Props) {
  return (
    <article className="p-2 border border-stone-200 rounded-lg">
      <div>
        <a href={item.link} className="text-blue-600 underline">
          {item.title}
        </a>
        <a
          href={item.feed.link}
          className="ml-2 text-gray-400 text-sm hover:underline"
        >
          ({item.feed.title})
        </a>
      </div>

      {children}
    </article>
  );
}

ItemCard.Actions = function ({ children }: { children: ReactNode }) {
  return <div className="mt-1 flex gap-2">{children}</div>;
};
