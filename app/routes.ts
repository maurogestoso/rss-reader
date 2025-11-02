import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  layout("routes/layout.tsx", [
    index("routes/home.tsx"),
    route("/login", "routes/login.tsx"),
    route("/account", "routes/account.tsx"),
    route("/add-feed", "routes/add-feed.tsx"),
    route("/feeds", "routes/feeds.tsx"),
    route("/starred", "routes/starred.tsx"),
    route("/api/items/read", "routes/api/items/read.ts"),
    route("/api/items/starred", "routes/api/items/starred.ts"),
    route("/api/feeds/update-all", "routes/api/feeds/update-all.ts"),
  ]),
] satisfies RouteConfig;
