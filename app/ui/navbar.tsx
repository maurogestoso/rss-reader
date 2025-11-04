import { List, Mail, Star } from "lucide-react";
import type { ComponentType, ReactNode } from "react";
import { NavLink } from "react-router";
import { ROUTES } from "~/routes";

export default function Navbar() {
  return (
    <nav className="inline-flex gap-2 p-2 bg-stone-100 rounded-xl">
      <Tab to={ROUTES.HOME} icon={Mail}>
        Unread
      </Tab>
      <Tab to={ROUTES.STARRED} icon={Star}>
        Starred
      </Tab>
      <Tab to={ROUTES.FEEDS} icon={List}>
        Feeds
      </Tab>
    </nav>
  );
}

type TabProps = {
  to: string;
  icon: ComponentType<{ className: string }>;
  children: ReactNode;
};

function Tab({ to, icon: Icon, children }: TabProps) {
  return (
    <NavLink to={to}>
      {({ isActive }) => (
        <button
          className={[
            "p-2 flex gap-1 items-center rounded-xl cursor-pointer",
            isActive && `bg-white font-bold`,
          ].join(" ")}
        >
          <Icon className={["size-4", isActive && "stroke-3"].join(" ")} />{" "}
          <span>{children}</span>
        </button>
      )}
    </NavLink>
  );
}
