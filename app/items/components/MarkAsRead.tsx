import { BookOpenCheck } from "lucide-react";
import { useFetcher } from "react-router";
import { ROUTES } from "~/routes";

export default function MarkAsRead({
  itemId,
  onClick,
}: {
  itemId: number;
  onClick: () => void;
}) {
  const fetcher = useFetcher();
  return (
    <fetcher.Form
      method="POST"
      action={ROUTES.API.ITEMS.MARK_READ}
      onSubmit={(e) => {
        onClick();
        fetcher.submit(e.currentTarget);
      }}
    >
      <input type="hidden" value={itemId} name="itemId" />
      <button
        type="submit"
        className="underline text-xs cursor-pointer flex items-center gap-0.5"
      >
        <BookOpenCheck className="size-4 stroke-green-600" />{" "}
        <span>Mark as read</span>
      </button>
    </fetcher.Form>
  );
}
