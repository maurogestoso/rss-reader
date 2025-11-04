import type { Item } from "~/db/items";
import ItemCard from "./ItemCard";
import { useState } from "react";

type ItemActionsArgs = {
  id: number;
  optimisticallyRemoveItem: (id: number) => void;
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
          optimisticallyRemoveItem,
        })}
      </ItemCard.Actions>
    </ItemCard>
  ));
}
