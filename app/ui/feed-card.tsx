import type { ReactNode } from "react";
import type { Feed } from "~/db/feeds";
import { ROUTES } from "~/routes";

type Props = {
  feed: Feed;
  children?: ReactNode;
};
export default function FeedCard({ feed, children }: Props) {
  return (
    <article className="p-2 border border-stone-200 rounded-lg">
      <header>
        <a
          href={ROUTES.FEEDS_ID.replace(":id", feed.id.toString())}
          className="text-blue-600 underline"
        >
          {feed.title}
        </a>
        <a
          href={feed.link}
          className="ml-2 text-gray-400 text-sm hover:underline"
        >
          ({stripUrl(feed.link)})
        </a>
      </header>
      <main>{children}</main>
    </article>
  );
}

const regexUrl =
  /https?:\/\/(www\.)?([-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b)([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;

function stripUrl(url: string) {
  const match = url.match(regexUrl);
  if (!match) throw new Error(`${url} should be a URL`);
  return match[2];
}
