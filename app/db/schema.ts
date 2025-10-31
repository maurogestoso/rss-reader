import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const tUsers = sqliteTable("users", {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  email: text().notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  passwordSalt: text("password_salt").notNull(),
});

export const tFeeds = sqliteTable("feeds", {
  id: int().primaryKey({ autoIncrement: true }),
  title: text().notNull(),
  link: text().notNull(),
  url: text().notNull(),
  updatedAt: int({ mode: "timestamp" }),
});

export const tItems = sqliteTable("items", {
  id: int().primaryKey({ autoIncrement: true }),
  title: text().notNull(),
  link: text().notNull(),
  publishedAt: int({ mode: "timestamp" }).notNull(),
  feedId: int()
    .notNull()
    .references(() => tFeeds.id),
});

export const tUnreadItems = sqliteTable("unread_items", {
  id: int()
    .primaryKey()
    .references(() => tItems.id),
});

export const tStarredItems = sqliteTable("starred_items", {
  id: int()
    .primaryKey()
    .references(() => tItems.id),
});
