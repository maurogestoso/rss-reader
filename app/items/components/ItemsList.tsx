import { useState } from "react";

import type { Item } from "~/db/items";
import ItemCard from "./ItemCard";

type ItemActionsArgs = {
  id: number;
  item: Item;
  optimisticallyRemoveItem: (id: number) => void;
  optimisticallyToggleStar: (id: number) => void;
};

type Props = {
  items: Item[];
  renderItemActions: (args: ItemActionsArgs) => React.ReactNode;
};
export default function ItemsList({
  items: initialItems,
  renderItemActions: itemActions,
}: Props) {
  const [items, setItems] = useState(initialItems);
  const [highlightedId, setHighlightedId] = useState<number | null>(null);

  function optimisticallyRemoveItem(itemId: number) {
    setItems(items.filter((item) => item.id !== itemId));
  }
  function optimisticallyToggleStar(itemId: number) {
    setItems(
      items.map((item) => {
        if (item.id === itemId) {
          return { ...item, starred: !item.starred };
        }
        return item;
      }),
    );
  }

  return items.map((item) => (
    <ItemCard
      key={item.id}
      item={item}
      highlighted={highlightedId === item.id}
      onClick={() => setHighlightedId(item.id)}
    >
      <ItemCard.Actions>
        {itemActions({
          id: item.id,
          item,
          optimisticallyRemoveItem,
          optimisticallyToggleStar,
        })}
      </ItemCard.Actions>
    </ItemCard>
  ));
}
