import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  ACCOUNT: "/account",
  ADD_FEED: "/add-feed",
  FEEDS: "/feeds",
  STARRED: "/starred",
  API: {
    ITEMS: {
      MARK_READ: "/api/items/read",
      MARK_STARRED: "/api/items/starred",
      MARK_UNSTARRED: "/api/items/mark-unstarred",
    },
    FEEDS: {
      UPDATE_ALL: "/api/feeds/update-all",
    },
  },
};

export default [
  layout("routes/layout.tsx", [
    index("routes/home.tsx"),
    route(ROUTES.LOGIN, "routes/login.tsx"),
    route(ROUTES.ACCOUNT, "routes/account.tsx"),
    route(ROUTES.ADD_FEED, "routes/add-feed.tsx"),
    route(ROUTES.FEEDS, "routes/feeds.tsx"),
    route(ROUTES.STARRED, "routes/starred.tsx"),
    route(ROUTES.API.ITEMS.MARK_READ, "routes/api/items/read.ts"),
    route(ROUTES.API.ITEMS.MARK_STARRED, "routes/api/items/starred.ts"),
    route(
      ROUTES.API.ITEMS.MARK_UNSTARRED,
      "routes/api/items/mark-unstarred.ts",
    ),
    route(ROUTES.API.FEEDS.UPDATE_ALL, "routes/api/feeds/update-all.ts"),
  ]),
] satisfies RouteConfig;
